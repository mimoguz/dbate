import { describe, expect, it } from "vitest"
import { Color } from "./color"

describe("Color.eq, Color.ne", () => {
    it("should check if the colors are equal", () => {
        const c1 = Color.pack(255, 165, 0, 128)
        const c2 = Color.pack(255, 165, 0, 128)
        expect(c1.eq(c2)).toBeTruthy()
        expect(c1.ne(c2)).toBeFalsy()
    })

    it("should check if the colors aren't equal", () => {
        const c1 = Color.pack(255, 165, 0, 128)
        const c2 = Color.pack(255, 200, 0, 128)
        expect(c1.eq(c2)).toBeFalsy()
        expect(c1.ne(c2)).toBeTruthy()
    })
})

describe("Color.hex, Color.rgba", () => {
    it("should return a hexadecimal color string", () => {
        const color = Color.pack(255, 165, 0, 128)
        const result = color.hex
        expect(result).toBe("#ffa50080")
    })

    it("should return a hex string without alpha when alpha is 255", () => {
        const color = Color.pack(255, 165, 0, 255)
        const result = color.hex
        expect(result).toBe("#ffa500")
    })

    it("should return an rgba color string", () => {
        const color = Color.pack(255, 165, 0, 128)
        const result = color.rgba
        expect(result).toBe("rgba(255, 165, 0, 128)")
    })
})


describe("Color.fromCSSColor", () => {
    it('should return correct RGBA8888 for valid color strings', () => {
        const result = Color.fromCSSColor("#FF5733")
        expect(result?.eq(Color.pack(255, 87, 51, 255))).toBeTruthy()
    })

    it("should correctly convert named colors to Color", () => {
        expect(Color.fromCSSColor("red")?.eq(Color.pack(255, 0, 0, 255))).toBeTruthy()
        expect(Color.fromCSSColor("blue")?.eq(Color.pack(0, 0, 255, 255))).toBeTruthy()
        expect(Color.fromCSSColor("green")?.eq(Color.pack(0, 128, 0, 255))).toBeTruthy()
    })

    it("should return undefined for invalid color strings", () => {
        expect(Color.fromCSSColor("not_a_color")).toBeUndefined()
        expect(Color.fromCSSColor("123456")).toBeUndefined()
    })
})

describe("Color.shift", () => {
    it("should increase RGB values by the offset", () => {
        const initialColor = Color.pack(100, 150, 220, 255)
        const offset = 50
        const result = initialColor.clone().shift(offset)
        expect(result.red).toBe(150)
        expect(result.green).toBe(200)
        expect(result.blue).toBe(255)
        expect(result.alpha).toBe(255)
    })

    // Check decrement of each color component separately
    it("should decrease RGB values by the offset", () => {
        const initialColor = Color.pack(20, 200, 250, 255)
        const offset = -50
        const result = initialColor.clone().shift(offset, offset)
        expect(result.red).toBe(0)
        expect(result.green).toBe(150)
        expect(result.blue).toBe(200)
        expect(result.alpha).toBe(205)
    })
})


