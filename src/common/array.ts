export function* intersperse<T, U>(xs: Array<T>, separator: U): Generator<T | U> {
    for (let i = 0; i < xs.length; i++) {
        yield xs[i]
        if (i < (xs.length - 1)) yield separator
    }
}
