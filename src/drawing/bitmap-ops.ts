import pako from "pako"
import { Point, Rect, clamp, point } from "../common"
import { Bitmap, EncodedBitmap } from "../data"
import { RGBA, rgba } from "./rgba-ops"

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
    const sample = rgba.zero()
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
    colorTransform: (color: RGBA) => RGBA = color => color,
) => {
    context.save()
    const lastSample = rgba.transparent
    context.fillStyle = rgba.toString(colorTransform(lastSample))
    const pixels = bmp.width * bmp.height
    const sample = rgba.zero()
    const pt = { x: 0, y: 0 }
    for (let index = 0; index < pixels; index++) {
        toPoint(bmp, index, pt)
        readPixel(bmp, pt, sample)
        if (!rgba.equals(sample, lastSample)) {
            rgba.copy(sample, lastSample)
            context.fillStyle = rgba.toString(colorTransform(lastSample))
        }
        context.fillRect(pt.x, pt.y, 1, 1)
    }
    context.restore()
}

const getPixel = (bmp: Bitmap, point: Point): RGBA => {
    const offset = toPixelOffset(bmp, point.x, point.y)
    return bmp.colorBuffer.slice(offset, offset + 4) as RGBA
}

const readPixel = (bmp: Bitmap, point: Point, target: RGBA): void => {
    const offset = toPixelOffset(bmp, point.x, point.y)
    for (let channel = 0; channel < 4; channel++) {
        target[channel] = bmp.colorBuffer[offset + channel]
    }
}

const putPixelMut = (bmp: Bitmap, point: Point, color: RGBA) => {
    bmp.colorBuffer.set(color, toPixelOffset(bmp, point.x, point.y))
}

const putPixel = (bmp: Bitmap, point: Point, color: RGBA): Bitmap => {
    const cloned = clone(bmp)
    putPixelMut(cloned, point, color)
    return cloned
}

const mapMut = (bmp: Bitmap, mutator: (color: RGBA, index: number) => void) => {
    const pixels = bmp.width * bmp.height
    const sample = new Uint8ClampedArray(4) as RGBA
    const pt = { x: 0, y: 0 }
    for (let index = 0; index < pixels; index++) {
        toPoint(bmp, index, pt)
        readPixel(bmp, pt, sample)
        mutator(sample, index)
        putPixelMut(bmp, pt, sample)
    }
}

const map = (bmp: Bitmap, mutator: (color: RGBA, index: number) => void): Bitmap => {
    const cloned = clone(bmp)
    mapMut(cloned, mutator)
    return cloned
}

const fillRectMut = (bmp: Bitmap, rect: Rect, color: RGBA) => {
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


const encodeBitmap = (bmp: Bitmap): string => {
    const base64 = Buffer.from(pako.deflate(bmp.colorBuffer)).toString("base64")
    return JSON.stringify({
        width: bmp.width,
        height: bmp.height,
        data: base64
    })
}

const decodeBitmap = (source: string): Bitmap | undefined => {
    try {
        const json: EncodedBitmap = JSON.parse(source)
        const inflated = pako.inflate(Buffer.from(json.data, "base64"))
        return ({
            width: json.width,
            height: json.height,
            colorBuffer: new Uint8ClampedArray(inflated)
        })
    } catch (error) {
        console.debug(error)
        return undefined
    }
}

/**
 * Bitmap functions. None of them check if their inputs are valid, the onus is on the caller.
 */
export const bitmap = {
    clone,
    contains,
    copy,
    decodeBitmap,
    draw,
    empty,
    encodeBitmap,
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
