export const bitmapSchema = {
    type: "object",
    properties: {
        width: { type: "integer" },
        height: { type: "integer" },
        colorBuffer: {
            type: "array",
            items: { type: "integer" }
        }
    },
    required: ["id", "width", "height", "colorBuffer"],
} as const

export type Bitmap = {
    width: number,
    height: number,
    colorBuffer: Array<number>,
}
