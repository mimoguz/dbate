import { describe, expect, it, vi } from "vitest"
import { bitmap } from "./bitmap-ops"
import { rgba } from "./rgba-ops"

describe("getPixel, readPixel, putPixel", () => {
    it("should get the correct value for points within bitmap bounds", () => {
        const bmp = {
            width: 2,
            height: 2,
            colorBuffer: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 255, 255, 0, 255, 0, 0, 255, 255])
        }
        const pt = { x: 1, y: 1 }
        const result = bitmap.getPixel(bmp, pt)
        expect(result).toEqual(new Uint8ClampedArray([0, 0, 255, 255]))
    })

    it("should read the correct value for points within bitmap bounds", () => {
        const bmp = {
            width: 2,
            height: 2,
            colorBuffer: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 255, 255, 0, 255, 0, 0, 255, 255])
        }
        const pt = { x: 1, y: 1 }
        const result = rgba.pack(0, 0, 0, 0)
        bitmap.readPixel(bmp, pt, result)
        expect(result).toEqual(new Uint8ClampedArray([0, 0, 255, 255]))
    })

    // Correctly sets a pixel color at a specified point within bitmap bounds
    it("should set the pixel color correctly within bitmap bounds", () => {
        const bmp = { width: 10, height: 10, colorBuffer: new Uint8ClampedArray(400) }
        const color = rgba.pack(255, 0, 0, 255)
        const pt = { x: 5, y: 5 }
        bitmap.putPixelMut(bmp, pt, color)
        expect(bitmap.getPixel(bmp, pt)).toEqual(color)
    })
})

describe("clone, copy", () => {
    it("should clone bitmap with new colorBuffer array", () => {
        const source = { width: 10, height: 20, colorBuffer: new Uint8ClampedArray(200).map((_v, index) => (index * 10) % 255) }
        const cloned = bitmap.clone(source)
        expect(cloned.colorBuffer).toEqual(source.colorBuffer)
        expect(cloned.colorBuffer).not.toBe(source.colorBuffer)
    })

    it("should copy the entire bitmap to the target at origin when no sourceRect and targetOffset are provided", () => {
        const source = { width: 5, height: 5, colorBuffer: new Uint8ClampedArray(100).map((_v, index) => (index * 10) % 255) }
        const target = { width: 5, height: 5, colorBuffer: new Uint8ClampedArray(100).fill(23) }
        bitmap.copy(source, target)
        expect(target.colorBuffer).toEqual(source.colorBuffer)
    })

    it("should copy only the given rectangle to the given offset", () => {
        const source = { width: 5, height: 5, colorBuffer: new Uint8ClampedArray(100).map((_v, index) => (index * 10) % 255) }
        const target = { width: 5, height: 5, colorBuffer: new Uint8ClampedArray(100).fill(25) }
        bitmap.copy(source, target, { x: 1, y: 1, w: 3, h: 1 }, { x: -1, y: 1 })
        for (let i = 0; i < 3; i++) {
            expect(bitmap.getPixel(target, { x: i, y: 2 }), `i: ${i}`)
                .toEqual(bitmap.getPixel(source, { x: i + 1, y: 1 }))
        }
    })
})

describe("mapMut", () => {
    it("should apply mutator to every pixel in a non-empty bitmap", () => {
        const bmp = { width: 2, height: 2, colorBuffer: new Uint8ClampedArray(16) };
        const mutator = vi.fn().mockImplementation((color) => {
            color[0] = 255; // Set red channel to max
        });
        bitmap.mapMut(bmp, mutator);
        expect(mutator).toHaveBeenCalledTimes(4);
        expect(bmp.colorBuffer[0]).toBe(255);
        expect(bmp.colorBuffer[4]).toBe(255);
        expect(bmp.colorBuffer[8]).toBe(255);
        expect(bmp.colorBuffer[12]).toBe(255);
    });
})

describe("fillRect", () => {
    it("should fill the specified rectangle when it is within bitmap bounds", () => {
        const bmp = { width: 100, height: 100, colorBuffer: new Uint8ClampedArray(40000) }
        const rect = { x: 10, y: 10, w: 30, h: 20 }
        const color = rgba.pack(255, 0, 0, 255)
        bitmap.fillRectMut(bmp, rect, color)
        for (let y = 10; y < 30; y++) {
            for (let x = 10; x < 40; x++) {
                const sample = bitmap.getPixel(bmp, { x, y })
                expect(sample).toEqual(color)
            }
        }
    })

    it("should correctly clip the rectangle that extends beyond the right edge of the bitmap", () => {
        const bmp = { width: 100, height: 100, colorBuffer: new Uint8ClampedArray(40000) }
        const rect = { x: 80, y: 10, w: 30, h: 20 }
        const color = rgba.pack(255, 0, 0, 255)
        bitmap.fillRectMut(bmp, rect, color);
        for (let y = 10; y < 30; y++) {
            for (let x = 80; x < 100; x++) {
                const sample = bitmap.getPixel(bmp, { x, y })
                expect(sample).toEqual(color)
            }
        }
        for (let y = 10; y < 30; y++) {
            for (let x = 100; x < 110; x++) {
                const sample = bitmap.getPixel(bmp, { x, y })
                expect(sample).toEqual(rgba.transparent)
            }
        }
    });
})