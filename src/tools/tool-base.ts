import { Point } from "../common";
import { Bitmap } from "../schema";
import { Tool } from "./tool";
import { ToolOptions, ToolResult } from "./tool-result";

export abstract class ToolBase implements Tool {
    abstract start(pt: Point, bmp: Bitmap): void

    abstract moveTo(pt: Point): void

    abstract end(pt: Point): ToolResult | undefined

    protected ctx: CanvasRenderingContext2D | undefined

    protected opt: ToolOptions = {
        color: "black",
        brushSize: 1
    }

    protected bmp: Bitmap | undefined = undefined

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
    }

    cancel(): void {
        this.reset()
    }

    protected clear() {
        if (this.context) {
            this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)
        }
    }

    protected reset() {
        this.clear()
        this.bmp = undefined
    }
}
