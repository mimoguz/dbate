import { Point, Rect, clamp, point } from "../common"
import { Bitmap } from "../database/db"
import { RGBA8888, rgba8888 } from "./rgba8888-ops"

const empty = (width: number, height: number): Bitmap => ({
    width,
    height,
    colorBuffer: new Uint8ClampedArray(width * height * 4),
})

const clone = (source: Bitmap): Bitmap => ({
    width: source.width,
    height: source.height,
    colorBuffer: new Uint8ClampedArray(source.colorBuffer)
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
    const sample = rgba8888.zero()
    for (sourcePt.y = rect.y; sourcePt.y < bottom; sourcePt.y++) {
        if (sourcePt.y > target.height) break
        for (sourcePt.x = rect.x; sourcePt.x < right; sourcePt.x++) {
            if (sourcePt.x > target.width) break
            targetPt.x = sourcePt.x + offset.x
            targetPt.y = sourcePt.y + offset.y
            if (contains(source, sourcePt) && contains(target, targetPt)) {
                readPixel(source, sourcePt, sample)
                putPixelMut(target, targetPt, sample)
            }
        }
    }
}

const draw = (
    bmp: Bitmap,
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    colorTransform: (color: RGBA8888) => RGBA8888 = color => color,
) => {
    context.save()
    const lastSample = rgba8888.transparent
    context.fillStyle = rgba8888.toString(colorTransform(lastSample))
    const pixels = bmp.width * bmp.height
    const sample = rgba8888.zero()
    const pt = { x: 0, y: 0 }
    for (let index = 0; index < pixels; index++) {
        toPoint(bmp, index, pt)
        readPixel(bmp, pt, sample)
        if (!rgba8888.equals(sample, lastSample)) {
            rgba8888.copy(sample, lastSample)
            context.fillStyle = rgba8888.toString(colorTransform(lastSample))
        }
        context.fillRect(pt.x, pt.y, 1, 1)
    }
    context.restore()
}

const getPixel = (bmp: Bitmap, point: Point): RGBA8888 => {
    const offset = toPixelOffset(bmp, point.x, point.y)
    return bmp.colorBuffer.slice(offset, offset + 4) as RGBA8888
}

const readPixel = (bmp: Bitmap, point: Point, target: RGBA8888): void => {
    const offset = toPixelOffset(bmp, point.x, point.y)
    for (let channel = 0; channel < 4; channel++) {
        target[channel] = bmp.colorBuffer[offset + channel]
    }
}

const putPixelMut = (bmp: Bitmap, point: Point, color: RGBA8888) => {
    bmp.colorBuffer.set(color, toPixelOffset(bmp, point.x, point.y))
}

const putPixel = (bmp: Bitmap, point: Point, color: RGBA8888): Bitmap => {
    const cloned = clone(bmp)
    putPixelMut(cloned, point, color)
    return cloned
}

const mapMut = (bmp: Bitmap, mutator: (color: RGBA8888, index: number) => void) => {
    const pixels = bmp.width * bmp.height
    const sample = new Uint8ClampedArray(4) as RGBA8888
    const pt = { x: 0, y: 0 }
    for (let index = 0; index < pixels; index++) {
        toPoint(bmp, index, pt)
        readPixel(bmp, pt, sample)
        mutator(sample, index)
        putPixelMut(bmp, pt, sample)
    }
}

const map = (bmp: Bitmap, mutator: (color: RGBA8888, index: number) => void): Bitmap => {
    const cloned = clone(bmp)
    mapMut(cloned, mutator)
    return cloned
}

const fillRectMut = (bmp: Bitmap, rect: Rect, color: RGBA8888) => {
    const right = clamp(0, bmp.width, rect.x + rect.w)
    const bottom = clamp(0, bmp.height, rect.y + rect.h)
    const left = clamp(0, right, rect.x)
    const top = clamp(0, bottom, rect.y)
    const pt = { x: 0, y: 0 }
    for (pt.y = top; pt.y < bottom; pt.y++) {
        for (pt.x = left; pt.x < right; pt.x++) {
            putPixelMut(bmp, pt, color)
        }
    }
}

const toPixelIndex = (bmp: Bitmap, x: number, y: number): number => x + y * bmp.width

const toPixelOffset = (bmp: Bitmap, x: number, y: number): number => (x + y * bmp.width) * 4

const toPoint = (bmp: Bitmap, flatIndex: number, target?: Point): Point => {
    const result = target ?? { x: 0, y: 0 }
    result.x = flatIndex % bmp.width
    result.y = Math.floor(flatIndex / bmp.height)
    return result
}

const contains = (bmp: Bitmap, { x, y }: Point): boolean => (
    x >= 0 && x < bmp.width &&
    y >= 0 && y < bmp.height
)

/**
 * Bitmap functions. None of them check if their inputs are valid, the onus is on the caller.
 */
export const bitmap8888 = {
    clone,
    contains,
    copy,
    draw,
    empty,
    fillRectMut,
    getPixel,
    map,
    mapMut,
    putPixel,
    putPixelMut,
    readPixel,
    toPixelIndex,
    toPixelOffset,
    toPoint,
} as const
