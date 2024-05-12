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
    const { bmp, tool, zoom, onDone, onCancel, ...options } = props
    const scale = zoom ?? 1
    const view = React.useRef<HTMLCanvasElement>(null)
    const [context, setContext] = React.useState<CanvasRenderingContext2D | undefined>(undefined)
    const [currentTool, setTool] = React.useState<Tool | undefined>(undefined)

    console.log(view.current?.getContext("2d"))

    const getContext = React.useCallback(
        (): CanvasRenderingContext2D | undefined => {
            if (context) {
                context.setTransform(scale, 0, 0, scale, 0, 0)
                return context
            }

            const ctx = view.current?.getContext("2d") ?? undefined
            if (ctx) {
                ctx.setTransform(scale, 0, 0, scale, 0, 0)
                ctx.fillStyle = FILL
                ctx.imageSmoothingEnabled = false
            }
            setContext(ctx)
            return ctx
        },
        [context, scale]
    )

    React.useEffect(
        () => {
            const ctx = getContext()
            if (tool.toolTag === currentTool?.tag) {
                currentTool.context = ctx
                currentTool.options = options
                return
            }
            const newTool = createTool(tool)
            newTool.context = ctx
            newTool.options = options
            setTool(newTool)

            return (() => {
                if (currentTool) currentTool.context = undefined
            })
        },
        [currentTool, getContext, tool, options]
    )

    const handleMouseDown: React.MouseEventHandler<HTMLCanvasElement> = e => currentTool?.start(mousePos(e, scale), bmp,)

    const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = e => currentTool?.moveTo(mousePos(e, scale))

    const handleMouseUp: React.MouseEventHandler<HTMLCanvasElement> = e => {
        const result = currentTool?.end(mousePos(e, scale))
        if (onDone) onDone(result)
    }

    const handleMouseLeave: React.MouseEventHandler<HTMLCanvasElement> = () => {
        currentTool?.cancel()
        if (onCancel) onCancel()
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