import { Center, Text, Title } from "@mantine/core"
import React, { useCallback, useMemo } from "react"
import { clamp } from "../../common"
import { ToggleGroupItem } from "../../common/components"
import * as DB from "../../database"
import * as i from "../../icons"
import { ColorPickerTool, Tool, ToolOptions, ToolResult, boundedTools, floodTools, freehandTools } from "../../tools"
import { NoopTool } from "../../tools/noop-tool"
import { BitmapView } from "./bitmap-view"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"
import { Bitmap } from "../../schema"
import { filters } from "../../filters"

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
        {
            item: {
                icon: <i.EyeDropperMd />,
                accessibleLabel: "Color picker",
                key: "color-picker",
            },
            factory: () => new ColorPickerTool(),
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
    const [toolOptions, setToolOptions] = React.useState<ToolOptions>({
        color: "blue",
        brushSize: 3,
    })

    const handlePaint = useCallback((result: ToolResult | undefined) => {
        if (!result) return
        switch (result.tag) {
            case "affects-bitmap":
                hero?.incrementalPatch({ logo: result.value })
                break
            case "affects-options":
                setToolOptions(() => result.value)
                break
        }
    }, [hero])

    const handleWheel: React.WheelEventHandler = e => {
        if (e.shiftKey) {
            e.stopPropagation()
            setZoom(z => clamp(1, 32, e.deltaY * -0.01 + z))
        }
    }

    const handleFlipHorizontal = () => {
        hero?.incrementalModify(doc => {
            doc.logo = filters.flipHorizontal(doc.logo as Bitmap)
            return doc
        })
    }

    const handleFlipVertical = () => {
        hero?.incrementalModify(doc => {
            doc.logo = filters.flipVertical(doc.logo as Bitmap)
            return doc
        })
    }

    const handleInvert = () => {
        hero?.incrementalModify(doc => {
            doc.logo = filters.invert(doc.logo as Bitmap)
            return doc
        })
    }

    const handleRotateCW = () => {
        hero?.incrementalModify(doc => {
            doc.logo = filters.rotateClockwise(doc.logo as Bitmap)
            return doc
        })
    }

    const handleRotateCCW = () => {
        hero?.incrementalModify(doc => {
            doc.logo = filters.rotateCounterClockwise(doc.logo as Bitmap)
            return doc
        })
    }

    return (
        <div onWheel={handleWheel} style={{ height: "100vh" }}>
            <header><Title order={2}>{hero?.name}</Title></header>
            <Toolbar
                tools={toolItems}
                toolIndex={toolIndex}
                onChange={setToolIndex}
                onFlipHorizontal={handleFlipHorizontal}
                onFlipVertical={handleFlipVertical}
                onInvert={handleInvert}
                onRotateClockwise={handleRotateCW}
                onRotateCounterClockwise={handleRotateCCW}
            />
            {hero
                ? (
                    <Center p="xl" bg="gray">
                        <div style={{ display: "grid" }} >
                            <BitmapView
                                bmp={hero.logo as Bitmap}
                                zoom={Math.floor(zoom)}
                                style={{
                                    gridArea: "1 / 1",
                                    zIndex: 1,
                                    backgroundColor: "white"
                                }}
                            />
                            <ToolPreview
                                {...toolOptions}
                                bmp={hero.logo as Bitmap}
                                tool={tool}
                                zoom={Math.floor(zoom)}
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