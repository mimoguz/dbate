import React from "react";
import { Bitmap } from "../../schema";
import { bitmap, rgba8 } from "../../drawing";

interface Props {
    bmp?: Bitmap
    zoom?: number
}

const draw = (ctx: CanvasRenderingContext2D, bmp: Bitmap) => {
    const lastColor = {
        style: "#00000000",
        value: 0,
    }
    ctx.save()
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
    ctx.fillStyle = lastColor.style
    bmp.colorBuffer.forEach((color, index) => {
        const { x, y } = bitmap.toPoint(bmp, index)
        if (color !== lastColor.value) {
            lastColor.style = rgba8.toString(color)
            lastColor.value = color
            ctx.fillStyle = lastColor.style
        }
        ctx.fillRect(x, y, 1, 1)
    })
    ctx.restore()
}

export const BitmapView = ({ bmp, zoom }: Props): JSX.Element => {
    const view = React.useRef<HTMLCanvasElement>(null)
    const scale = zoom ?? 1

    React.useEffect(
        () => {
            const ctx = view.current?.getContext("2d") ?? undefined
            if (!ctx || !bmp) return
            ctx.setTransform(scale, 0, 0, scale, 0, 0)
            ctx.imageSmoothingEnabled = false
            draw(ctx, bmp)
        },
        [bmp, scale]
    )

    return (
        <canvas
            ref={view}
            width={scale * (bmp?.width ?? 1)}
            height={scale * (bmp?.height ?? 1)}
        />
    )
}