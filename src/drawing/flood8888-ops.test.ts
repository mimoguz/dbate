import { describe, expect, it } from "vitest"
import { bitmap8888 } from "./bitmap8888-ops";
import { flood8888 } from "./flood8888-ops";
import { rgba8888 } from "./rgba8888-ops";

describe("fill", () => {
    it("should not alter the bitmap when start point color matches fill color", () => {
        const bmp = { width: 10, height: 10, colorBuffer: new Uint8ClampedArray(400).fill(255) }
        const cloned = bitmap8888.clone(bmp)
        const start = { x: 5, y: 5 }
        const fillColor = rgba8888.pack(255, 255, 255, 255)
        flood8888.fill(bmp, start, fillColor)
        expect(cloned.colorBuffer).toEqual(bmp.colorBuffer)
    })

    it("should fill the area with the specified color when start point color differs", () => {
        const bmp = { width: 10, height: 10, colorBuffer: new Uint8ClampedArray(400).fill(255) }
        bitmap8888.fillRectMut(bmp, { x: 2, y: 2, w: 3, h: 3 }, rgba8888.pack(255, 0, 0))
        const start = { x: 3, y: 3 }
        const check = { x: 4, y: 4 }
        const fillColor = rgba8888.pack(255, 255, 255, 255)
        flood8888.fill(bmp, start, fillColor)
        expect(bitmap8888.getPixel(bmp, check)).toEqual(fillColor)
    })
})