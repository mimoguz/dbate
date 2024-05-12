import { Point, point } from "../common"
import { Tool } from "./tool"
import { ToolResult } from "./tool-result"

export class NoopTool implements Tool {
    constructor(context: CanvasRenderingContext2D) {
        this.context = context
    }

    static readonly toolTag: string = "noop"

    readonly context: CanvasRenderingContext2D

    private pt: Point = point.outside()

    get tag(): string {
        return NoopTool.toolTag
    }

    start(pt: Point): void {
        this.drawCursor(pt)
    }

    moveTo(pt: Point): void {
        this.move(pt)
    }

    end(pt: Point): ToolResult | undefined {
        this.move(pt)
        return undefined
    }

    cancel(): void {
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)
        this.pt = point.outside()
        // console.log("noop tool was cancelled")
    }

    private move(pt: Point) {
        if (!point.equals(pt, this.pt)) this.drawCursor(pt)
        this.pt = pt
        // console.log("cursor moved")
    }

    private drawCursor(pt: Point) {
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)
        this.context.fillRect(pt.x, pt.y, 1, 1)
    }
}