import { describe, expect, it } from "vitest"
import { flood } from "./flood";
import { BitmapImage } from "./bitmap-image";
import { Color } from "./color";

describe("flood fill", () => {
    it("should not alter the bitmap when start point color matches fill color", () => {
        const bmp = new BitmapImage(10, 10, new Uint8ClampedArray(10 * 10 * 4).fill(255))
        const cloned = bmp.clone()
        const start = { x: 5, y: 5 }
        const fillColor = Color.pack(255, 255, 255, 255)
        flood.fill(bmp, start, fillColor)
        expect(cloned.get(0, 0).eq(bmp.get(0, 0))).toBeTruthy()
    })

    it("should fill the area with the specified color when start point color differs", () => {
        const bmp = new BitmapImage(10, 10, new Uint8ClampedArray(10 * 10 * 4).fill(255))
        bmp.fill({ x: 2, y: 2, w: 3, h: 3 }, Color.pack(255, 0, 0, 255))
        const start = { x: 3, y: 3 }
        const check = { x: 4, y: 4 }
        const fillColor = Color.pack(255, 255, 255, 255)
        flood.fill(bmp, start, fillColor)
        expect(bmp.get(check.x, check.y).eq(fillColor)).toBeTruthy()
    })
})