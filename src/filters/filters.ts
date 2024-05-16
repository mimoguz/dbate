import { Point } from "../common";
import { bitmap, rgba } from "../drawing";
import { Bitmap } from "../schema";
import { Filter } from "./filter";

const invert: Filter = (source: Bitmap): Bitmap => bitmap.map(source, color => {
    const { r, g, b, a } = rgba.split(color)
    return rgba.pack(
        255 - r,
        255 - g,
        255 - b,
        a
    )
})

const transform = (transformPt: (source: Bitmap, pt: Point) => void, initialize: boolean = true) =>
    (source: Bitmap): Bitmap => {
        const result = initialize
            ? bitmap.empty(source.width, source.height)
            : bitmap.emptyUninitialized(source.width, source.height)
        source.colorBuffer.forEach((color, index) => {
            const pt = bitmap.toPoint(source, index)
            transformPt(source, pt)
            bitmap.putPixelMut(result, pt, color)
        })
        return result
    }

const flipHorizontal: Filter = transform(
    (source, pt) => {
        pt.x = source.width - pt.x - 1
    },
    false
)

const flipVertical: Filter = transform(
    (source, pt) => {
        pt.y = source.height - pt.y - 1
    },
    false
)

const rotateClockwise: Filter = transform((source, pt) => {
    const x = pt.x
    pt.x = source.width - pt.y - 1
    pt.y = x
})

const rotateCounterClockwise: Filter = transform((source, pt) => {
    const x = pt.x
    pt.x = pt.y
    pt.y = source.height - x - 1
})

export const filters = {
    invert,
    flipHorizontal,
    flipVertical,
    rotateClockwise,
    rotateCounterClockwise
} as const
