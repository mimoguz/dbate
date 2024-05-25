import React from "react";
import { Bitmap } from "../../data";
import { bitmap } from "../../drawing/bitmap-ops";

interface Props {
    bmp?: Bitmap
    zoom?: number
    style?: React.CSSProperties
}


const draw = (ctx: CanvasRenderingContext2D, bmp: Bitmap, scale: number) => {
    ctx.save()
    ctx.imageSmoothingEnabled = false
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight)
    bitmap.draw(bmp, ctx)
    ctx.restore()
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