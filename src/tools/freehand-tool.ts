import { Point } from "../common";
import { RGBA, bitmap, rgba } from "../drawing";
import { Bitmap } from "../schema";
import { ToolBase2 } from "./tool-base";
import { ToolResult, resultBitmap } from "./tool-result";

interface Rect {
    x: number
    y: number
    w: number
    h: number
}

export class FreehandTool extends ToolBase2 {
    constructor(
        put: (target: Bitmap, stroke: Array<Rect>, color: RGBA) => void,
        rectFactory?: (brushSize: number) => (pt: Point) => Rect
    ) {
        super()
        this.put = put
        if (rectFactory) this.rectFactory = rectFactory
        this.getRect = this.rectFactory(this.options.brushSize)
    }

    private readonly put: (target: Bitmap, stroke: Array<Rect>, color: RGBA) => void

    private readonly stroke: Array<Rect> = []

    private color: RGBA = rgba.transparent

    private getRect: (pt: Point) => Rect

    private readonly rectFactory: (brushSize: number) => (pt: Point) => Rect = () => pt => ({ ...pt, w: 1, h: 1 })

    protected override handleOptionsChanged(): void {
        this.getRect = this.rectFactory(this.options.brushSize)
        this.color = rgba.fromString(this.options.color)
        if (!this.isDrawing) {
            this.clear()
            this.handleCursor(this.pt)
        }
    }

    protected override handleStart(): void {
        this.drawCurrentPoint()
    }

    protected override handleProgress(): void {
        this.drawCurrentPoint()
    }

    protected override handleEnd(): ToolResult | undefined {
        if (!this.bmp) return undefined
        const clone = bitmap.clone(this.bmp)
        this.put(clone, this.stroke, this.color)
        this.stroke.splice(0)
        return resultBitmap(clone)
    }

    protected override handleCancel(): void {
        this.stroke.splice(0)
    }

    protected override handleCursor(currentPt: Point): void {
        if (!this.context) return
        const rect = this.getRect(currentPt)
        this.clear()
        this.drawRect(rect)
    }

    private drawCurrentPoint() {
        const rect = this.getRect(this.pt)
        this.drawRect(rect)
        this.stroke.push(rect)
    }

    private drawRect(rect: Rect) {
        this.context?.fillRect(rect.x, rect.y, rect.w, rect.h)
    }
}

const fillStroke = (bmp: Bitmap, stroke: Array<Rect>, color: RGBA) => {
    for (const rect of stroke) {
        const right = rect.x + rect.w
        const bottom = rect.y + rect.h
        for (let y = rect.y; y < bottom; y++) {
            for (let x = rect.x; x < right; x++) {
                bitmap.putPixelMut(bmp, { x, y }, color)
            }
        }
    }
}

const getShift = (brushSize: number): number => Math.floor((brushSize - (brushSize % 2 === 0 ? 1 : 0)) / 2)

export const freehandTools = {
    pencil: () => new FreehandTool(
        fillStroke,
        brushSize => {
            const shift = getShift(brushSize)
            return ((pt: Point) => ({
                x: pt.x - shift,
                y: pt.y - shift,
                w: brushSize,
                h: brushSize,
            }))
        },
    ),

    markerPenHorizontal: () => new FreehandTool(
        fillStroke,
        brushSize => {
            const shift = getShift(brushSize)
            return ((pt: Point) => ({
                x: pt.x - shift,
                y: pt.y,
                w: brushSize,
                h: 1,
            }))
        },
    ),

    markerPenVertical: () => new FreehandTool(
        fillStroke,
        brushSize => {
            const shift = getShift(brushSize)
            return ((pt: Point) => ({
                x: pt.x,
                y: pt.y - shift,
                w: 1,
                h: brushSize,
            }))
        },
    ),

    eraser: () => new FreehandTool(
        (target, stroke) => fillStroke(target, stroke, rgba.transparent),
        brushSize => {
            const shift = getShift(brushSize)
            return ((pt: Point) => ({
                x: pt.x - shift,
                y: pt.y - shift,
                w: brushSize,
                h: brushSize,
            }))
        },
    )
} as const