import colorRgba from "color-rgba"
import { Branded } from "../common"

export type RGBA = Branded<number, "rgba">

const clamp = (min: number, max: number, n: number) => Math.max(min, Math.min(max, n))

const asUByte = (n: number) => clamp(0, 255, Math.floor(n))

const split = (value: RGBA): {
    r: number
    g: number
    b: number
    a: number
} => ({
    r: (value >> 24) & 0xff,
    g: (value >> 16) & 0xff,
    b: (value >> 8) & 0xff,
    a: value & 0xff,
})

const pack = (
    r: number,
    g: number,
    b: number,
    a: number = 255
): RGBA => (
    ((asUByte(r) & 0xff) << 24) |
    ((asUByte(g) & 0xff) << 16) |
    ((asUByte(b) & 0xff) << 8) |
    (asUByte(a) & 0xff)
) as RGBA

const hex = (n: number): string => n.toString(16).padStart(2, "0")

const toString = (value: RGBA, format: "hex" | "rgba" = "hex"): string => {
    const { r, g, b, a } = split(value)
    return (
        format === "hex"
            ? `#${hex(r)}${hex(g)}${hex(b)}${hex(a)}`
            : `rgba(${r}, ${g}, ${b}, ${a})`
    )
}

const fromString = (colorStr: string): RGBA => {
    const [r, g, b, a] = colorRgba(colorStr) ?? [0, 0, 0, 1]
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

export const rgba = {
    fromString,
    pack,
    shift,
    split,
    toString,
    transparent: 0 as RGBA
} as const