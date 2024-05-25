import { makeAutoObservable } from "mobx"
import { mod } from "./math"

export function* intersperse<T, U>(xs: Array<T>, separator: U): Generator<T | U> {
    for (let i = 0; i < xs.length; i++) {
        yield xs[i]
        if (i < (xs.length - 1)) yield separator
    }
}

/// A simple stack with a maximum size. 
/// When the stack size exceed the maximum size, older items will be dropped.
export class SizedStack<T> {
    // This is implemented as a circular array
    constructor(size: number) {
        makeAutoObservable(this)
        if (size < 1) throw new Error("Size can't be less than one")
        this.size = Math.floor(size)
        this.data = new Array<T | null>(size)
    }

    readonly size: number

    private readonly data: Array<T | null>
    private point: number = -1
    private _count: number = 0

    get count(): number {
        return this._count
    }

    at(index: number): T | undefined {
        const i = mod(this.point - index, this.size)
        return this.data[i] ?? undefined
    }

    clear() {
        this.data.fill(null)
        this.point = -1
        this._count = 0
        // this.atom.reportChanged()
    }

    exists(predicate: (value: T) => boolean): boolean {
        for (let offset = 0; offset < this._count; offset++) {
            // Traverse backward starting from point _count number of items
            const index = mod(this.point - offset, this.size)
            if (predicate(this.data[index]!)) return true
        }
        return false
    }

    forAll(predicate: (value: T) => boolean): boolean {
        for (let offset = 0; offset < this._count; offset++) {
            // Traverse backward starting from point _count number of items
            const index = mod(this.point - offset, this.size)
            if (!predicate(this.data[index]!)) return false
        }
        return true
    }

    push(value: T): T | undefined {
        if (value === undefined || value === null) {
            throw new Error("SizedStack doesn't support null or undefined values")
        }
        this.increase()
        const oldValue = this.data[this.point]
        this.data[this.point] = value
        // this.atom.reportChanged()
        return (oldValue !== null ? oldValue : undefined)
    }

    pop(): T | undefined {
        if (this.count <= 0) return undefined
        const result = this.data[this.point]!
        this.data[this.point] = null
        this.decrease()
        // this.atom.reportChanged()
        return result
    }

    mapToArray<U>(f: (value: T, index: number) => U): Array<U> {
        if (this._count === 0) return []
        if (this._count === 1) return [f(this.data[this.point]!, 0)]
        const result = new Array(this._count)
        for (let offset = 0; offset < this._count; offset++) {
            // Traverse backward starting from point _count number of items
            const index = mod(this.point - offset, this.size)
            result[this._count - offset - 1] = f(this.data[index]!, offset)
        }
        return result
    }

    static from<U>(source: Array<U>, size?: number): SizedStack<U> {
        const maxSize = size ?? source.length
        const result = new SizedStack<U>(maxSize)
        const start = Math.max(0, source.length - maxSize)
        for (let i = start; i < source.length; i++) {
            const value = source[i]
            if (value !== null || value !== undefined) result.push(value)
        }
        return result
    }

    private increase() {
        this.point = (this.point + 1) % this.size
        this._count = Math.min(this._count + 1, this.size)
    }

    private decrease() {
        this.point = mod(this.point - 1, this.size)
        this._count = Math.max(0, this.count - 1)
    }
}
