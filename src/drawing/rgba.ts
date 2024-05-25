import colorRgba from "color-rgba"
import { Branded } from "../common"

export type RGBA = Branded<Uint8ClampedArray, "rgba">

const clamp = (min: number, max: number, n: number) => Math.max(min, Math.min(max, n))

const asUByte = (n: number) => clamp(0, 255, Math.floor(n))

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
): RGBA => Uint8ClampedArray.of(r, g, b, a) as RGBA

const hex = (n: number): string => n.toString(16).padStart(2, "0")

const toString = (value: RGBA, format: "hex" | "rgba" = "hex"): string => {
    const { r, g, b, a } = split(value)
    return (
        format === "hex"
            ? `#${hex(r)}${hex(g)}${hex(b)}${a !== 255 ? hex(a) : ""}`
            : `rgba(${r}, ${g}, ${b}, ${a})`
    )
}

const fromString = (colorStr: string): RGBA => {
    const channels = colorRgba(colorStr)
    const [r, g, b, a] = (!channels || channels.length < 4) ? [0, 0, 0, 1] : channels
    return pack(r, g, b, a * 255)
}

const shift = (value: RGBA, offset: number, alphaOffset: number = 0): RGBA => {
    const { r, g, b, a } = split(value)
    return pack(
        asUByte(r + offset),
        asUByte(g + offset),
        asUByte(b + offset),
        asUByte(a + alphaOffset),
    )
}

const equals = (color1: RGBA, color2: RGBA): boolean => {
    for (let i = 0; i < 4; i++) {
        if (color1[i] !== color2[i]) return false
    }
    return true
}

const copy = (source: RGBA, target: RGBA) => {
    for (let i = 0; i < 4; i++) {
        target[i] = source[i]
    }
}

export const rgba = {
    copy,
    equals,
    zero: () => Uint8ClampedArray.of(0, 0, 0, 0) as RGBA,
    fromString,
    pack,
    shift,
    split,
    toString,
    transparent: Uint8ClampedArray.of(0, 0, 0, 0) as RGBA,
} as const