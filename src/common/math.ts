export const eDiv = (a: number, b: number): number => a >= 0
    ? Math.floor(a / b)
    : Math.floor(-a / b) * -1

export const eRem = (a: number, b: number): number => a - b * eDiv(a, b)
