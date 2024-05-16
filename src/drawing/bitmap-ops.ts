import { Point } from "../common/point"
import { Bitmap } from "../schema/bitmap-schema"
import { RGBA, rgba } from "./rgba-ops"

const empty = (width: number, height: number): Bitmap => ({
    width,
    height,
    colorBuffer: new Array<RGBA>(width * height).fill(rgba.transparent),
})

const clone = (bmp: Bitmap): Bitmap => ({
    width: bmp.width,
    height: bmp.height,
    colorBuffer: bmp.colorBuffer.slice(),
})

const getPixel = (bmp: Bitmap, point: Point): RGBA => bmp.colorBuffer[point.y * bmp.width + point.x]

const putPixelMut = (bmp: Bitmap, point: Point, color: RGBA) => {
    bmp.colorBuffer[point.y * bmp.width + point.x] = color
}

const putPixel = (bmp: Bitmap, point: Point, color: RGBA): Bitmap => {
    const cloned = clone(bmp)
    putPixelMut(cloned, point, color)
    return cloned
}

const mapMut = (bmp: Bitmap, f: (color: RGBA, index: number) => RGBA) => {
    const pixels = bmp.width * bmp.height
    for (let index = 0; index < pixels; index++) {
        bmp.colorBuffer[index] = f(bmp.colorBuffer[index], index)
    }
}

const map = (bmp: Bitmap, f: (color: RGBA, index: number) => RGBA): Bitmap => {
    const cloned = clone(bmp)
    mapMut(cloned, f)
    return cloned
}

const toIndex = (bmp: Bitmap, x: number, y: number): number => x + y * bmp.width

const toPoint = (bmp: Bitmap, flatIndex: number): Point => ({
    x: flatIndex % bmp.width,
    y: Math.floor(flatIndex / bmp.height)
})

export const bitmap = {
    clone,
    empty,
    getPixel,
    map,
    mapMut,
    putPixel,
    putPixelMut,
    toIndex,
    toPoint
} as const
