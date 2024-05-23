import { describe, expect, it, vi } from "vitest"
import { bitmap8888 } from "./bitmap8888-ops"
import { rgba8888 } from "./rgba8888-ops"

describe("getPixel, readPixel, putPixel", () => {
    it("should get the correct value for points within bitmap bounds", () => {
        const bmp = {
            width: 2,
            height: 2,
            colorBuffer: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 255, 255, 0, 255, 0, 0, 255, 255])
        }
        const pt = { x: 1, y: 1 }
        const result = bitmap8888.getPixel(bmp, pt)
        expect(result).toEqual(new Uint8ClampedArray([0, 0, 255, 255]))
    })

    it("should read the correct value for points within bitmap bounds", () => {
        const bmp = {
            width: 2,
            height: 2,
            colorBuffer: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 255, 255, 255, 0, 255, 0, 0, 255, 255])
        }
        const pt = { x: 1, y: 1 }
        const result = rgba8888.pack(0, 0, 0, 0)
        bitmap8888.readPixel(bmp, pt, result)
        expect(result).toEqual(new Uint8ClampedArray([0, 0, 255, 255]))
    })

    // Correctly sets a pixel color at a specified point within bitmap bounds
    it("should set the pixel color correctly within bitmap bounds", () => {
        const bmp = { width: 10, height: 10, colorBuffer: new Uint8ClampedArray(400) }
        const color = rgba8888.pack(255, 0, 0, 255)
        const pt = { x: 5, y: 5 }
        bitmap8888.putPixelMut(bmp, pt, color)
        expect(bitmap8888.getPixel(bmp, pt)).toEqual(color)
    })
})

describe("clone, copy", () => {
    it("should clone bitmap with new colorBuffer array", () => {
        const source = { width: 10, height: 20, colorBuffer: new Uint8ClampedArray(200).map((_v, index) => (index * 10) % 255) }
        const cloned = bitmap8888.clone(source)
        expect(cloned.colorBuffer).toEqual(source.colorBuffer)
        expect(cloned.colorBuffer).not.toBe(source.colorBuffer)
    })

    it("should copy the entire bitmap to the target at origin when no sourceRect and targetOffset are provided", () => {
        const source = { width: 5, height: 5, colorBuffer: new Uint8ClampedArray(100).map((_v, index) => (index * 10) % 255) }
        const target = { width: 5, height: 5, colorBuffer: new Uint8ClampedArray(100).fill(23) }
        bitmap8888.copy(source, target)
        expect(target.colorBuffer).toEqual(source.colorBuffer)
    })

    it("should copy only the given rectangle to the given offset", () => {
        const source = { width: 5, height: 5, colorBuffer: new Uint8ClampedArray(100).map((_v, index) => (index * 10) % 255) }
        const target = { width: 5, height: 5, colorBuffer: new Uint8ClampedArray(100).fill(25) }
        bitmap8888.copy(source, target, { x: 1, y: 1, w: 3, h: 1 }, { x: -1, y: 1 })
        for (let i = 0; i < 3; i++) {
            expect(bitmap8888.getPixel(target, { x: i, y: 2 }), `i: ${i}`)
                .toEqual(bitmap8888.getPixel(source, { x: i + 1, y: 1 }))
        }
    })
})

describe("mapMut", () => {
    it("should apply mutator to every pixel in a non-empty bitmap", () => {
        const bmp = { width: 2, height: 2, colorBuffer: new Uint8ClampedArray(16) };
        const mutator = vi.fn().mockImplementation((color) => {
            color[0] = 255; // Set red channel to max
        });
        bitmap8888.mapMut(bmp, mutator);
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
        const color = rgba8888.pack(255, 0, 0, 255)
        bitmap8888.fillRectMut(bmp, rect, color)
        for (let y = 10; y < 30; y++) {
            for (let x = 10; x < 40; x++) {
                const sample = bitmap8888.getPixel(bmp, { x, y })
                expect(sample).toEqual(color)
            }
        }
    })

    it("should correctly clip the rectangle that extends beyond the right edge of the bitmap", () => {
        const bmp = { width: 100, height: 100, colorBuffer: new Uint8ClampedArray(40000) }
        const rect = { x: 80, y: 10, w: 30, h: 20 }
        const color = rgba8888.pack(255, 0, 0, 255)
        bitmap8888.fillRectMut(bmp, rect, color);
        for (let y = 10; y < 30; y++) {
            for (let x = 80; x < 100; x++) {
                const sample = bitmap8888.getPixel(bmp, { x, y })
                expect(sample).toEqual(color)
            }
        }
        for (let y = 10; y < 30; y++) {
            for (let x = 100; x < 110; x++) {
                const sample = bitmap8888.getPixel(bmp, { x, y })
                expect(sample).toEqual(rgba8888.transparent)
            }
        }
    });
})