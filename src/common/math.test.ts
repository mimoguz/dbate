import { mod } from "./math"
import { describe, expect, it } from "vitest"

describe("mod function tests", () => {
    it("should correctly compute the modulo of two positive numbers", () => {
        const result = mod(10, 3)
        expect(result).to.equal(1)
    })

    it("should handle a negative dividend correctly, returning a positive result", () => {
        const result = mod(-10, 3)
        expect(result).to.equal(2)
    })
})