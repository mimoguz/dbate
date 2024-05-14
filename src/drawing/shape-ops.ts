import { Point } from "../common"
import { Bitmap } from "../schema"
import { bitmap } from "./bitmap-ops"

const drawLine = (
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) => line(start, end, ({ x, y }) => ctx.fillRect(x, y, 1, 1))

const putLine = (
    bmp: Bitmap,
    color: number,
    start: Point,
    end: Point
) => line(start, end, (pt) => bitmap.putPixelMut(bmp, pt, color))

const drawEllipse = (
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) => ellipse(start, end, ({ x, y }) => ctx.fillRect(x, y, 1, 1))

const putEllipse = (
    bmp: Bitmap,
    color: number,
    start: Point,
    end: Point
) => ellipse(start, end, (pt) => bitmap.putPixelMut(bmp, pt, color))

const drawRectangle = (
    ctx: CanvasRenderingContext2D,
    start: Point,
    end: Point
) => rectangle(start, end, ({ x, y }) => ctx.fillRect(x, y, 1, 1))

const putRectangle = (
    bmp: Bitmap,
    color: number,
    start: Point,
    end: Point
) => rectangle(start, end, (pt) => bitmap.putPixelMut(bmp, pt, color))

const div = (a: number, b: number): number => Math.floor(a / b)

// https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
const line = (start: Point, end: Point, plot: (pt: Point) => void) => {
    let { x: x0, y: y0 } = start
    const { x: x1, y: y1 } = end
    const dx = Math.abs(x1 - x0)
    const dy = -Math.abs(y1 - y0)
    const stepX = x0 < x1 ? 1 : -1
    const stepY = y0 < y1 ? 1 : -1
    let error = dx + dy

    // eslint-disable-next-line no-constant-condition
    while (true) {
        plot({ x: x0, y: y0 })
        if (x0 === x1 && y0 === y1) break
        const e2 = 2 * error
        if (e2 >= dy) {
            if (x0 === x1) break
            error += dy
            x0 += stepX
        }
        if (e2 <= dx) {
            if (y0 === y1) break
            error += dx
            y0 += stepY
        }
    }
}

// http://members.chello.at/~easyfilter/bresenham.html
const ellipse = (p0: Point, p1: Point, plot: (pt: Point) => void) => {
    let { x: x0, y: y0 } = p0
    let { x: x1, y: y1 } = p1

    // Values of diameter
    const a = Math.abs(x1 - x0)
    const b = Math.abs(y1 - y0)
    const b1 = b & 1
    const aSqr8 = 8 * a * a
    const bSqr8 = 8 * b * b

    // Error increment
    let dx = 4 * (1 - a) * b * b
    let dy = 4 * (1 + b1) * a * a
    let err = dx + dy + b1 * a * a

    // If called with swapped points exchange them
    if (x0 > x1) {
        x0 = x1
        x1 += a
    }
    if (y0 > y1) y0 = y1

    // Starting pixel
    y0 += div(b + 1, 2)
    y1 = y0 - b1

    do {
        plot({ x: x1, y: y0 }) // 1st quadrant
        plot({ x: x0, y: y0 }) // 2nd quadrant
        plot({ x: x0, y: y1 }) // 3rd quadrant
        plot({ x: x1, y: y1 }) // 4th quadrant

        const e2 = 2 * err

        // y step
        if (e2 <= dy) {
            y0++
            y1--
            dy += aSqr8
            err += dy
        }

        // x step
        if (e2 >= dx || 2 * err > dy) {
            x0++
            x1--
            dx += bSqr8
            err += dx
        }
    } while (x0 <= x1)

    // Too early stop of flat ellipses a=1
    while (y0 - y1 < b) {
        // Finish tip of ellipse
        plot({ x: x0 - 1, y: y0 })
        plot({ x: x1 + 1, y: y0++ })
        plot({ x: x0 - 1, y: y1 })
        plot({ x: x1 + 1, y: y1-- })
    }
}

const rectangle = (p0: Point, p1: Point, plot: (pt: Point) => void) => {
    const x0 = Math.min(p0.x, p1.x)
    const x1 = Math.max(p0.x, p1.x)
    const y0 = Math.min(p0.y, p1.y)
    const y1 = Math.max(p0.y, p1.y)

    line({ x: x0, y: y0 }, { x: x1, y: y0 }, plot)
    line({ x: x1, y: y0 }, { x: x1, y: y1 }, plot)
    line({ x: x1, y: y1 }, { x: x0, y: y1 }, plot)
    line({ x: x0, y: y1 }, { x: x0, y: y0 }, plot)
}

export const drawShape = {
    ellipse: drawEllipse,
    line: drawLine,
    rectangle: drawRectangle,
} as const

export const putShape = {
    ellipse: putEllipse,
    line: putLine,
    rectangle: putRectangle,
} as const