import { Bitmap } from "../schema"

export interface ToolOptions {
    color: string
    brushSize: number
}

export interface ToolAffectsBitmap {
    tag: "affects-bitmap"
    value: Bitmap
}

export interface ToolAffectsTools {
    tag: "affects-tools"
    value: ToolOptions
}

export type ToolResult = ToolAffectsBitmap | ToolAffectsTools