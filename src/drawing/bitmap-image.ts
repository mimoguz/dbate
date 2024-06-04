import { Rect, clamp } from "../common"
import { Color } from "./color"

export class BitmapImage {
    constructor(width: number, height: number, bytes?: Uint8ClampedArray) {
        const w = Math.floor(clamp(1, BitmapImage.MAX_DIMENSION, width))
        const h = Math.floor(clamp(1, BitmapImage.MAX_DIMENSION, height))
        if (bytes) {
            if (bytes.length !== w * h * 4) {
                throw new Error(`The size of the source array is incorrect. Expected: ${w * h * 4}, got: ${bytes.length}`)
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

    get data(): ImageData {
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
        const right = rect.x + rect.w
        const bottom = rect.y + rect.h
        for (let y = rect.y; y < bottom; y++) {
            if (y >= this.height) break
            for (let x = rect.x; x < right; x++) {
                if (x >= this.width) break
                if (this.contains(x, y)) method(this.bytes, this.offset(x, y))
            }
        }
    }

    private offset(x: number, y: number): number {
        return (y * this.width + x) * 4
    }

    static readonly MAX_DIMENSION = 4096
}