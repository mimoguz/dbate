import { Point } from "../common";
import { Bitmap, bitmap, rgba } from "../drawing";
import { Transform } from "./transform";

const invert: Transform = (source: Bitmap): Bitmap => bitmap.map(source, color => {
    const { r, g, b, a } = rgba.split(color)
    return rgba.pack(
        255 - r,
        255 - g,
        255 - b,
        a
    )
})

const transformation = (transformPt: (source: Bitmap, pt: Point) => void, initialize: boolean = true) =>
    (source: Bitmap): Bitmap => {
        const result = initialize
            ? bitmap.empty(source.width, source.height)
            : bitmap.empty(source.width, source.height)
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
    },
    false
)

const flipVertical: Transform = transformation(
    (source, pt) => {
        pt.y = source.height - pt.y - 1
    },
    false
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
