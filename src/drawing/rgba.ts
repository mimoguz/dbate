import colorRgba from "color-rgba"
import { Branded } from "../common"

export type RGBA = Branded<Uint8ClampedArray, "rgba">

const clamp = (min: number, max: number, n: number) => Math.max(min, Math.min(max, n))

const asUByte = (n: number) => clamp(0, 255, Math.floor(n))

declare global {
    interface Uint8ClampedArray {
        r: number
        g: number
        b: number
        a: number
    }
}

Object.defineProperty(Uint8ClampedArray.prototype, "r", {
    get(this) { return this[0] },
    set(this, value: number) { this[0] = asUByte(value) }
})

Object.defineProperty(Uint8ClampedArray.prototype, "g", {
    get(this) { return this[1] },
    set(this, value: number) { this[1] = asUByte(value) }
})

Object.defineProperty(Uint8ClampedArray.prototype, "b", {
    get(this) { return this[2] },
    set(this, value: number) { this[2] = asUByte(value) }
})

Object.defineProperty(Uint8ClampedArray.prototype, "a", {
    get(this) { return this[3] },
    set(this, value: number) { this[3] = asUByte(value) }
})

const split = (value: RGBA): {
    r: number
    g: number
    b: number
    a: number
} => {
    const [r, g, b, a] = value
    return { r, g, b, a }
}

const pack = (
    r: number,
    g: number,
    b: number,
    a: number = 255
): RGBA => Uint8ClampedArray.of(asUByte(r), asUByte(g), asUByte(b), asUByte(a)) as RGBA

const hex = (n: number): string => n.toString(16).padStart(2, "0")

const toString = (value: RGBA, format: "hex" | "rgba" = "hex"): string => {
    return (
        format === "hex"
            ? `#${hex(value.r)}${hex(value.g)}${hex(value.b)}${value.a !== 255 ? hex(value.a) : ""}`
            : `rgba(${value.r}, ${value.g}, ${value.b}, ${value.a})`
    )
}

const fromString = (colorStr: string): RGBA => {
    const channels = colorRgba(colorStr)
    const [r, g, b, a] = (!channels || channels.length < 4) ? [0, 0, 0, 1] : channels
    return pack(r, g, b, a * 255)
}

const shift = (value: RGBA, offset: number, alphaOffset: number = 0): RGBA => {
    return pack(
        asUByte(value.r + offset),
        asUByte(value.g + offset),
        asUByte(value.b + offset),
        asUByte(value.a + alphaOffset),
    )
}

const equals = (color1: RGBA, color2: RGBA): boolean => (
    color1.r === color2.r
    && color1.g === color2.g
    && color1.b === color2.b
    && color1.a === color2.a
)

const copy = (source: RGBA, target: RGBA) => {
    target.r = source.r
    target.g = source.g
    target.b = source.b
    target.a = source.a
}

export const rgba = {
    copy,
    equals,
    zero: () => pack(0, 0, 0, 0),
    fromString,
    pack,
    shift,
    split,
    toString,
    /**  Some functions mutate the passed color. Use this only for comparison. */
    transparent: pack(0, 0, 0, 0),
} as const