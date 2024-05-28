import { describe, expect, it } from "vitest"
import "./array"

describe("intersperse", () => {
    it("should intersperse separator between elements", () => {
        const array = [1, 2, 3]
        const separator = ","
        const generator = array.intersperse(separator)
        expect(Array.from(generator)).toEqual([1, ",", 2, ",", 3])
    })
})
