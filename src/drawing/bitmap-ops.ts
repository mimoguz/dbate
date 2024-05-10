import { Point } from "../common/point";
import { Bitmap } from "../schema/bitmap-schema";

const empty = (width: number, height: number): Bitmap => ({
    width,
    height,
    colorBuffer: new Array<number>(width * height).fill(0),
});

const clone = (bmp: Bitmap): Bitmap => ({
    width: bmp.width,
    height: bmp.height,
    colorBuffer: bmp.colorBuffer.slice(),
});

const getPixel = (bmp: Bitmap, point: Point): number => bmp.colorBuffer[point.y * bmp.width + point.x];

const putPixelMut = (bmp: Bitmap, point: Point, rgba: number) => {
    bmp.colorBuffer[point.y * bmp.width + point.x] = rgba;
};

const putPixel = (bmp: Bitmap, point: Point, rgba: number): Bitmap => {
    const cloned = clone(bmp);
    putPixelMut(cloned, point, rgba);
    return cloned;
};

export const bitmap = {
    clone,
    empty,
    getPixel,
    putPixel,
    putPixelMut,
} as const;
