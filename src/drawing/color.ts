import rgba from "color-rgba"
import { u8 } from "../common"

export class Color {
    constructor(r: number, g: number, b: number, a: number) {
        this.bytes = Uint8ClampedArray.of(u8(r), u8(g), u8(b), u8(a))
    }

    private bytes: Uint8ClampedArray

    get red(): number { return this.bytes[0] }
    get green(): number { return this.bytes[1] }
    get blue(): number { return this.bytes[2] }
    get alpha(): number { return this.bytes[3] }

    set red(n: number) { this.bytes[0] = u8(n) }
    set green(n: number) { this.bytes[1] = u8(n) }
    set blue(n: number) { this.bytes[2] = u8(n) }
    set alpha(n: number) { this.bytes[3] = u8(n) }

    get hex(): string {
        const hx = (channel: number): string => this.bytes[channel].toString(16).padStart(2, "0")
        return `#${hx(0)}${hx(1)}${hx(2)}${this.alpha !== 255 ? hx(3) : ""}`
    }

    get rgba(): string {
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
    }

    get isTransparent(): boolean {
        return this.alpha === 0
    }

    get isOpaque(): boolean {
        return this.alpha === 255
    }

    eq(that: Color): boolean {
        return this === that || (
            this.bytes[0] === that.bytes[0]
            && this.bytes[1] === that.bytes[1]
            && this.bytes[2] === that.bytes[2]
            && this.bytes[3] === that.bytes[3]
        )
    }

    ne(that: Color): boolean {
        return !that.eq(that)
    }

    read(src: Uint8ClampedArray, offset: number) {
        this.bytes.set(src.subarray(offset, offset + 4))
    }

    write(dest: Uint8ClampedArray, offset: number) {
        dest.set(this.bytes, offset)
    }

    mix(dest: Uint8ClampedArray, offset: number) {
        if (this.isOpaque) {
            this.write(dest, offset)
            return
        }
        const destWeight = dest[offset + 3] / 255.0
        const weight = this.alpha / 255.0
        dest[offset] = u8(dest[offset] * destWeight + this.bytes[0] * weight)
        dest[offset + 1] = u8(dest[offset + 1] * destWeight + this.bytes[1] * weight)
        dest[offset + 2] = u8(dest[offset + 2] * destWeight + this.bytes[2] * weight)
        dest[offset + 3] = u8(dest[offset + 3] + this.bytes[3])
    }

    static zero(): Color {
        return new Color(0, 0, 0, 0)
    }

    static slice(src: Uint8ClampedArray, offset: number) {
        const result = Color.zero()
        result.read(src, offset)
        return result
    }

    static fromCSSColor(color: string, defaultValue?: Color): Color | undefined {
        const channels = rgba(color)
        if (!channels || channels.length < 4) return defaultValue
        return new Color(channels[0], channels[1], channels[2], channels[3] * 255)
    }
}

