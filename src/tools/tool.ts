import { Point } from "../common"
import { Bitmap } from "../schema"
import { ToolOptions, ToolResult } from "./tool-result"

export interface Tool {
    start(pt: Point, bmp: Bitmap): void
    moveTo(pt: Point): void
    end(pt: Point): ToolResult | undefined
    cancel(): void
    options: ToolOptions
    context: CanvasRenderingContext2D | undefined
    readonly tag: string
}

export interface ToolFactory {
    new(): Tool
}

export const createTool = (factory: ToolFactory): Tool => new factory()