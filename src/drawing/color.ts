import rgba from "color-rgba"
import { u8 } from "../common"

/** RGBA8888 color type.
 * All instances share the given source array, so it can be a view over a bigger array
 */
export class Color {
    constructor(bytes: Uint8ClampedArray) {
        if (bytes.length !== 4) throw new Error("Color.constructor: Invalid source array length")
        this.bytes = bytes
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

    /** Check if this color and the parameter are structurally equal */
    eq(that: Color): boolean {
        return this === that || (
            this.bytes[0] === that.bytes[0]
            && this.bytes[1] === that.bytes[1]
            && this.bytes[2] === that.bytes[2]
            && this.bytes[3] === that.bytes[3]
        )
    }

    /** Check if this color and the parameter are structurally NOT equal */
    ne(that: Color): boolean {
        return !this.eq(that)
    }

    /** Copy the contents of the source array from offset until offset + 4 to this
     * @returns this
     */
    read(src: Uint8ClampedArray, offset: number): Color {
        this.bytes.set(src.subarray(offset, offset + 4))
        return this
    }

    /** Creates a view of the source array from offset until offset + 4
     * @returns this
     */
    view(src: Uint8ClampedArray, offset: number): Color {
        this.bytes = src.subarray(offset, offset + 4)
        return this
    }

    /** Copy this to the destination array from offset until offset + 4 */
    write(dest: Uint8ClampedArray, offset: number) {
        dest.set(this.bytes, offset)
    }

    /** Alpha-mix this with the destination array from offset until offset + 4 */
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

    /** Copy the contents of this to the destination color
     * @returns dest
     */
    copy(dest: Color): Color {
        dest.bytes.set(this.bytes)
        return dest
    }

    /** Deep-clone of this
     * @returns A new color that is structurally equals to this 
     */
    clone(): Color {
        return new Color(this.bytes.slice())
    }

    /** Shift the channels by the given offset
     * @returns this
     */
    shift(offset: number, alphaOffset: number = 0): Color {
        this.bytes[0] = u8(this.bytes[0] + offset)
        this.bytes[1] = u8(this.bytes[1] + offset)
        this.bytes[2] = u8(this.bytes[2] + offset)
        this.bytes[3] = u8(this.bytes[3] + alphaOffset)
        return this
    }

    static pack(r: number, g: number, b: number, a: number): Color {
        return new Color(Uint8ClampedArray.of(u8(r), u8(g), u8(b), u8(a)))
    }

    static zero(): Color {
        return Color.pack(0, 0, 0, 0)
    }

    /** Copy the contents of the source array from offset until offset + 4 to a new color
     * @returns Sampled color
     */
    static slice(src: Uint8ClampedArray, offset: number) {
        return Color.zero().read(src, offset)
    }

    static fromCSSColor(color: string, defaultValue?: Color): Color | undefined {
        const channels = rgba(color)
        if (!channels || channels.length < 4) return defaultValue
        return Color.pack(channels[0], channels[1], channels[2], channels[3] * 255)
    }
}

