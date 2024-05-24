export interface Rect {
    x: number
    y: number
    w: number
    h: number
}

export interface Point {
    x: number
    y: number
}

export const point = {
    outside: (): Point => ({
        x: Number.NEGATIVE_INFINITY,
        y: Number.NEGATIVE_INFINITY,
    }),

    zero: () => ({ x: 0, y: 0, }),

    distance: (a: Point, b: Point): Point => ({
        x: a.x - b.x,
        y: a.y - b.y,
    }),

    equals: (a: Point, b: Point): boolean => a.x === b.x && a.y === b.y,
} as const

export const clamp = (min: number, max: number, value: number): number => Math.max(min, Math.min(max, value))

export const mod = (dividend: number, divisor: number): number => (dividend % divisor + divisor) % divisor
