import { Point, point } from "../common";
import { BitmapImage } from "../drawing";
import { Tool } from "./tool";
import { ToolOptions, ToolResult } from "./tool-result";

/**
 * Base class for tools.
 * Override handle... methods to add functionality 
 * */
export abstract class ToolBase implements Tool {
    protected handleInit(): void { }
    protected handleStart(): void { }
    protected handleProgress(): void { }
    protected handleEnd(): ToolResult | undefined { return undefined }
    protected handleCancel(): void { }
    protected handleOptionsChanged(): void { }
    protected handleContextChanged(): void { }

    protected handleCursor(currentPt: Point): void {
        this.clear()
        this.ctx?.fillRect(currentPt.x, currentPt.y, 1, 1)
    }

    private ctx: CanvasRenderingContext2D | undefined

    private opt: ToolOptions = {
        color: "black",
        brushSize: 1
    }

    protected isDrawing: boolean = false

    protected pt: Point = point.outside()

    protected bmp: BitmapImage | undefined = undefined

    get context(): CanvasRenderingContext2D | undefined {
        return this.ctx
    }

    set context(value: CanvasRenderingContext2D | undefined) {
        this.ctx = value
        this.handleContextChanged()
    }

    get options(): ToolOptions {
        return this.opt
    }

    set options(value: ToolOptions) {
        this.opt = value
        this.handleOptionsChanged()
    }

    start(pt: Point, bmp: BitmapImage) {
        this.bmp = bmp
        this.pt = pt
        this.isDrawing = true
        this.handleStart()
    }

    moveTo(pt: Point): void {
        if (point.equals(pt, this.pt)) return
        this.pt = pt
        if (this.isDrawing) {
            this.handleProgress()
        } else {
            this.clear()
            this.handleCursor(pt)
        }
    }

    end(pt: Point): ToolResult | undefined {
        const result = this.handleEnd()
        this.reset()
        this.handleCursor(pt)
        return result
    }


    cancel(): void {
        this.handleCancel()
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
        this.pt = point.outside()
        this.isDrawing = false
    }
}
