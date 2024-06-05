import { Point, point } from "../common"
import { ToolBase } from "./tool-base"
import { ToolResult, resultBitmap } from "./tool-result"
import { BitmapImage, Color, drawShape, putShape } from "../drawing"

export class BoundedTool extends ToolBase {
    constructor(
        draw: (context: CanvasRenderingContext2D, p0: Point, p1: Point) => void,
        put: (target: BitmapImage, color: Color, p0: Point, p1: Point) => void,
    ) {
        super()
        this.draw = draw
        this.put = put
    }

    private readonly draw: (context: CanvasRenderingContext2D, p0: Point, p1: Point) => void

    private readonly put: (target: BitmapImage, color: Color, p0: Point, p1: Point) => void

    private startPt: Point = point.outside()

    protected override handleStart(): void {
        this.startPt = this.pt
        if (this.context) this.draw(this.context, this.startPt, this.pt)
    }

    protected override handleProgress(): void {
        this.clear()
        if (this.context) this.draw(this.context, this.startPt, this.pt)
    }

    protected override handleEnd(): ToolResult | undefined {
        if (!this.bmp) return undefined
        const clone = this.bmp.clone()
        const color = Color.fromCSSColor(this.options.color) ?? Color.zero()
        this.put(clone, color, this.startPt, this.pt)
        this.startPt = point.outside()
        return resultBitmap(clone)
    }
}

export const boundedTools = {
    line: () => new BoundedTool(drawShape.line, putShape.line),
    rectangle: () => new BoundedTool(drawShape.rectangle, putShape.rectangle),
    ellipse: () => new BoundedTool(drawShape.ellipse, putShape.ellipse),
}