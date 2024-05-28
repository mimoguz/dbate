export function* intersperse<T, U>(this: Array<T>, separator: U): Generator<T | U> {
    for (let i = 0; i < this.length; i++) {
        yield this[i]
        if (i < (this.length - 1)) yield separator
    }
}

declare global {
    interface Array<T> {
        intersperse<U>(this: Array<T>, separator: U): Generator<T | U>
    }
}

Array.prototype.intersperse = intersperse