import { Point } from "../common"
import { Bitmap } from "../schema"
import { bitmap } from "./bitmap-ops"
import { RGBA, rgba } from "./rgba-ops"

const canSpread = (pt: Point, sampleColor: RGBA, bmp: Bitmap): boolean => (
    bitmap.contains(bmp, pt)
    && bitmap.getPixel(bmp, pt) === sampleColor
)

const spread = (
    pt: Point,
    sampleColor: RGBA,
    fillColor: RGBA,
    bmp: Bitmap,
    stack: Array<Point>
) => {
    if (canSpread(pt, sampleColor, bmp)) {
        bitmap.putPixelMut(bmp, pt, fillColor)
        stack.push(pt)
    }
}

const fill = (bmp: Bitmap, start: Point, fillColor: RGBA): void => {
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

const erase = (bmp: Bitmap, start: Point): void => fill(bmp, start, rgba.transparent)

export const flood = {
    fill,
    erase
} as const