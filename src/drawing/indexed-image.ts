import { Buffer } from "buffer"
import pako from "pako"
import { Rect, clamp, u8 } from "../common"
import { IndexedColor, toCSSValue } from "./indexed-color"

export class IndexedImage {
    constructor(width: number, height: number, bytes: Uint8ClampedArray) {
        const w = Math.floor(clamp(1, IndexedImage.MAX_DIMENSION, width))
        const h = Math.floor(clamp(1, IndexedImage.MAX_DIMENSION, height))
        if (bytes.length !== w * h) {
            throw new Error(`Bitmap.IndexedImage: The size of the source array is incorrect. Expected: ${w * h}, got: ${bytes.length}`)
        }
        this.bytes = bytes
        this.width = w
        this.height = h
    }

    readonly width: number
    readonly height: number
    private readonly bytes: Uint8ClampedArray

    async getDataURL(): Promise<string> {
        const gray = (n: number): number => {
            const c = u8(n)
            return ((c << 24) | (c << 16) | (c << 8) | 0xff)
        }
        const canvas = new OffscreenCanvas(this.width, this.height)
        this.draw(canvas.getContext("2d")!, gray)
        const blob = await canvas.convertToBlob()
        return await new Promise((callback: (value: string) => void) => {
            const reader = new FileReader()
            reader.addEventListener("load", () => {
                if (typeof reader.result === "string") callback(reader.result)
            })
            reader.readAsDataURL(blob)
        })
    }

    clone(): IndexedImage {
        return new IndexedImage(this.width, this.height, this.bytes.slice())
    }

    contains(x: number, y: number): boolean {
        return (
            x >= 0 && x < this.width
            && y >= 0 && y < this.height
        )
    }

    /** Returns the index value of the requested pixel */
    get(x: number, y: number): number {
        return this.bytes[this.offset(x, y)]
    }

    set(x: number, y: number, value: number) {
        this.bytes[this.offset(x, y)] = u8(value)
    }

    fill(rect: Rect, value: number) {
        const v = u8(value)
        const left = Math.max(rect.x, 0)
        const right = Math.min(rect.x + rect.w, this.width)
        const top = Math.max(rect.y, 0)
        const bottom = Math.min(rect.y + rect.h, this.height)
        for (let y = top; y < bottom; y++) {
            for (let x = left; x < right; x++) {
                this.set(x, y, v)
            }
        }
    }

    modify(pixelFilter: (x: number, y: number, value: number) => number) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const v = this.get(x, y)
                this.set(x, y, u8(pixelFilter(x, y, v)))
            }
        }
    }

    replace(from: number, to: number) {
        const v = u8(to)
        for (let i = 0; i < this.bytes.length; i++) {
            if (from === this.bytes[i]) this.bytes[i] = v
        }
    }

    bulkReplace(lookup: Map<number, number>) {
        for (let i = 0; i < this.bytes.length; i++) {
            const v = lookup.get(this.bytes[i])
            if (v !== undefined) this.bytes[i] = u8(v)
        }
    }

    copy(dest: IndexedImage, srcRect?: Rect, destRect?: Rect) {
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

        for (let row = 0; row < rh; row++) {
            const srcOffset = this.offset(sr.x, sr.y + row)
            const destOffset = dest.offset(dr.x, dr.y + row)
            dest.bytes.set(this.bytes.subarray(srcOffset, srcOffset + rw), destOffset)
        }
    }

    draw(
        context: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
        lookup: Array<IndexedColor> | ((index: number) => number),
        colorTransform: (color: number) => number = c => c
    ) {
        const color = Array.isArray(lookup)
            ? ((index: number) => lookup.at(index)?.value ?? 0)
            : lookup
        context.save()
        let lastIndex = 0
        context.fillStyle = toCSSValue(colorTransform(color(0)))
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = this.get(x, y)
                if (index !== lastIndex) {
                    lastIndex = index
                    context.fillStyle = toCSSValue(colorTransform(color(index)))
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
        return (y * this.width + x)
    }

    static fromJSON(source: string): IndexedImage | undefined {
        try {
            const json = JSON.parse(source)
            const width: number = typeof json["width"] === "number" ? json["width"] : Number.MIN_SAFE_INTEGER
            if (width <= 0 || width > IndexedImage.MAX_DIMENSION) throw new Error("Bitmap.fromJSON: width isn't valid")

            const height: number = typeof json["height"] === "number" ? json["height"] : Number.MIN_SAFE_INTEGER
            if (height <= 0 || height > IndexedImage.MAX_DIMENSION) throw new Error("Bitmap.fromJSON: height isn't valid")

            const data = typeof json["data"] === "string" ? json["data"] : ""
            const bytes = pako.inflate(Buffer.from(data, "base64"))
            if (bytes.length !== (width * height)) {
                throw new Error(`Bitmap.fromJSON: Invalid data length. Expected ${width * height}, got ${bytes.length}`)
            }

            return new IndexedImage(width, height, new Uint8ClampedArray(bytes))
        } catch (e) {
            console.error(e instanceof Error ? e.message : e)
            return undefined
        }
    }

    static readonly MAX_DIMENSION = 4096
}
