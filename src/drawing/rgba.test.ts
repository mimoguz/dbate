import { describe, expect, it } from "vitest"
import { rgba, RGBA } from "./rgba"

describe("toString", () => {
    it("should return a hexadecimal color string when format is hex", () => {
        const color = rgba.pack(255, 165, 0, 128)
        const result = rgba.toString(color, "hex")
        expect(result).toBe("#ffa50080")
    })

    it("should return a hex string without alpha when alpha is 255", () => {
        const color: RGBA = rgba.pack(255, 165, 0, 255)
        const result = rgba.toString(color, "hex")
        expect(result).toBe("#ffa500")
    })

    it("should return an rgba color string when format is rgba", () => {
        const color = rgba.pack(255, 165, 0, 128)
        const result = rgba.toString(color, "rgba")
        expect(result).toBe("rgba(255, 165, 0, 128)")
    })
})


describe("fromString", () => {
    it('should return correct RGBA8888 for valid color strings', () => {
        const result = rgba.fromString('#FF5733')
        expect(result).toEqual(rgba.pack(255, 87, 51, 255))
    })

    it("should correctly convert named colors to RGBA8888", () => {
        expect(rgba.fromString("red")).toEqual(rgba.pack(255, 0, 0, 255))
        expect(rgba.fromString("blue")).toEqual(rgba.pack(0, 0, 255, 255))
        expect(rgba.fromString("green")).toEqual(rgba.pack(0, 128, 0, 255))
    })

    it("should return default black with full opacity for invalid color strings", () => {
        expect(rgba.fromString("not_a_color")).toEqual(rgba.pack(0, 0, 0, 255))
        expect(rgba.fromString("123456")).toEqual(rgba.pack(0, 0, 0, 255))
    })
})

describe("shift", () => {
    it("should increase RGB values by the offset", () => {
        const initialColor = rgba.pack(100, 150, 220, 255)
        const offset = 50
        const result = rgba.shift(initialColor, offset)
        expect(result[0]).toBe(150)
        expect(result[1]).toBe(200)
        expect(result[2]).toBe(255)
        expect(result[3]).toBe(255)
    })

    // Check decrement of each color component separately
    it("should decrease RGB values by the offset", () => {
        const initialColor = rgba.pack(20, 200, 250, 255)
        const offset = -50
        const result = rgba.shift(initialColor, offset, offset)
        expect(result[0]).toBe(0)
        expect(result[1]).toBe(150)
        expect(result[2]).toBe(200)
        expect(result[3]).toBe(205)
    })
})


