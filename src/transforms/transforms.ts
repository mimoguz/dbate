import { Point } from "../common";
import { Bitmap, bitmap } from "../drawing";
import { Transform } from "./transform";

const invert: Transform = (source: Bitmap): Bitmap => bitmap.map(source, color => {
    color.r = 255 - color.r
    color.g = 255 - color.g
    color.b = 255 - color.b
})

const transformation = (transformPt: (source: Bitmap, pt: Point) => void) =>
    (source: Bitmap): Bitmap => {
        const result = bitmap.empty(source.width, source.height)
        bitmap.foreach(source, (color, index) => {
            const pt = bitmap.toPoint(source, index)
            transformPt(source, pt)
            bitmap.putPixelMut(result, pt, color)
        })
        return result
    }

const flipHorizontal: Transform = transformation(
    (source, pt) => {
        pt.x = source.width - pt.x - 1
    }
)

const flipVertical: Transform = transformation(
    (source, pt) => {
        pt.y = source.height - pt.y - 1
    }
)

const rotateClockwise: Transform = transformation((source, pt) => {
    const x = pt.x
    pt.x = source.width - pt.y - 1
    pt.y = x
})

const rotateCounterClockwise: Transform = transformation((source, pt) => {
    const x = pt.x
    pt.x = pt.y
    pt.y = source.height - x - 1
})

export const transforms = {
    invert,
    flipHorizontal,
    flipVertical,
    rotateClockwise,
    rotateCounterClockwise
} as const
