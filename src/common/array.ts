export function* intersperse<T, U>(xs: Array<T>, separator: U): Generator<T | U> {
    for (let i = 0; i < xs.length; i++) {
        yield xs[i]
        if (i < (xs.length - 1)) yield separator
    }
}

/// A simple stack with a maximum size. 
/// When the stack size exceed the maximum size, older items will be dropped.
export class SizedStack<T> {
    constructor(size: number) {
        if (size < 1) throw new Error("Size can't be less than one")
        this.size = Math.floor(size)
        this.data = new Array<T | undefined>(size)
    }

    readonly size: number

    private readonly data: Array<T | undefined>
    private first: number = -1
    private last: number = -1
    private _count: number = 0

    get count(): number {
        return this._count
    }

    clear() {
        this.data.fill(undefined)
        this.first = -1
        this.last = -1
    }

    push(value: T) {
        if (value === undefined || value === null) {
            throw new Error("Sized stack doesn't support null or undefined values")
        }
        if (this._count == this.size) {
            // Slide one
            this.first = (this.first + 1) % this.size
            this._count -= 1
        } else if (this.first < 0) {
            this.first = 0
        }
        this.last = (this.last + 1) % this.size
        this.data[this.last] = value
        this._count += 1
    }

    pop(): T | undefined {
        if (this._count > 0) {
            const result = this.data[this.last]!
            this.data[this.last] = undefined
            this.last = this.last - 1
            if (this.last < 0) this.last = this.size - 1
            this._count -= 1
            if (this.count === 0) {
                this.last = -1
                this.first = -1
            }
            return result
        }
        return undefined
    }

    mapToArray<U>(f: (value: T) => U): Array<U> {
        if (this._count === 0) return []
        if (this._count === 1) return [f(this.data[0]!)]
        const result = new Array(this._count)
        let node = this.first
        let i = 0
        do {
            result[i] = f(this.data[node]!)
            node = (node + 1) % this.size
            i++
        } while (node !== this.last)
        result[this._count - 1] = f(this.data[this.last]!)
        return result
    }
}
