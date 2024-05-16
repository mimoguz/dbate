import { Point } from "../common"
import { ToolBase } from "./tool-base"
import { ToolResult } from "./tool-result"

export class NoopTool extends ToolBase {
    start(): void { }

    moveTo(pt: Point): void {
        this.drawCursor(pt)
    }

    end(): ToolResult | undefined {
        return undefined
    }

    private drawCursor(pt: Point) {
        this.clear()
        this.ctx?.fillRect(pt.x, pt.y, 1, 1)
    }
}