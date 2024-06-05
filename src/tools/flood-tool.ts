import { Point } from "../common"
import { BitmapImage, Color, flood, } from "../drawing"
import { ToolBase } from "./tool-base"
import { ToolResult, resultBitmap } from "./tool-result"

export class FloodTool extends ToolBase {
    constructor(fill: (bmp: BitmapImage, start: Point, fillColor: Color) => void) {
        super()
        this.fill = fill
    }

    private fill: (bmp: BitmapImage, start: Point, fillColor: Color) => void

    protected override handleStart(): void {
        this.handleCursor(this.pt)
    }

    protected override handleProgress(): void {
        this.handleCursor(this.pt)
    }

    protected override handleEnd(): ToolResult | undefined {
        if (!this.bmp) return undefined
        const clone = this.bmp.clone()
        this.fill(clone, this.pt, Color.fromCSSColor(this.options.color) ?? Color.zero())
        return resultBitmap(clone)
    }
}

export const floodTools = {
    bucket: () => new FloodTool(flood.fill),
    eraser: () => new FloodTool(flood.erase)
} as const