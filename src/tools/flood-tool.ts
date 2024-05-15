import { Point, point } from "../common";
import { bitmap, flood, rgba8 } from "../drawing";
import { Bitmap } from "../schema";
import { ToolBase } from "./tool-base";
import { ToolResult, resultBitmap } from "./tool-result";

export class FloodTool extends ToolBase {
    constructor(tag: string, fill: (bmp: Bitmap, start: Point, fillColor: number) => void) {
        super()
        this.tag = tag
        this.fill = fill
    }

    private fill: (bmp: Bitmap, start: Point, fillColor: number) => void

    private pt: Point = point.outside()

    readonly tag: string;

    start(pt: Point, bmp: Bitmap): void {
        this.bmp = bmp
        this.pt = pt
        this.drawCursor(pt)
    }

    moveTo(pt: Point): void {
        if (!point.equals(pt, this.pt)) {
            this.pt = pt
            this.drawCursor(pt)
        }
    }

    end(pt: Point): ToolResult | undefined {
        if (this.bmp) {
            const clone = bitmap.clone(this.bmp)
            this.fill(clone, pt, rgba8.fromString(this.opt.color))
            const result = resultBitmap(clone)
            this.reset()
            this.drawCursor(pt)
            return result
        }
        this.reset()
        this.drawCursor(pt)
        return undefined
    }

    protected override reset(): void {
        super.reset()
        this.pt = point.outside()
    }

    private drawCursor(pt: Point) {
        this.clear()
        this.context?.fillRect(pt.x, pt.y, 1, 1)
    }
}

export const floodTools = {
    bucket: () => new FloodTool("flood-fill", flood.fill),
    eraser: () => new FloodTool("flood-erase", flood.erase)
} as const