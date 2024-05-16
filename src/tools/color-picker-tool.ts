import { Point, point } from "../common";
import { bitmap, rgba } from "../drawing";
import { Bitmap } from "../schema";
import { ToolBase } from "./tool-base";
import { ToolResult, resultOptions } from "./tool-result";

export class ColorPickerTool extends ToolBase {
    private pt: Point = point.outside()

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
        if (!this.bmp) return undefined
        const sample = bitmap.getPixel(this.bmp, pt)
        return resultOptions({
            ...this.opt,
            color: rgba.toString(sample) ?? this.opt.color,
        })
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
