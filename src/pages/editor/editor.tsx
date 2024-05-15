import { Center, Text, Title } from "@mantine/core"
import React, { useCallback, useMemo } from "react"
import { ToggleGroupItem } from "../../common/components"
import * as DB from "../../database"
import * as i from "../../icons"
import { Tool, ToolResult, boundedTools, floodTools, freehandTools } from "../../tools"
import { NoopTool } from "../../tools/noop-tool"
import { BitmapView } from "./bitmap-view"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"

const tools: Array<ToggleGroupItem<number>> = [
    {
        icon: <i.LineMd />,
        accessibleLabel: "Draw line",
        tooltip: <Text>Draw line</Text>,
        key: "line",
        value: 0
    },
    {
        icon: <i.RectangleMd />,
        accessibleLabel: "Draw rectangle",
        tooltip: <Text>Draw rectangle</Text>,
        key: "rectangle",
        value: 1
    },
    {
        icon: <i.EllipseMd />,
        accessibleLabel: "Draw ellipse",
        tooltip: <Text>Draw ellipse</Text>,
        key: "ellipse",
        value: 2
    },
    {
        icon: <i.PencilMd />,
        accessibleLabel: "Pencil",
        tooltip: <Text>Pencil</Text>,
        key: "pencil",
        value: 3
    },
    {
        icon: <i.MarkerHorizontalMd />,
        accessibleLabel: "Horizontal marker",
        tooltip: <Text>Horizontal marker</Text>,
        key: "marker-horizontal",
        value: 4
    },
    {
        icon: <i.MarkerVerticalMd />,
        accessibleLabel: "Vertical marker",
        tooltip: <Text>Vertical marker</Text>,
        key: "marker-vertical",
        value: 5
    },
    {
        icon: <i.BucketMd />,
        accessibleLabel: "Flood fill",
        tooltip: <Text>Flood fill</Text>,
        key: "flood-fill",
        value: 6
    },
    {
        icon: <i.EraserMd />,
        accessibleLabel: "Eraser",
        tooltip: <Text>Eraser</Text>,
        key: "eraser",
        value: 7
    },
    {
        icon: <i.AreaEraserMd />,
        accessibleLabel: "Area eraser",
        tooltip: <Text>Area eraser</Text>,
        key: "flood-erase",
        value: 8
    },
]

const createTool = (index: number): Tool => {
    switch (index) {
        case 0: return boundedTools.line()
        case 1: return boundedTools.rectangle()
        case 2: return boundedTools.ellipse()
        case 3: return freehandTools.pencil()
        case 4: return freehandTools.markerPenHorizontal()
        case 5: return freehandTools.markerPenVertical()
        case 6: return floodTools.bucket()
        case 7: return freehandTools.eraser()
        case 8: return floodTools.eraser()
        default: return new NoopTool()
    }
}

export const Editor = () => {
    const hero = DB.useHero("Bob")
    const [toolIndex, setToolIndex] = React.useState(0)
    const tool = useMemo(() => createTool(toolIndex), [toolIndex])
    const handlePaint = useCallback((result: ToolResult | undefined) => {
        if (result && result.tag === "affects-bitmap") {
            const bmp = result.value
            hero?.incrementalPatch({ logo: bmp })
        }
    }, [hero])

    return (
        <div>
            <header><Title order={2}>{hero?.name}</Title></header>
            <Toolbar
                tools={tools}
                toolIndex={toolIndex}
                onChange={setToolIndex}
            />
            {hero
                ? (
                    <Center p="xl" bg="gray">
                        <div style={{ display: "grid" }}>
                            <BitmapView
                                bmp={hero.logo}
                                zoom={16}
                                style={{
                                    gridArea: "1 / 1",
                                    zIndex: 1,
                                    backgroundColor: "white"
                                }}
                            />
                            <ToolPreview
                                bmp={hero.logo}
                                tool={tool}
                                color="yellowgreen"
                                brushSize={4}
                                zoom={16}
                                onDone={handlePaint}
                                style={{
                                    gridArea: "1 / 1",
                                    zIndex: 2,
                                    mixBlendMode: "difference",
                                    opacity: 0.9
                                }}
                            />
                        </div>
                    </Center>
                )
                : null}
        </div>
    )
}