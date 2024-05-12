import { Point, point } from "../common"
import { Tool } from "./tool"
import { ToolOptions, ToolResult } from "./tool-result"

export class NoopTool implements Tool {
    readonly tag: string = "noop"

    private ctx: CanvasRenderingContext2D | undefined

    private opt: ToolOptions = {
        color: "black",
        brushSize: 0
    }

    private shift: number = 0

    private pt: Point = point.outside()

    get context(): CanvasRenderingContext2D | undefined {
        return this.ctx
    }

    set context(value: CanvasRenderingContext2D | undefined) {
        this.ctx = value
    }

    get options(): ToolOptions {
        return this.opt
    }

    set options(value: ToolOptions) {
        this.opt = value
        this.shift = Math.floor((value.brushSize - (value.brushSize % 2 === 0 ? 1 : 0)) / 2)
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
        if (this.context) {
            this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)
        }
        this.pt = point.outside()
        // console.log("noop tool was cancelled")
    }

    private move(pt: Point) {
        if (!point.equals(pt, this.pt)) this.drawCursor(pt)
        this.pt = pt
        // console.log("cursor moved")
    }

    private drawCursor(pt: Point) {
        if (!this.context) return
        this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)
        this.context.fillRect(pt.x - this.shift, pt.y - this.shift, this.opt.brushSize, this.opt.brushSize)
    }
}