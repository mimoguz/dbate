import { bitmap, rgba } from "../drawing";
import { ToolBase } from "./tool-base";
import { ToolResult, resultOptions } from "./tool-result";

export class ColorPickerTool extends ToolBase {
    protected override handleStart(): void {
        this.handleCursor(this.pt)
    }

    protected override handleProgress(): void {
        this.handleCursor(this.pt)
    }

    protected override handleEnd(): ToolResult | undefined {
        if (!this.bmp) return undefined
        const sample = bitmap.getPixel(this.bmp, this.pt)
        return resultOptions({
            ...this.options,
            color: rgba.toString(sample) ?? this.options.color,
        })
    }
}
