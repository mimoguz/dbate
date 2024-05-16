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

const flipVertical: Filter = (bmp: Bitmap): Bitmap => {
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

export const filters = {
    invert,
    flipHorizontal,
    flipVertical,
} as const
