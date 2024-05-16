import { Point, point } from "../common";
import { RGBA, bitmap, drawShape, putShape, rgba } from "../drawing";
import { Bitmap } from "../schema";
import { ToolBase } from "./tool-base";
import { ToolResult, resultBitmap } from "./tool-result";

export class BoundedTool extends ToolBase {
    constructor(
        draw: (context: CanvasRenderingContext2D, p0: Point, p1: Point) => void,
        put: (target: Bitmap, color: RGBA, p0: Point, p1: Point) => void,
    ) {
        super()
        this.draw = draw
        this.put = put
    }

    private readonly draw: (context: CanvasRenderingContext2D, p0: Point, p1: Point) => void

    private readonly put: (target: Bitmap, color: RGBA, p0: Point, p1: Point) => void

    private endPt: Point = point.outside()

    private startPt: Point = point.outside()

    private isDrawing: boolean = false

    override start(pt: Point, bmp: Bitmap): void {
        this.startPt = pt
        this.endPt = pt
        this.bmp = bmp
        this.isDrawing = true
        this.clear()
        if (this.context) this.draw(this.context, this.startPt, this.endPt)
    }

    override moveTo(pt: Point): void {
        if (!point.equals(pt, this.endPt)) {
            this.endPt = pt
            this.clear()
            if (this.isDrawing) {
                if (this.context) this.draw(this.context, this.startPt, this.endPt)
            } else {
                this.drawCursor(pt)
            }
        }
    }

    override end(pt: Point): ToolResult | undefined {
        this.endPt = pt
        if (this.bmp) {
            const clone = bitmap.clone(this.bmp)
            const color = rgba.fromString(this.opt.color)
            this.put(clone, color, this.startPt, this.endPt)
            const result = resultBitmap(clone)
            this.reset()
            return result
        }
        this.reset()
        this.drawCursor(pt)
        return undefined
    }

    protected override reset() {
        super.reset()
        this.endPt = point.outside()
        this.startPt = point.outside()
        this.isDrawing = false
    }

    private drawCursor(pt: Point) {
        this.context?.fillRect(pt.x, pt.y, 1, 1)
    }
}

export const boundedTools = {
    line: () => new BoundedTool(drawShape.line, putShape.line),
    rectangle: () => new BoundedTool(drawShape.rectangle, putShape.rectangle),
    ellipse: () => new BoundedTool(drawShape.ellipse, putShape.ellipse),
}