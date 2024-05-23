import { describe, expect, it } from "vitest"
import { SizedStack, intersperse } from "./array"

describe("intersperse", () => {
    it("should intersperse separator between elements", () => {
        const array = [1, 2, 3]
        const separator = ","
        const generator = intersperse(array, separator)
        expect(Array.from(generator)).toEqual([1, ",", 2, ",", 3])
    })
})

describe("SizedStack", () => {
    it("should store items correctly within size limit", () => {
        const stack = new SizedStack<number>(3)
        stack.push(1)
        stack.push(2)
        stack.push(3)
        expect(stack.count).toBe(3)
        expect(stack.mapToArray(x => x)).toEqual([1, 2, 3])
    })

    it("should remove the oldest item when stack is full", () => {
        const stack = new SizedStack<number>(3)
        stack.push(1)
        stack.push(2)
        stack.push(3)
        stack.push(4) // This should remove "1"
        expect(stack.count).toBe(3)
        expect(stack.mapToArray(x => x)).toEqual([2, 3, 4])
    })

    // Popping items should return them in last-in-first-out order
    it("should return items in last-in-first-out order when popping items", () => {
        const stack = new SizedStack<number>(3)
        stack.push(1)
        stack.push(2)
        stack.push(3)
        expect(stack.pop()).toBe(3)
        expect(stack.pop()).toBe(2)
        expect(stack.pop()).toBe(1)
        expect(stack.count).toBe(0)
    })

    it("should maintain correct order and count through multiple push/pop cycles", () => {
        const stack = new SizedStack<number>(3)
        stack.push(1)
        stack.push(2)
        stack.push(3)
        expect(stack.count).toBe(3)
        expect(stack.mapToArray(x => x)).toEqual([1, 2, 3])

        stack.pop()
        stack.pop()
        stack.push(4)
        expect(stack.count).toBe(2)
        expect(stack.mapToArray(x => x)).toEqual([1, 4])

        stack.push(5)
        stack.pop()
        stack.push(6)
        stack.push(7)
        expect(stack.count).toBe(3)
        expect(stack.mapToArray(x => x)).toEqual([4, 6, 7])
    })
})
