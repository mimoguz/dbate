import { Point, point } from "../common";
import { bitmap, drawShape, putShape, rgba8 } from "../drawing";
import { Bitmap } from "../schema";
import { Tool } from "./tool";
import { ToolOptions, ToolResult, resultBitmap } from "./tool-result";

export class BoundedTool implements Tool {
    constructor(
        draw: (context: CanvasRenderingContext2D, p0: Point, p1: Point) => void,
        put: (target: Bitmap, color: number, p0: Point, p1: Point) => void,
        tag: string
    ) {
        this.draw = draw
        this.put = put
        this.tag = tag
    }

    private readonly draw: (context: CanvasRenderingContext2D, p0: Point, p1: Point) => void

    private readonly put: (target: Bitmap, color: number, p0: Point, p1: Point) => void

    readonly tag: string

    private ctx: CanvasRenderingContext2D | undefined

    private opt: ToolOptions = {
        color: "black",
        brushSize: 1
    }

    private pt: Point = point.outside()

    private startPt: Point = point.outside()

    private bmp: Bitmap | undefined = undefined

    private isDrawing: boolean = false

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

    start(pt: Point, bmp: Bitmap): void {
        this.startPt = pt
        this.pt = pt
        this.bmp = bmp
        this.isDrawing = true
        this.clear()
        if (this.context) this.draw(this.context, this.startPt, this.pt)
    }

    moveTo(pt: Point): void {
        if (!point.equals(pt, this.pt)) {
            this.pt = pt
            this.clear()
            if (this.isDrawing) {
                if (this.context) this.draw(this.context, this.startPt, this.pt)
            } else {
                this.drawCursor(pt)
            }
        }
    }

    end(pt: Point): ToolResult | undefined {
        this.pt = pt
        if (this.bmp) {
            const clone = bitmap.clone(this.bmp)
            const color = rgba8.fromString(this.opt.color)
            this.put(clone, color, this.startPt, this.pt)
            const result = resultBitmap(clone)
            this.reset()
            return result
        }
        this.reset()
        this.drawCursor(pt)
        return undefined
    }

    cancel(): void {
        this.reset()
    }

    private drawCursor(pt: Point) {
        this.context?.fillRect(pt.x, pt.y, 1, 1)
    }

    private clear() {
        if (this.context) {
            this.context.clearRect(0, 0, this.context.canvas.clientWidth, this.context.canvas.clientHeight)
        }
    }

    private reset() {
        this.clear()
        this.pt = point.outside()
        this.startPt = point.outside()
        this.isDrawing = false
        this.bmp = undefined
    }
}

export const boundedTools = {
    line: () => new BoundedTool(drawShape.line, putShape.line, "line"),
    rectangle: () => new BoundedTool(drawShape.rectangle, putShape.rectangle, "rectangle"),
    ellipse: () => new BoundedTool(drawShape.ellipse, putShape.ellipse, "ellipse"),
}