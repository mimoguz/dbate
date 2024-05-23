import { describe, expect, it } from "vitest"
import { rgba8888, RGBA8888 } from "./rgba8888-ops"

describe("toString", () => {
    it("should return a hexadecimal color string when format is hex", () => {
        const rgba = rgba8888.pack(255, 165, 0, 128)
        const result = rgba8888.toString(rgba as RGBA8888, "hex")
        expect(result).toBe("#ffa50080")
    })

    it("should return a hex string without alpha when alpha is 255", () => {
        const color: RGBA8888 = rgba8888.pack(255, 165, 0, 255)
        const result = rgba8888.toString(color, "hex")
        expect(result).toBe("#ffa500")
    })

    it("should return an rgba color string when format is rgba", () => {
        const rgba = rgba8888.pack(255, 165, 0, 128)
        const result = rgba8888.toString(rgba as RGBA8888, "rgba")
        expect(result).toBe("rgba(255, 165, 0, 128)")
    })
})


describe("fromString", () => {
    it('should return correct RGBA8888 for valid color strings', () => {
        const result = rgba8888.fromString('#FF5733')
        expect(result).toEqual(rgba8888.pack(255, 87, 51, 255))
    })

    it("should correctly convert named colors to RGBA8888", () => {
        expect(rgba8888.fromString("red")).toEqual(rgba8888.pack(255, 0, 0, 255))
        expect(rgba8888.fromString("blue")).toEqual(rgba8888.pack(0, 0, 255, 255))
        expect(rgba8888.fromString("green")).toEqual(rgba8888.pack(0, 128, 0, 255))
    })

    it("should return default black with full opacity for invalid color strings", () => {
        expect(rgba8888.fromString("not_a_color")).toEqual(rgba8888.pack(0, 0, 0, 255))
        expect(rgba8888.fromString("123456")).toEqual(rgba8888.pack(0, 0, 0, 255))
    })
})

describe("shift", () => {
    it("should increase RGB values by the offset", () => {
        const initialColor = rgba8888.pack(100, 150, 220, 255)
        const offset = 50
        const result = rgba8888.shift(initialColor, offset)
        expect(result[0]).toBe(150)
        expect(result[1]).toBe(200)
        expect(result[2]).toBe(255)
        expect(result[3]).toBe(255)
    })

    // Check decrement of each color component separately
    it("should decrease RGB values by the offset", () => {
        const initialColor = rgba8888.pack(20, 200, 250, 255)
        const offset = -50
        const result = rgba8888.shift(initialColor, offset, offset)
        expect(result[0]).toBe(0)
        expect(result[1]).toBe(150)
        expect(result[2]).toBe(200)
        expect(result[3]).toBe(205)
    })
})


