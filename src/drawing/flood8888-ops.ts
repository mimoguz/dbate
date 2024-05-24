import { Point } from "../common"
import { Bitmap } from "../database/db"
import { bitmap8888 } from "./bitmap8888-ops"
import { RGBA8888, rgba8888 } from "./rgba8888-ops"

const canSpread = (pt: Point, sampleColor: RGBA8888, bmp: Bitmap): boolean => (
    bitmap8888.contains(bmp, pt)
    && rgba8888.equals(bitmap8888.getPixel(bmp, pt), sampleColor)
)

const spread = (
    pt: Point,
    sampleColor: RGBA8888,
    fillColor: RGBA8888,
    bmp: Bitmap,
    stack: Array<Point>
) => {
    if (canSpread(pt, sampleColor, bmp)) {
        bitmap8888.putPixelMut(bmp, pt, fillColor)
        stack.push(pt)
    }
}

const fill = (bmp: Bitmap, start: Point, fillColor: RGBA8888): void => {
    const sampleColor = bitmap8888.getPixel(bmp, start)
    if (rgba8888.equals(sampleColor, fillColor)) return
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

const erase = (bmp: Bitmap, start: Point): void => fill(bmp, start, rgba8888.transparent)

export const flood8888 = {
    fill,
    erase
} as const