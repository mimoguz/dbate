import { Point, point } from "../common";
import { bitmap, drawShape, putShape, rgba8 } from "../drawing";
import { Bitmap } from "../schema";
import { ToolBase } from "./tool-base";
import { ToolResult, resultBitmap } from "./tool-result";

export class BoundedTool extends ToolBase {
    constructor(
        tag: string,
        draw: (context: CanvasRenderingContext2D, p0: Point, p1: Point) => void,
        put: (target: Bitmap, color: number, p0: Point, p1: Point) => void,
    ) {
        super()
        this.draw = draw
        this.put = put
        this.tag = tag
    }

    private readonly draw: (context: CanvasRenderingContext2D, p0: Point, p1: Point) => void

    private readonly put: (target: Bitmap, color: number, p0: Point, p1: Point) => void

    override readonly tag: string

    private pt: Point = point.outside()

    private startPt: Point = point.outside()

    private isDrawing: boolean = false

    override start(pt: Point, bmp: Bitmap): void {
        this.startPt = pt
        this.pt = pt
        this.bmp = bmp
        this.isDrawing = true
        this.clear()
        if (this.context) this.draw(this.context, this.startPt, this.pt)
    }

    override moveTo(pt: Point): void {
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

    override end(pt: Point): ToolResult | undefined {
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

    protected override reset() {
        super.reset()
        this.pt = point.outside()
        this.startPt = point.outside()
        this.isDrawing = false
    }

    private drawCursor(pt: Point) {
        this.context?.fillRect(pt.x, pt.y, 1, 1)
    }
}

export const boundedTools = {
    line: () => new BoundedTool("line", drawShape.line, putShape.line),
    rectangle: () => new BoundedTool("rectangle", drawShape.rectangle, putShape.rectangle),
    ellipse: () => new BoundedTool("ellipse", drawShape.ellipse, putShape.ellipse),
}