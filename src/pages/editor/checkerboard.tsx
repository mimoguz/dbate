import React, { useEffect } from "react"
import checkersSrc from "/checkers.png"

const checkers = new Image()
checkers.src = checkersSrc

interface Props {
    style?: React.CSSProperties
    zoom?: number,
    width: number,
    height: number,
}

export const Checkerboard = ({ style, zoom, width, height }: Props): JSX.Element => {
    const scale = zoom ?? 1
    const view = React.useRef<HTMLCanvasElement>(null)

    useEffect(
        () => {
            const ctx = view.current?.getContext("2d")
            if (!ctx) return
            console.log(ctx.canvas.clientWidth)
            ctx.setTransform(scale, 0, 0, scale, 0, 0)
            ctx.imageSmoothingEnabled = false
            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = ctx.createPattern(checkers, "repeat") ?? "yellow"
            ctx.fillRect(0, 0, width, height)
        },
        [scale, width, height]
    )

    return (
        <canvas
            ref={view}
            width={(width ?? 1) * scale}
            height={(height ?? 1) * scale}
            style={style}
        />
    )
}