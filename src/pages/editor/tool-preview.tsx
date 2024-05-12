import React from "react"
import { Point } from "../../common"
import { Bitmap } from "../../schema"
import {
    createTool,
    Tool,
    ToolFactory,
    ToolOptions,
    ToolResult,
} from "../../tools"

interface ViewProps {
    bmp: Bitmap
    tool: ToolFactory
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

const FILL = "#80808080";

export const ToolPreview = (props: ViewProps & ActionProps & ToolOptions): JSX.Element => {
    const scale = props.zoom ?? 1
    const view = React.useRef<HTMLCanvasElement>(null)
    const [context, setContext] = React.useState<CanvasRenderingContext2D | undefined>(undefined)
    const [tool, setTool] = React.useState<Tool | undefined>(undefined)

    const getContext = React.useCallback(
        (): CanvasRenderingContext2D | undefined => {
            if (context) {
                if (context.getTransform().m11 !== scale) context.setTransform(scale, 0, 0, scale, 0, 0)
                return context
            }
            const ctx = view.current?.getContext("2d")
            if (ctx) {
                ctx.setTransform(scale, 0, 0, scale, 0, 0)
                ctx.fillStyle = FILL
                ctx.imageSmoothingEnabled = false
                setContext(ctx)
                return ctx
            }
            return undefined
        },
        [context, scale]
    )

    React.useEffect(
        () => {
            const ctx = getContext()
            if (tool && tool.tag === props.tool.toolTag && tool.context === ctx) return
            setTool(ctx
                ? createTool(props.tool, ctx, { color: props.color, brushSize: props.brushSize })
                : undefined
            )
        },
        [getContext, props.brushSize, props.color, props.tool, tool]
    )

    React.useEffect(
        () => { getContext() },
        [getContext]
    )

    const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = e => tool?.start(mousePos(e, scale), props.bmp,)

    const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = e => tool?.moveTo(mousePos(e, scale))

    const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = e => {
        const result = tool?.end(mousePos(e, scale))
        if (tool && props.onDone) props.onDone(result)
    }

    const handleMouseLeave: React.MouseEventHandler<HTMLCanvasElement> = () => {
        tool?.cancel()
        if (props.onCancel) props.onCancel()
    }

    return (
        <canvas
            ref={view}
            width={props.bmp.width * scale}
            height={props.bmp.height * scale}
            style={{ imageRendering: "pixelated", cursor: "cell" }}
            onMouseDown={handleMouseDown}
            onMouseEnter={handleMouseMove}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        />
    )
}