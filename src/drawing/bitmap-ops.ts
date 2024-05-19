import { Rect, clamp } from "../common"
import { Point, point } from "../common/point"
import { Bitmap } from "../schema/bitmap-schema"
import { RGBA, rgba } from "./rgba-ops"

const empty = (width: number, height: number): Bitmap => ({
    width,
    height,
    colorBuffer: new Array<RGBA>(width * height).fill(rgba.transparent),
})

const emptyUninitialized = (width: number, height: number): Bitmap => ({
    width,
    height,
    colorBuffer: new Array<RGBA>(width * height),
})

const clone = (bmp: Bitmap): Bitmap => ({
    width: bmp.width,
    height: bmp.height,
    colorBuffer: bmp.colorBuffer.slice(),
})

const copy = (source: Bitmap, target: Bitmap, sourceRect?: Rect, targetOffset?: Point) => {
    const rect = sourceRect ?? {
        x: 0,
        y: 0,
        w: source.width,
        h: source.height,
    }
    const offset = targetOffset ?? point.zero()
    const right = rect.x + rect.w
    const bottom = rect.y + rect.h
    const sourcePt = point.zero()
    const targetPt = point.zero()
    for (let y = rect.y; y < bottom; y++) {
        if (y > target.height) break
        for (let x = rect.x; x < right; x++) {
            if (x > target.width) break
            sourcePt.x = x
            sourcePt.y = y
            targetPt.x = sourcePt.x + offset.x
            targetPt.y = sourcePt.y + offset.y
            if (bitmap.contains(target, targetPt)) {
                bitmap.putPixelMut(target, targetPt, bitmap.getPixel(source, sourcePt))
            }
        }
    }
}

const draw = (
    bmp: Bitmap,
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    colorTransform: (color: RGBA) => RGBA = color => color,
) => {
    context.save()
    let lastColor = rgba.transparent
    context.fillStyle = rgba.toString(colorTransform(lastColor))
    bmp.colorBuffer.forEach((color, index) => {
        const { x, y } = bitmap.toPoint(bmp, index)
        if (color != lastColor) {
            lastColor = color
            context.fillStyle = rgba.toString(colorTransform(lastColor))
        }
        context.fillRect(x, y, 1, 1)
    })
    context.restore()
}

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

const fillRect = (bmp: Bitmap, rect: Rect, color: RGBA) => {
    const right = clamp(0, bmp.width, rect.x + rect.w)
    const bottom = clamp(0, bmp.height, rect.y + rect.h)
    const left = clamp(0, right, rect.x)
    const top = clamp(0, bottom, rect.y)
    for (let y = top; y < bottom; y++) {
        for (let x = left; x < right; x++) {
            bitmap.putPixelMut(bmp, { x, y }, color)
        }
    }
}

const toIndex = (bmp: Bitmap, x: number, y: number): number => x + y * bmp.width

const toPoint = (bmp: Bitmap, flatIndex: number): Point => ({
    x: flatIndex % bmp.width,
    y: Math.floor(flatIndex / bmp.height)
})

const contains = (bmp: Bitmap, { x, y }: Point): boolean => (
    x >= 0 && x < bmp.width &&
    y >= 0 && y < bmp.height
)

/**
 * Bitmap functions. None of them check if their inputs are valid, the onus is on the caller.
 */
export const bitmap = {
    clone,
    contains,
    copy,
    draw,
    empty,
    emptyUninitialized,
    fillRect,
    getPixel,
    map,
    mapMut,
    putPixel,
    putPixelMut,
    toIndex,
    toPoint
} as const
