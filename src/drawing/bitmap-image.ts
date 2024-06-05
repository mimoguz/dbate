import { Rect, clamp } from "../common"
import { Color } from "./color"
import pako from "pako"
import { Buffer } from "buffer"

export class BitmapImage {
    constructor(width: number, height: number, bytes?: Uint8ClampedArray) {
        const w = Math.floor(clamp(1, BitmapImage.MAX_DIMENSION, width))
        const h = Math.floor(clamp(1, BitmapImage.MAX_DIMENSION, height))
        if (bytes) {
            if (bytes.length !== w * h * 4) {
                throw new Error(`Bitmap.constructor: The size of the source array is incorrect. Expected: ${w * h * 4}, got: ${bytes.length}`)
            }
            this.bytes = bytes
        } else {
            this.bytes = new Uint8ClampedArray(w * h * 4).fill(0)
        }
        this.width = w
        this.height = h
    }

    readonly width: number
    readonly height: number
    private readonly bytes: Uint8ClampedArray

    getImageData(): ImageData {
        return new ImageData(this.bytes, this.width, this.height)
    }

    async getDataURL(): Promise<string> {
        const canvas = new OffscreenCanvas(this.width, this.height)
        this.draw(canvas.getContext("2d")!)
        const blob = await canvas.convertToBlob()
        return await new Promise((callback: (value: string) => void) => {
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                if (typeof reader.result === "string") callback(reader.result)
            })
            reader.readAsDataURL(blob)
        })
    }

    clone(): BitmapImage {
        return new BitmapImage(this.width, this.height, this.bytes.slice())
    }

    contains(x: number, y: number): boolean {
        return (
            x >= 0 && x < this.width
            && y >= 0 && y < this.height
        )
    }

    /** Returns a copy of the requested pixel */
    get(x: number, y: number): Color {
        return Color.slice(this.bytes, this.offset(x, y))
    }

    /** Returns a view of the requested pixel */
    getView(x: number, y: number): Color {
        const offset = this.offset(x, y)
        return new Color(this.bytes.subarray(offset, offset + 4))
    }

    /** Copies the requested pixel to the destination color
     * @returns dest
     */
    sample(x: number, y: number, dest: Color): Color {
        dest.read(this.bytes, this.offset(x, y))
        return dest
    }

    set(x: number, y: number, color: Color) {
        color.write(this.bytes, this.offset(x, y))
    }

    mix(x: number, y: number, color: Color) {
        color.mix(this.bytes, this.offset(x, y))
    }

    fill(rect: Rect, color: Color, mix: boolean = false) {
        const method = (mix ? color.mix : color.write).bind(color)
        const left = Math.max(rect.x, 0)
        const right = Math.min(rect.x + rect.w, this.width)
        const top = Math.max(rect.y, 0)
        const bottom = Math.min(rect.y + rect.h, this.height)
        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                method(this.bytes, this.offset(x, y))
            }
        }
    }

    modify(pixelFilter: (x: number, y: number, sample: Color) => void) {
        const sample = Color.zero()
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                sample.view(this.bytes, this.offset(x, y))
                pixelFilter(x, y, sample)
            }
        }
    }

    copy(dest: BitmapImage, srcRect?: Rect, destRect?: Rect) {
        const sr = srcRect ?? { x: 0, y: 0, w: this.width, h: this.height }
        const dr = destRect ?? { x: 0, y: 0, w: dest.width, h: dest.height }

        // Fix source rectangle
        sr.x = clamp(0, this.width, sr.x)
        sr.y = clamp(0, this.height, sr.y)
        sr.w = Math.min(sr.w, this.width - sr.x)
        sr.h = Math.min(sr.h, this.height - sr.y)

        // Fix destination rectangle
        dr.x = clamp(0, dest.width, dr.x)
        dr.y = clamp(0, dest.height, dr.y)
        dr.w = Math.min(dr.w, dest.width - dr.x)
        dr.h = Math.min(dr.h, dest.height - dr.y)

        // Real size
        const rw = Math.min(sr.w, dr.w)
        const rh = Math.min(sr.h, sr.h)

        if (rw <= 0 || rh <= 0) return

        const rowLength = rw * 4
        for (let row = 0; row < rh; row++) {
            const srcOffset = this.offset(sr.x, sr.y + row)
            const destOffset = dest.offset(dr.x, dr.y + row)
            dest.bytes.set(this.bytes.subarray(srcOffset, srcOffset + rowLength), destOffset)
        }
    }

    draw(context: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D, colorTransform: (color: Color) => Color = c => c) {
        context.save()
        const lastSample = Color.zero()
        context.fillStyle = colorTransform(lastSample).hex
        const sample = Color.zero()
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.sample(x, y, sample)
                if (sample.ne(lastSample)) {
                    sample.copy(lastSample)
                    context.fillStyle = colorTransform(sample).hex
                }
                context.fillRect(x, y, 1, 1)
            }
        }
        context.restore()
    }

    toJSON(): string {
        const base64 = Buffer.from(pako.deflate(this.bytes)).toString("base64")
        return JSON.stringify({
            width: this.width,
            height: this.height,
            data: base64
        })
    }

    private offset(x: number, y: number): number {
        return (y * this.width + x) * 4
    }

    static fromJSON(source: string): BitmapImage | undefined {
        try {
            const json = JSON.parse(source)
            const width: number = typeof json["width"] === "number" ? json["width"] : Number.MIN_SAFE_INTEGER
            if (width <= 0 || width > BitmapImage.MAX_DIMENSION) throw new Error("Bitmap.fromJSON: width isn't valid")

            const height: number = typeof json["height"] === "number" ? json["height"] : Number.MIN_SAFE_INTEGER
            if (height <= 0 || height > BitmapImage.MAX_DIMENSION) throw new Error("Bitmap.fromJSON: height isn't valid")

            const data = typeof json["data"] === "string" ? json["data"] : ""
            const bytes = pako.inflate(Buffer.from(data, "base64"))
            if (bytes.length !== (width * height * 4)) {
                throw new Error(`Bitmap.fromJSON: Invalid data length. Expected ${width * height * 4}, got ${bytes.length}`)
            }

            return new BitmapImage(width, height, new Uint8ClampedArray(bytes))
        } catch (e) {
            console.error(e instanceof Error ? e.message : e)
            return undefined
        }
    }

    static readonly MAX_DIMENSION = 4096
}
