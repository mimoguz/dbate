import { Point } from "../common"
import { BitmapImage } from "./bitmap-image"
import { Color } from "./color"

const canSpread = (pt: Point, sampleColor: Color, bmp: BitmapImage): boolean => (
    bmp.contains(pt.x, pt.y)
    && bmp.get(pt.x, pt.y).eq(sampleColor)
)

const spread = (
    pt: Point,
    sampleColor: Color,
    fillColor: Color,
    bmp: BitmapImage,
    stack: Array<Point>
) => {
    if (canSpread(pt, sampleColor, bmp)) {
        bmp.set(pt.x, pt.y, fillColor)
        stack.push(pt)
    }
}

const fill = (bmp: BitmapImage, start: Point, fillColor: Color): void => {
    const sampleColor = bmp.get(start.x, start.y)
    if (sampleColor.eq(fillColor)) return
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

const erase = (bmp: BitmapImage, start: Point): void => fill(bmp, start, Color.zero())

export const flood = {
    fill,
    erase
} as const