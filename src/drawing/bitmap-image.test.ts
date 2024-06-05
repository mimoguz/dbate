import { describe, expect, it, vi } from "vitest"
import { BitmapImage } from "./bitmap-image"
import { Color } from "./color"

describe("get, read, set, view", () => {
    it("should get the correct value for points within bitmap bounds", () => {
        const bmp = new BitmapImage(
            2,
            2,
            Uint8ClampedArray.of(
                255, 0, 0, 255,
                0, 255, 0, 255,
                255, 255, 0, 255,
                0, 0, 255, 255
            )
        )

        const pt = { x: 1, y: 1 }
        const result = bmp.get(pt.x, pt.y)
        expect(result.eq(Color.pack(0, 0, 255, 255))).toBeTruthy()
    })

    it("should read the correct value for points within bitmap bounds", () => {
        const bmp = new BitmapImage(
            2,
            2,
            Uint8ClampedArray.of(
                255, 0, 0, 255,
                0, 255, 0, 255,
                255, 255, 0, 255,
                0, 0, 255, 255
            )
        )
        const pt = { x: 1, y: 1 }
        const result = Color.zero()
        bmp.sample(pt.x, pt.y, result)
        expect(result.eq(Color.pack(0, 0, 255, 255))).toBeTruthy()
    })

    it("should set the pixel color correctly within bitmap bounds", () => {
        const bmp = new BitmapImage(10, 10)
        const color = Color.pack(255, 0, 0, 255)
        const pt = { x: 5, y: 5 }
        bmp.set(pt.x, pt.y, color)
        expect(bmp.get(pt.x, pt.y).eq(color)).toBeTruthy()
    })

    it("should change if a view changes", () => {
        const bmp = new BitmapImage(
            2,
            2,
            Uint8ClampedArray.of(
                255, 0, 0, 255,
                0, 255, 0, 255,
                255, 255, 0, 255,
                0, 0, 255, 255
            )
        )
        const pt = { x: 1, y: 1 }
        const view = bmp.getView(pt.x, pt.y)
        const color = Color.pack(100, 100, 100, 100)
        color.copy(view)
        const result = bmp.get(pt.x, pt.y)
        expect(result.eq(color)).toBeTruthy()
    })
})

describe("clone, copy", () => {
    it("should clone bitmap", () => {
        const dim = 10
        const source = new BitmapImage(dim, dim, new Uint8ClampedArray(dim * dim * 4).map((_v, index) => (index * 10) % 255))
        const cloned = source.clone()
        expect(cloned).not.toBe(source)
        for (let t = 0; t < 10; t++) {
            const x = Math.floor(Math.random() * dim)
            const y = Math.floor(Math.random() * dim)
            expect(cloned.get(x, y).eq(source.get(x, y))).toBeTruthy()
        }
    })

    it("should copy the entire bitmap to the target at origin if no source or destination rects were provided", () => {
        const dim = 5
        const source = new BitmapImage(dim, dim, new Uint8ClampedArray(dim * dim * 4).map((_v, index) => (index * 10) % 255))
        const target = new BitmapImage(dim, dim, new Uint8ClampedArray(dim * dim * 4).fill(23))
        source.copy(target)
        for (let t = 0; t < 10; t++) {
            const x = Math.floor(Math.random() * dim)
            const y = Math.floor(Math.random() * dim)
            expect(target.get(x, y).eq(source.get(x, y))).toBeTruthy()
        }
    })

    it("should copy only the given source rect to the given destination rect", () => {
        const dim = 5
        const source = new BitmapImage(dim, dim, new Uint8ClampedArray(dim * dim * 4).map((_v, index) => (index * 10) % 255))
        const destination = new BitmapImage(dim, dim, new Uint8ClampedArray(dim * dim * 4).fill(23))
        source.copy(
            destination,
            { x: 1, y: 1, w: 3, h: 1 },
            { x: 0, y: 2, w: 100, h: 100 }
        )
        for (let i = 0; i < 3; i++) {
            expect(destination.get(i, 2).eq(source.get(i + 1, 1))).toBeTruthy()
        }
    })
})

describe("modify", () => {
    it("should apply mutator to every pixel in a non-empty bitmap", () => {
        const bmp = new BitmapImage(2, 2)
        const mutator = vi.fn().mockImplementation((_x, _y, color) => {
            color.red = 255
        })
        bmp.modify(mutator);
        expect(mutator).toHaveBeenCalledTimes(4);
        expect(bmp.get(0, 0).red).toBe(255)
        expect(bmp.get(1, 0).red).toBe(255)
        expect(bmp.get(0, 1).red).toBe(255)
        expect(bmp.get(1, 1).red).toBe(255)
    })
})

describe("fill", () => {
    it("should fill the specified rectangle when it's within bitmap bounds", () => {
        const bmp = new BitmapImage(100, 100)
        const rect = { x: 10, y: 10, w: 30, h: 20 }
        const color = Color.pack(255, 0, 0, 255)
        bmp.fill(rect, color)
        for (let y = 10; y < 30; y++) {
            for (let x = 10; x < 40; x++) {
                const sample = bmp.get(x, y)
                expect(sample.eq(color)).toBeTruthy
            }
        }
    })

    it("should correctly clip the rectangle that extends beyond the right edge of the bitmap", () => {
        const bmp = new BitmapImage(100, 100)
        const rect = { x: 80, y: 10, w: 30, h: 20 }
        const color = Color.pack(255, 0, 0, 255)
        bmp.fill(rect, color)
        for (let y = 10; y < 30; y++) {
            for (let x = 80; x < 100; x++) {
                const sample = bmp.get(x, y)
                expect(sample.eq(color)).toBeTruthy()
            }
        }
        for (let x = 0; x < 100; x++) {
            const sample = bmp.get(x, rect.y + rect.h)
            expect(sample.alpha).toEqual(0)
        }
    })
})