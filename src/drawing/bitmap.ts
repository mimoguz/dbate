import { Point, Rect, clamp, point } from "../common"
import { RGBA, rgba } from "./rgba"

export interface Bitmap {
    width: number
    height: number
    colorBuffer: Uint8ClampedArray
}

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
    const lastSample = rgba.zero()
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

const drawImage = (
    bmp: Bitmap,
    context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
) => {
    context.save()
    const data = new ImageData(bmp.colorBuffer, bmp.width, bmp.height)
    createImageBitmap(data).then((image) => {
        context.drawImage(image, 0, 0, bmp.width, bmp.height)
    })
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
    // const offset = toPixelOffset(bmp, point.x, point.y)
    // for (let i = 0; i < 4; i++) {
    //     bmp.colorBuffer[offset + i] = color[i]
    // }
    bmp.colorBuffer.set(color, toPixelOffset(bmp, point.x, point.y))
}

const putPixel = (bmp: Bitmap, point: Point, color: RGBA): Bitmap => {
    const cloned = clone(bmp)
    putPixelMut(cloned, point, color)
    return cloned
}

const mapMut = (bmp: Bitmap, mutator: (color: RGBA, index: number) => void) => {
    const pixels = bmp.width * bmp.height
    const sample = rgba.zero()
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

const foreach = (bmp: Bitmap, f: (color: RGBA, pixelIndex: number) => void): void => {
    const pixels = bmp.width * bmp.height
    const sample = rgba.zero()
    const pt = point.zero()
    for (let index = 0; index < pixels; index++) {
        toPoint(bmp, index, pt)
        readPixel(bmp, pt, sample)
        f(sample, index)
    }
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
    const result = target ?? point.zero()
    result.x = flatIndex % bmp.width
    result.y = Math.floor(flatIndex / bmp.width)
    return result
}

const contains = (bmp: Bitmap, { x, y }: Point): boolean => (
    x >= 0 && x < bmp.width &&
    y >= 0 && y < bmp.height
)

const dataURL = async (bmp: Bitmap): Promise<string> => {
    const canvas = new OffscreenCanvas(bmp.width, bmp.height)
    draw(bmp, canvas.getContext("2d")!)
    const blob = await canvas.convertToBlob()
    return await new Promise((callback: (value: string) => void) => {
        const reader = new FileReader()
        reader.addEventListener("load", () => {
            if (typeof reader.result === "string") callback(reader.result)
        })
        reader.readAsDataURL(blob)
    })
}

/**
 * Bitmap functions. None of them check if their inputs are valid, the onus is on the caller.
 */
export const bitmap = {
    clone,
    contains,
    copy,
    /** Returns a promise with the data url. */
    dataURL,
    draw,
    drawImage,
    empty,
    fillRectMut,
    foreach,
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
