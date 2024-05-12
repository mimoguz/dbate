import { Point } from "../common"
import { Bitmap } from "../schema"
import { ToolOptions, ToolResult } from "./tool-result"

export interface Tool {
    start(point: Point, bmp: Bitmap): void
    moveTo(point: Point): void
    end(point: Point): ToolResult | undefined
    cancel(): void
    get tag(): string
    readonly context: CanvasRenderingContext2D
}

export interface ToolFactory {
    new(context: CanvasRenderingContext2D, options: ToolOptions): Tool
    readonly toolTag: string
}

export const createTool = (
    factory: ToolFactory,
    context: CanvasRenderingContext2D,
    options: ToolOptions
): Tool => new factory(context, options)