import { Point } from "../common"
import { Bitmap } from "../schema"
import { bitmap } from "./bitmap-ops"

const canSpread = (pt: Point, sampleColor: number, bmp: Bitmap): boolean => (
    pt.x >= 0 && pt.x < bmp.width &&
    pt.y >= 0 && pt.y < bmp.height &&
    bitmap.getPixel(bmp, pt) === sampleColor
)

const spread = (
    pt: Point,
    sampleColor: number,
    fillColor: number,
    bmp: Bitmap,
    stack: Array<Point>
) => {
    if (canSpread(pt, sampleColor, bmp)) {
        bitmap.putPixelMut(bmp, pt, fillColor)
        stack.push(pt)
    }
}

const fill = (bmp: Bitmap, start: Point, fillColor: number): void => {
    const sampleColor = bitmap.getPixel(bmp, start)
    if (sampleColor === fillColor) return
    const stack: Array<Point> = []
    spread(start, sampleColor, fillColor, bmp, stack)
    while (stack.length > 0) {
        const pt = stack.pop()!
        spread({ x: pt.x - 1, y: pt.y }, sampleColor, fillColor, bmp, stack) // Left
        spread({ x: pt.x + 1, y: pt.y }, sampleColor, fillColor, bmp, stack) // Right
        spread({ x: pt.x, y: pt.y - 1 }, sampleColor, fillColor, bmp, stack) // Up
        spread({ x: pt.x, y: pt.y + 1 }, sampleColor, fillColor, bmp, stack) // Down
    }
}

const erase = (bmp: Bitmap, start: Point): void => fill(bmp, start, 0)

export const flood = {
    fill,
    erase
} as const