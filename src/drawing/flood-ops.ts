import { Point } from "../common"
import { Bitmap } from "../schema"
import { bitmap } from "./bitmap-ops"

const spread = (
    pt: Point,
    sampleColor: number,
    bmp: Bitmap,
    stack: Array<Point>
) => {
    if (
        pt.x >= 0 && pt.x < bmp.width &&
        pt.y >= 0 && pt.y < bmp.height &&
        bitmap.getPixel(bmp, pt) === sampleColor
    ) stack.push(pt)
}

const fill = (bmp: Bitmap, start: Point, fillColor: number): Bitmap => {
    const out = bitmap.clone(bmp)
    const sample = bitmap.getPixel(out, start)
    const stack = [start]
    while (stack.length > 0) {
        const pt = stack.pop()
        if (!pt || bitmap.getPixel(out, pt) === fillColor) continue
        bitmap.putPixel(out, pt, fillColor)
        spread({ x: pt.x - 1, y: pt.y }, sample, out, stack) // Left
        spread({ x: pt.x + 1, y: pt.y }, sample, out, stack) // Right
        spread({ x: pt.x, y: pt.y - 1 }, sample, out, stack) // Up
        spread({ x: pt.x, y: pt.y + 1 }, sample, out, stack) // Down
    }
    return out
}

const erase = (bmp: Bitmap, start: Point): Bitmap => fill(bmp, start, 0)

export const flood = {
    fill,
    erase
} as const