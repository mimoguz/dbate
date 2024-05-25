export interface Bitmap {
    width: number
    height: number
    colorBuffer: Uint8ClampedArray
}

export interface EncodedBitmap {
    width: number
    height: number
    data: string
}
