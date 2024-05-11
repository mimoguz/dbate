import { Point } from "../common"
import { Bitmap } from "../schema"
import { ToolOptions, ToolResult } from "./tool-result"

export interface Tool {
    start(point: Point, bmp: Bitmap, options: ToolOptions): void
    moveTo(point: Point): void
    end(point: Point): ToolResult | undefined
    cancel(): void
}

export interface ToolFactory {
    new(context: CanvasRenderingContext2D): Tool
}

export const createTool = (factory: ToolFactory, context: CanvasRenderingContext2D): Tool => new factory(context)