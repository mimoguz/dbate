import { Point } from "../common"
import { Bitmap, RGBA, bitmap, flood, rgba } from "../drawing"
import { ToolBase } from "./tool-base"
import { ToolResult, resultBitmap } from "./tool-result"

export class FloodTool extends ToolBase {
    constructor(fill: (bmp: Bitmap, start: Point, fillColor: RGBA) => void) {
        super()
        this.fill = fill
    }

    private fill: (bmp: Bitmap, start: Point, fillColor: RGBA) => void

    protected override handleStart(): void {
        this.handleCursor(this.pt)
    }

    protected override handleProgress(): void {
        this.handleCursor(this.pt)
    }

    protected override handleEnd(): ToolResult | undefined {
        if (!this.bmp) return undefined
        const clone = bitmap.clone(this.bmp)
        this.fill(clone, this.pt, rgba.fromString(this.options.color))
        return resultBitmap(clone)
    }
}

export const floodTools = {
    bucket: () => new FloodTool(flood.fill),
    eraser: () => new FloodTool(flood.erase)
} as const