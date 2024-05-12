import React from "react"
import { Point } from "../../common"
import { Bitmap } from "../../schema"
import { Tool, ToolOptions, ToolResult } from "../../tools"

interface ViewProps {
    bmp: Bitmap
    tool: Tool
    zoom?: number
}

interface ActionProps {
    onDone?: (result: ToolResult | undefined) => void
    onCancel?: () => void
}

const mousePos = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    scale: number
): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.x) / scale)
    const y = Math.floor((e.clientY - rect.y) / scale)
    return { x, y }
}

const FILL = "#808080FF";

export const ToolPreview = (props: ViewProps & ActionProps & ToolOptions): JSX.Element => {
    const { bmp, tool, zoom, onDone, onCancel, ...options } = props
    const scale = zoom ?? 1
    const view = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(
        () => {
            const ctx = view.current?.getContext("2d") ?? undefined
            if (ctx) {
                ctx.setTransform(scale, 0, 0, scale, 0, 0)
                ctx.fillStyle = FILL
                ctx.imageSmoothingEnabled = false
            }
            tool.context = ctx
            tool.options = options
            return (() => { tool.context = undefined })
        },
        [options, scale, tool]
    )

    const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = e => tool.start(mousePos(e, scale), bmp,)

    const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = e => tool.moveTo(mousePos(e, scale))

    const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = e => {
        const result = tool.end(mousePos(e, scale))
        if (onDone) onDone(result)
    }

    const handleMouseLeave: React.MouseEventHandler<HTMLCanvasElement> = () => {
        tool.cancel()
        if (onCancel) onCancel()
    }

    return (
        <canvas
            ref={view}
            width={props.bmp.width * scale}
            height={props.bmp.height * scale}
            style={{ imageRendering: "pixelated", cursor: "none" }}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseMove}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        />
    )
}