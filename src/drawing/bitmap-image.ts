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

    clone(): BitmapImage {
        return new BitmapImage(this.width, this.height, this.bytes.slice())
    }

    contains(x: number, y: number): boolean {
        return (
            x >= 0 && x < this.width
            && y >= 0 && y < this.height
        )
    }

    get(x: number, y: number) {
        return Color.slice(this.bytes, this.offset(x, y))
    }

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
        const method = mix ? color.mix : color.write
        const left = Math.max(rect.x, 0)
        const right = Math.min(rect.x + rect.w, this.width)
        const top = Math.max(rect.y, 0)
        const bottom = Math.min(rect.y + rect.h, this.height)
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                method(this.bytes, this.offset(x, y))
            }
        }
    }

    copy(dest: BitmapImage, srcRect?: Rect, destRect?: Rect) {
        // Source rectangle
        const [sx, sy] = srcRect ? [clamp(0, this.width, srcRect.x), clamp(0, this.width, srcRect.x)] : [0, 0]
        const [sw, sh] = srcRect ? [Math.min(srcRect.w, this.width - sx), Math.min(srcRect.h, this.height - sy)] : [this.width, this.height]

        // Destination rectangle
        const [dx, dy] = destRect ? [clamp(0, dest.width, destRect.x), clamp(0, dest.width, destRect.x)] : [0, 0]
        const [dw, dh] = destRect ? [Math.min(destRect.w, dest.width - dx), Math.min(destRect.h, dest.height - dy)] : [dest.width, dest.height]

        // Real size
        const rw = Math.min(sw, dw)
        const rh = Math.min(sh, dh)

        if (rw <= 0 || rh <= 0) return

        const rowLength = rw * 4
        for (let row = 0; row < rh; row++) {
            const srcOffset = this.offset(sx, sy + row)
            const destOffset = dest.offset(dx, dy + row)
            dest.bytes.set(this.bytes.subarray(srcOffset, srcOffset + rowLength), destOffset)
        }
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
            const json = JSON.parse(source, (key, value) => {
                switch (key) {
                    case "width":
                    case "height":
                        if (typeof value === "number" && value > 0 && value <= BitmapImage.MAX_DIMENSION) {
                            return value
                        }
                        throw new Error(`Bitmap.fromJSON: Invalid ${key} ${value}`)
                    case "data":
                        if (typeof value === "string") {
                            return pako.inflate(Buffer.from(value, "base64"))
                        }
                        throw new Error("Bitmap.fromJSON: Invalid data")
                    default:
                        throw new Error(`Bitmap.fromJSON: Unknown field: ${key}`)
                }
            })

            const width: number = json["width"]
            const height: number = json["height"]
            const data: Uint8Array = json["data"]
            if (data.length !== (width * height * 4)) throw new Error("Bitmap.fromJSON: Invalid data length")
            return new BitmapImage(width, height, new Uint8ClampedArray(data))
        } catch (e) {
            console.error(e instanceof Error ? e.message : e)
            return undefined
        }
    }

    static readonly MAX_DIMENSION = 4096
}
