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
        const sample = this.bmp.get(this.pt.x, this.pt.y)
        return resultOptions({
            ...this.options,
            color: sample.hex ?? this.options.color,
        })
    }
}
