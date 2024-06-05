import { Point, point } from "../common";
import { BitmapImage } from "../drawing";
import { ToolBase } from "./tool-base";
import { ToolResult, resultBitmap } from "./tool-result";

export class MoveTool extends ToolBase {
    constructor() {
        super()
        this.offscreenCanvas = new OffscreenCanvas(1, 1)
        this.offscreenContext = this.offscreenCanvas.getContext("2d")!
        this.offscreenContext.imageSmoothingEnabled = false
    }

    private offscreenCanvas: OffscreenCanvas

    private offscreenContext: OffscreenCanvasRenderingContext2D

    private startPt: Point = point.outside()

    protected override handleStart() {
        this.startPt = this.pt
        this.fillCanvas()
        this.draw()
    }

    protected override handleProgress(): void {
        this.draw()
    }

    protected override handleEnd(): ToolResult | undefined {
        if (!this.bmp) return undefined
        const dx = this.pt.x - this.startPt.x
        const dy = this.pt.y - this.startPt.y
        const dest = new BitmapImage(this.bmp.width, this.bmp.height)
        this.bmp.copy(dest, undefined, { x: dx, y: dy, w: dest.width, h: dest.height })
        this.clearOffscreen()
        this.startPt = point.outside()
        return resultBitmap(dest)
    }

    protected override handleCancel(): void {
        this.clearOffscreen()
        this.startPt = point.outside()
    }

    private fillCanvas() {
        if (!this.bmp) return

        const width = this.bmp.width
        const height = this.bmp.height

        if (
            width !== this.offscreenCanvas.width ||
            height !== this.offscreenCanvas.height
        ) {
            this.offscreenCanvas = new OffscreenCanvas(width, height)
            this.offscreenContext = this.offscreenCanvas.getContext("2d")!
        } else {
            this.clearOffscreen()
        }

        this.bmp.draw(this.offscreenContext, color => color.clone().shift(50, -50))
    }

    private draw() {
        const dx = this.pt.x - this.startPt.x
        const dy = this.pt.y - this.startPt.y
        this.clear()
        this.context?.drawImage(this.offscreenCanvas, dx, dy)
        this.context?.fillRect(this.pt.x, this.pt.y, 1, 1)
    }

    private clearOffscreen() {
        this.offscreenContext.clearRect(0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height)
    }
}