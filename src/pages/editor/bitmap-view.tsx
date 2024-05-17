import React from "react";
import { bitmap } from "../../drawing";
import { Bitmap } from "../../schema";

interface Props {
    bmp?: Bitmap
    zoom?: number
    style?: React.CSSProperties
}

const draw = (ctx: CanvasRenderingContext2D, bmp: Bitmap, scale: number = 1) => {
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.imageSmoothingEnabled = false
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
    bitmap.draw(bmp, ctx)
}

export const BitmapView = ({ bmp, zoom, style }: Props): JSX.Element => {
    const view = React.useRef<HTMLCanvasElement>(null)
    const scale = zoom ?? 1

    React.useEffect(
        () => {
            const ctx = view.current?.getContext("2d") ?? undefined
            if (!ctx || !bmp) return
            draw(ctx, bmp, scale)
        },
        [bmp, scale]
    )

    return (
        <canvas
            ref={view}
            width={scale * (bmp?.width ?? 1)}
            height={scale * (bmp?.height ?? 1)}
            style={style}
        />
    )
}