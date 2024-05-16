import { Point } from "../common";
import { bitmap, rgba } from "../drawing";
import { Bitmap } from "../schema";
import { Filter } from "./filter";

const swap = <T,>(array: Array<T>, i: number, j: number) => {
    const iValue = array[i]
    array[i] = array[j]
    array[j] = iValue
}

const invert: Filter = (bmp: Bitmap): Bitmap => bitmap.map(bmp, color => {
    const { r, g, b, a } = rgba.split(color)
    return rgba.pack(
        255 - r,
        255 - g,
        255 - b,
        a
    )
})

const flipHorizontal: Filter = (bmp: Bitmap): Bitmap => {
    const cloned = bitmap.clone(bmp)
    const halfWidth = Math.floor(cloned.width / 2)
    for (let y = 0; y < cloned.height; y++) {
        for (let x = 0; x < halfWidth; x++) {
            const left = bitmap.toIndex(cloned, x, y)
            const right = bitmap.toIndex(cloned, bmp.width - x - 1, y)
            swap(cloned.colorBuffer, left, right)
        }
    }
    return cloned
}

const flipVertical: Filter = (bmp) => {
    const cloned = bitmap.clone(bmp)
    const halfHeight = Math.floor(cloned.height / 2)
    for (let y = 0; y < halfHeight; y++) {
        for (let x = 0; x < cloned.width; x++) {
            const top = bitmap.toIndex(cloned, x, y)
            const bottom = bitmap.toIndex(cloned, x, cloned.height - y - 1)
            swap(cloned.colorBuffer, top, bottom)
        }
    }
    return cloned
}

const rotate = (getTarget: (bmp: Bitmap, source: Point) => Point) => (bmp: Bitmap): Bitmap => {
    const result = bitmap.empty(bmp.width, bmp.height)
    const pixels = bmp.width * bmp.height
    for (let index = 0; index < pixels; index++) {
        const source = bitmap.toPoint(bmp, index)
        const target = getTarget(bmp, source)
        if (bitmap.contains(bmp, target)) bitmap.putPixelMut(
            result,
            target,
            bitmap.getPixel(bmp, source)
        )
    }
    return result
}

const rotateClockwise: Filter = rotate((bmp, source) => ({
    x: bmp.width - source.y - 1,
    y: source.x
}))

const rotateCounterClockwise: Filter = rotate((bmp, source) => ({
    x: source.y,
    y: bmp.height - source.x - 1,
}))

export const filters = {
    invert,
    flipHorizontal,
    flipVertical,
    rotateClockwise,
    rotateCounterClockwise
} as const
