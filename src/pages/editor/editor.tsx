import { ActionIcon, Center, ColorPicker, ColorSwatch, Divider, Group, Popover, PopoverDropdown, PopoverTarget, Slider, Stack, Text, Title } from "@mantine/core"
import React, { useCallback, useMemo } from "react"
import { clamp } from "../../common"
import { ToolGroupItem } from "../../common/components"
import * as DB from "../../database"
import * as i from "../../icons"
import { Bitmap } from "../../schema"
import { ColorPickerTool, MoveTool, Tool, ToolOptions, ToolResult, boundedTools, floodTools, freehandTools } from "../../tools"
import { NoopTool } from "../../tools/noop-tool"
import { transforms } from "../../transforms"
import { BitmapView } from "./bitmap-view"
import { Checkerboard } from "./checkerboard"
import classes from "./editor.module.css"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"

const tools: Array<{
    item: Pick<ToolGroupItem<number>, "icon" | "accessibleLabel" | "key">,
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
                icon: <i.EyeDropperMd />,
                accessibleLabel: "Color picker",
                key: "color-picker",
            },
            factory: () => new ColorPickerTool(),
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
                icon: <i.MoveMd />,
                accessibleLabel: "Move",
                key: "move",
            },
            factory: () => new MoveTool(),
        },
    ]

const toolItems: Array<ToolGroupItem<number>> = tools.map((tool, index) => ({
    ...tool.item,
    value: index,
    tooltip: <Text>{tool.item.accessibleLabel}</Text>,
}))

const createTool = (index: number): Tool => (tools.at(index)?.factory ?? (() => new NoopTool()))()

export const Editor = () => {
    const hero = DB.useHero("Bob")
    const [toolIndex, setToolIndex] = React.useState(0)
    const tool = useMemo(() => createTool(toolIndex), [toolIndex])
    const [zoom, setZoom] = React.useState(16)
    const [toolOptions, setToolOptions] = React.useState<ToolOptions>({
        color: "#0000ff",
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
            doc.logo = transforms.flipHorizontal(doc.logo as Bitmap)
            return doc
        })
    }

    const handleFlipVertical = () => {
        hero?.incrementalModify(doc => {
            doc.logo = transforms.flipVertical(doc.logo as Bitmap)
            return doc
        })
    }

    const handleInvert = () => {
        hero?.incrementalModify(doc => {
            doc.logo = transforms.invert(doc.logo as Bitmap)
            return doc
        })
    }

    const handleRotateCW = () => {
        hero?.incrementalModify(doc => {
            doc.logo = transforms.rotateClockwise(doc.logo as Bitmap)
            return doc
        })
    }

    const handleRotateCCW = () => {
        hero?.incrementalModify(doc => {
            doc.logo = transforms.rotateCounterClockwise(doc.logo as Bitmap)
            return doc
        })
    }

    const setColor = (color: string) => setToolOptions(opt => ({
        brushSize: opt.brushSize,
        color,
    }))

    const setBrushSize = (brushSize: number) => setToolOptions(opt => ({
        color: opt.color,
        brushSize,
    }))

    return (
        <div onWheel={handleWheel} className={classes.editor}>
            <header className={classes.editor__header}>
                <Center p="md">
                    <Title order={2}>{hero?.name}</Title>
                </Center>
            </header>
            <div className={classes.editor__sidebar}>
                <Stack gap="sm" px="sm" py="md">
                    <Group gap="6px">
                        <Popover >
                            <PopoverTarget>
                                <ActionIcon size="lg" variant="outline">
                                    <Text size="sm" fw={600}>{toolOptions.brushSize}px</Text>
                                </ActionIcon>
                            </PopoverTarget>
                            <PopoverDropdown>
                                <Slider
                                    w={160}
                                    min={1}
                                    max={9}
                                    value={toolOptions.brushSize}
                                    onChange={setBrushSize}
                                />
                            </PopoverDropdown>
                        </Popover>
                        <Popover >
                            <PopoverTarget>
                                <ActionIcon size="lg" variant="outline">
                                    <ColorSwatch color={toolOptions.color} />
                                </ActionIcon>
                            </PopoverTarget>
                            <PopoverDropdown>
                                <ColorPicker
                                    value={toolOptions.color}
                                    onChange={setColor}
                                    format="hex"
                                    swatches={[
                                        '#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb',
                                        '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886',
                                        '#40c057', '#82c91e', '#fab005', '#00000000'
                                    ]}
                                />
                            </PopoverDropdown>
                        </Popover>
                    </Group>
                    <Divider orientation="horizontal" />
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
                </Stack>
            </div>
            <main className={classes.editor__main}>
                {hero
                    ? (
                        <Center p="xl" h="100%">
                            <div
                                style={{
                                    display: "grid",
                                    backgroundColor: "white"
                                }}
                                className={classes.editor__canvas__stack}
                            >
                                <Checkerboard
                                    width={hero.logo.width}
                                    height={hero.logo.height}
                                    zoom={Math.floor(zoom)}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 1,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                    }}
                                />
                                <BitmapView
                                    bmp={hero.logo as Bitmap}
                                    zoom={Math.floor(zoom)}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 2,
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
                                        zIndex: 3,
                                        mixBlendMode: "difference",
                                        opacity: 0.7
                                    }}
                                />
                                <Checkerboard
                                    width={hero.logo.width}
                                    height={hero.logo.height}
                                    zoom={Math.floor(zoom)}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 4,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                        visibility: "collapse",
                                    }}
                                />
                            </div>
                        </Center>
                    )
                    : null}
            </main>
            <footer className={classes.editor__footer}>
                ...
            </footer>
        </div>
    )
}