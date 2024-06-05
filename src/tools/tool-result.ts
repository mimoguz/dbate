import { BitmapImage } from "../drawing"

export interface ToolOptions {
    color: string
    brushSize: number
}

export interface ToolAffectsBitmap {
    tag: "affects-bitmap"
    value: BitmapImage
}

export interface ToolAffectsOptions {
    tag: "affects-options"
    value: ToolOptions
}

export type ToolResult = ToolAffectsBitmap | ToolAffectsOptions

export const resultBitmap = (bmp: BitmapImage): ToolAffectsBitmap => ({
    tag: "affects-bitmap",
    value: bmp
})

export const resultOptions = (options: ToolOptions): ToolAffectsOptions => ({
    tag: "affects-options",
    value: options
})