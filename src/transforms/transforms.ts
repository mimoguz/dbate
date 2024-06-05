import { Point, point } from "../common";
import { BitmapImage, Color } from "../drawing";
import { Transform } from "./transform";

const invert: Transform = (source: BitmapImage): BitmapImage => {
    const clone = source.clone()
    clone.modify((_x, _y, sample) => {
        sample.red = 255 - sample.red
        sample.green = 255 - sample.green
        sample.blue = 255 - sample.blue
    })
    return clone
}

const transformation = (transformPt: (source: BitmapImage, pt: Point) => void) =>
    (source: BitmapImage): BitmapImage => {
        const result = new BitmapImage(source.width, source.height)
        const sourcePt = point.zero()
        const sourceSample = Color.zero()
        result.modify((x, y, destSample) => {
            sourcePt.x = x
            sourcePt.y = y
            transformPt(source, sourcePt)
            source.sample(sourcePt.x, sourcePt.y, sourceSample)
            sourceSample.copy(destSample)
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
