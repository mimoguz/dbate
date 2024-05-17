export interface Rect {
    x: number
    y: number
    w: number
    h: number
}

export const clamp = (min: number, max: number, value: number): number => Math.max(min, Math.min(max, value))