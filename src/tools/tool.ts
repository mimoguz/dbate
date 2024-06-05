import { Point } from "../common"
import { BitmapImage } from "../drawing"
import { ToolOptions, ToolResult } from "./tool-result"

export interface Tool {
    start(pt: Point, bmp: BitmapImage): void
    moveTo(pt: Point): void
    end(pt: Point): ToolResult | undefined
    cancel(): void
    options: ToolOptions
    context: CanvasRenderingContext2D | undefined
}
