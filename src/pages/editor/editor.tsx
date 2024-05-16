import { Center, Text, Title } from "@mantine/core"
import React, { useCallback, useMemo } from "react"
import { clamp } from "../../common"
import { ToggleGroupItem } from "../../common/components"
import * as DB from "../../database"
import * as i from "../../icons"
import { Tool, ToolResult, boundedTools, floodTools, freehandTools } from "../../tools"
import { NoopTool } from "../../tools/noop-tool"
import { BitmapView } from "./bitmap-view"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"

const tools: Array<{
    item: Pick<ToggleGroupItem<number>, "icon" | "accessibleLabel" | "key">,
    factory: () => Tool
}> = [
        {
            item: {
                icon: <i.LineMd />,
                accessibleLabel: "Draw line",
                key: "line",
            },
            factory: boundedTools.line,
        },
        {
            item: {
                icon: <i.RectangleMd />,
                accessibleLabel: "Draw rectangle",
                key: "rectangle",
            },
            factory: boundedTools.rectangle,
        },
        {
            item: {
                icon: <i.EllipseMd />,
                accessibleLabel: "Draw ellipse",
                key: "ellipse",
            },
            factory: boundedTools.ellipse,
        },
        {
            item: {
                icon: <i.PencilMd />,
                accessibleLabel: "Pencil",
                key: "pencil",
            },
            factory: freehandTools.pencil,
        },
        {
            item: {
                icon: <i.MarkerHorizontalMd />,
                accessibleLabel: "Horizontal marker",
                key: "marker-horizontal",
            },
            factory: freehandTools.markerPenHorizontal,
        },
        {
            item: {
                icon: <i.MarkerVerticalMd />,
                accessibleLabel: "Vertical marker",
                key: "marker-vertical",
            },
            factory: freehandTools.markerPenVertical,
        },
        {
            item: {
                icon: <i.BucketMd />,
                accessibleLabel: "Flood fill",
                key: "flood-fill",
            },
            factory: floodTools.bucket,
        },
        {
            item: {
                icon: <i.EraserMd />,
                accessibleLabel: "Eraser",
                key: "eraser",
            },
            factory: freehandTools.eraser,
        },
        {
            item: {
                icon: <i.AreaEraserMd />,
                accessibleLabel: "Area eraser",
                key: "flood-erase",
            },
            factory: floodTools.eraser,
        },
    ]

const toolItems: Array<ToggleGroupItem<number>> = tools.map((tool, index) => ({
    value: index,
    tooltip: <Text>{tool.item.accessibleLabel}</Text>,
    ...tool.item
}))

const createTool = (index: number): Tool => (tools.at(index)?.factory ?? (() => new NoopTool()))()

export const Editor = () => {
    const hero = DB.useHero("Bob")
    const [toolIndex, setToolIndex] = React.useState(0)
    const tool = useMemo(() => createTool(toolIndex), [toolIndex])
    const [zoom, setZoom] = React.useState(16)

    const toolOptions = {
        color: "blue",
        brushSize: 3,
    }

    const handlePaint = useCallback((result: ToolResult | undefined) => {
        if (result && result.tag === "affects-bitmap") {
            const bmp = result.value
            hero?.incrementalPatch({ logo: bmp })
        }
    }, [hero])

    const handleWheel: React.WheelEventHandler = e => {
        if (e.shiftKey) {
            e.stopPropagation()
            setZoom(z => clamp(1, 32, e.deltaY * -0.01 + z))
        }
    }

    return (
        <div onWheel={handleWheel} style={{ height: "100vh" }}>
            <header><Title order={2}>{hero?.name}</Title></header>
            <Toolbar
                tools={toolItems}
                toolIndex={toolIndex}
                onChange={setToolIndex}
            />
            {hero
                ? (
                    <Center p="xl" bg="gray">
                        <div style={{ display: "grid" }} >
                            <BitmapView
                                bmp={hero.logo}
                                zoom={Math.floor(zoom)}
                                style={{
                                    gridArea: "1 / 1",
                                    zIndex: 1,
                                    backgroundColor: "white"
                                }}
                            />
                            <ToolPreview
                                bmp={hero.logo}
                                tool={tool}
                                zoom={Math.floor(zoom)}
                                onDone={handlePaint}
                                style={{
                                    gridArea: "1 / 1",
                                    zIndex: 2,
                                    mixBlendMode: "difference",
                                    opacity: 0.9
                                }}
                                {...toolOptions}
                            />
                        </div>
                    </Center>
                )
                : null}
        </div>
    )
}