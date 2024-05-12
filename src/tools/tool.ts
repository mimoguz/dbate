import { Point } from "../common"
import { Bitmap } from "../schema"
import { ToolOptions, ToolResult } from "./tool-result"

export interface Tool {
    start(point: Point, bmp: Bitmap): void
    moveTo(point: Point): void
    end(point: Point): ToolResult | undefined
    cancel(): void
    options: ToolOptions
    context: CanvasRenderingContext2D | undefined
    get tag(): string
}

export interface ToolFactory {
    new(): Tool
    readonly toolTag: string
}

export const createTool = (factory: ToolFactory): Tool => new factory()