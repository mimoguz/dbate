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

const toString = (value: RGBA): string => {
    const { r, g, b, a } = split(value)
    return `rgb(${r}, ${g}, ${b}, ${a})`
}

const fromString = (colorStr: string): RGBA => {
    const [r, g, b, a] = colorRgba(colorStr) ?? [0, 0, 0, 1]
    return pack(r, g, b, a * 255)
}

const shift = (value: RGBA, offset: number): RGBA => {
    const { r, g, b, a } = split(value)
    return pack(
        asUByte(r + offset),
        asUByte(g + offset),
        asUByte(b + offset),
        a
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