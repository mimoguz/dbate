import pako from "pako"
import { Bitmap } from "../drawing"

export interface EncodedBitmap {
    width: number
    height: number
    data: string
}


const encodeBitmap = (bmp: Bitmap): string => {
    const base64 = Buffer.from(pako.deflate(bmp.colorBuffer)).toString("base64")
    return JSON.stringify({
        width: bmp.width,
        height: bmp.height,
        data: base64
    })
}

const decodeBitmap = (source: string): Bitmap | undefined => {
    try {
        const json: EncodedBitmap = JSON.parse(source)
        const inflated = pako.inflate(Buffer.from(json.data, "base64"))
        return ({
            width: json.width,
            height: json.height,
            colorBuffer: new Uint8ClampedArray(inflated)
        })
    } catch (error) {
        console.debug(error)
        return undefined
    }
}

export const encodedBitmap = {
    fromBitmap: encodeBitmap,
    toBitmap: decodeBitmap,
} as const
