import rgba from "color-rgba"
import { u8 } from "../common"

export interface IndexedColor {
    readonly index: number
    readonly value: number
}

export const indexedColor = (index: number, value: number | string): IndexedColor => ({
    index,
    value: typeof value === "number" ? value : parseCSSValue(value)
})

export const toCSSValue = (color: IndexedColor): string => {
    const hx = (shift: number): string => ((color.value >> shift) & 0xff).toString(16).padStart(2, "0")
    return `#${hx(24)}${hx(16)}${hx(8)}${hx(0)}`
}

const parseCSSValue = (value: string, defaultValue: number = 0x00_00_00_ff): number => {
    const channels = rgba(value)
    if (!channels || channels.length < 4) return defaultValue
    return (
        (u8(channels[0]) << 24)
        | (u8(channels[1]) << 16)
        | (u8(channels[2]) << 8)
        | u8(channels[3] * 255)
    )
}