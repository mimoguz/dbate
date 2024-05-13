import { Point, point } from "../common";
import { bitmap, rgba8 } from "../drawing";
import { Bitmap } from "../schema";
import { ToolBase } from "./tool-base";
import { ToolOptions, ToolResult, resultBitmap } from "./tool-result";

interface Rect {
    x: number
    y: number
    w: number
    h: number
}

export class FreehandTool extends ToolBase {
    constructor(
        tag: string,
        draw: (context: CanvasRenderingContext2D, rect: Rect) => void,
        put: (target: Bitmap, stroke: Array<Rect>, color: number) => void,
        rectFactory?: (brushSize: number) => (pt: Point, brushSize: number) => Rect
    ) {
        super()
        this.draw = draw
        this.put = put
        this.tag = tag
        if (rectFactory) this.rectFactory = rectFactory
        this.getRect = this.rectFactory(this.options.brushSize)
    }

    private readonly draw: (context: CanvasRenderingContext2D, rect: Rect) => void

    private readonly put: (target: Bitmap, stroke: Array<Rect>, color: number) => void

    private readonly stroke: Array<Rect> = []

    private pt: Point = point.outside()

    private isDrawing: boolean = false

    private color: number = 0

    override readonly tag: string;

    private getRect: (pt: Point, brushSize: number) => Rect

    private readonly rectFactory: (brushSize: number) => (pt: Point, brushSize: number) => Rect = (brushSize: number) => {
        const shift = Math.floor((brushSize - (brushSize % 2 === 0 ? 1 : 0)) / 2)
        return ((pt: Point, brushSize: number) => ({
            x: pt.x - shift,
            y: pt.y - shift,
            w: brushSize,
            h: brushSize,
        }))
    }

    override set options(value: ToolOptions) {
        super.options = value
        this.getRect = this.rectFactory(value.brushSize)
        this.color = rgba8.fromString(this.options.color)
        if (!this.isDrawing) this.drawCursor(this.pt)
    }

    override get options(): ToolOptions {
        return super.options
    }

    override start(pt: Point, bmp: Bitmap): void {
        this.bmp = bmp;
        this.isDrawing = true
        this.pt = pt;
        this.drawCurrentPoint()
    }

    override moveTo(pt: Point): void {
        if (point.equals(pt, this.pt)) return
        if (this.isDrawing) {
            this.pt = pt
            this.drawCurrentPoint()
        } else {
            this.clear()
            this.drawCursor(pt)
        }
    }

    override end(pt: Point): ToolResult | undefined {
        this.moveTo(pt)
        if (this.isDrawing && this.bmp) {
            const clone = bitmap.clone(this.bmp)
            this.put(clone, this.stroke, this.color)
            const result = resultBitmap(clone)
            this.reset()
            this.drawCursor(pt)
            return result
        }
        return undefined
    }

    protected override reset(): void {
        super.reset()
        this.stroke.splice(0)
        this.pt = point.outside()
        this.isDrawing = false
    }

    private drawCursor(pt: Point) {
        if (!this.context) return
        const rect = this.getRect(pt, this.opt.brushSize)
        this.draw(this.context, rect)
    }

    private drawCurrentPoint() {
        const rect = this.getRect(this.pt, this.opt.brushSize)
        if (this.context) this.draw(this.context, rect)
        this.stroke.push(rect)
    }
}

const fillStroke = (target: Bitmap, stroke: Array<Rect>, color: number) => {
    for (const rect of stroke) {
        const right = rect.x + rect.w
        const bottom = rect.y + rect.h
        for (let x = rect.x; x < right; x++) {
            for (let y = rect.y; y < bottom; y++) {
                bitmap.putPixelMut(target, { x, y }, color)
            }
        }
    }
}

export const freehandTools = {
    pencil: () => new FreehandTool(
        "pencil",
        (context: CanvasRenderingContext2D, rect: Rect) => context.fillRect(rect.x, rect.y, rect.w, rect.h),
        fillStroke,
    ),
    markerPenHorizontal: () => new FreehandTool(
        "marker-pen-horizontal",
        (context: CanvasRenderingContext2D, rect: Rect) => context.fillRect(rect.x, rect.y, rect.w, rect.h),
        fillStroke,
        (brushSize: number) => {
            const shift = Math.floor((brushSize - (brushSize % 2 === 0 ? 1 : 0)) / 2)
            return ((pt: Point, brushSize: number) => ({
                x: pt.x - shift,
                y: pt.y,
                w: brushSize,
                h: 1,
            }))
        }
    ),
    markerPenVertical: () => new FreehandTool(
        "marker-pen-vertical",
        (context: CanvasRenderingContext2D, rect: Rect) => context.fillRect(rect.x, rect.y, rect.w, rect.h),
        fillStroke,
        (brushSize: number) => {
            const shift = Math.floor((brushSize - (brushSize % 2 === 0 ? 1 : 0)) / 2)
            return ((pt: Point, brushSize: number) => ({
                x: pt.x,
                y: pt.y - shift,
                w: 1,
                h: brushSize,
            }))
        }
    ),
    eraser: () => new FreehandTool(
        "eraser",
        (context: CanvasRenderingContext2D, rect: Rect) => context.fillRect(rect.x, rect.y, rect.w, rect.h),
        (target: Bitmap, stroke: Array<Rect>) => fillStroke(target, stroke, 0),
    )
} as const