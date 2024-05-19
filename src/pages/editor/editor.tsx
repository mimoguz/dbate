import {
    ActionIcon,
    Center,
    ColorSwatch,
    Divider,
    Group,
    Kbd,
    Popover,
    PopoverDropdown,
    PopoverTarget,
    Slider,
    Space,
    Stack,
    Text,
    Title,
    Tooltip
} from "@mantine/core"
import { useHotkeys } from "@mantine/hooks"
import { observer } from "mobx-react-lite"
import React, { useCallback, useMemo } from "react"
import * as DB from "../../database"
import * as i from "../../icons"
import { Bitmap } from "../../schema"
import { EditorContext, EditorStore } from "../../stores"
import { ToolResult } from "../../tools"
import { BitmapView } from "./bitmap-view"
import { Checkerboard } from "./checkerboard"
import { ColorPalette } from "./color-palette"
import { createTool, editorTools } from "./editor-tools"
import { editorTransformItems } from "./editor-transforms"
import classes from "./editor.module.css"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"

const brushSizeTooltip = `1,2…${EditorStore.MAX_BRUSH_SIZE > 9 ? 0 : EditorStore.MAX_BRUSH_SIZE}`

export const Editor = observer(() => {
    const hero = DB.useHero("Bob")
    const store = React.useContext(EditorContext)
    const tool = useMemo(() => createTool(store.toolIndex), [store.toolIndex])

    const handlePaint = useCallback((result: ToolResult | undefined) => {
        if (!result) return
        switch (result.tag) {
            case "affects-bitmap":
                hero?.incrementalPatch({ logo: result.value })
                break
            case "affects-options":
                store.setColor(result.value.color)
                store.setBrushSize(result.value.brushSize)
                break
        }
    }, [hero, store])

    const editorTransforms = React.useMemo(
        () => editorTransformItems.map(({ item, transformAction }) => ({
            ...item,
            action: hero?.logo
                ? () => hero?.incrementalModify(doc => {
                    doc.logo = transformAction(hero.logo as Bitmap)
                    return doc
                })
                : () => { }
        })),
        [hero]
    )

    const handleWheel: React.WheelEventHandler = e => {
        if (e.shiftKey) {
            e.stopPropagation()
            store.changeZoom(e.deltaY * -0.01)
        }
    }

    useHotkeys([
        ["1", () => store.setBrushSize(1)],
        ["2", () => store.setBrushSize(2)],
        ["3", () => store.setBrushSize(3)],
        ["4", () => store.setBrushSize(4)],
        ["5", () => store.setBrushSize(5)],
        ["6", () => store.setBrushSize(6)],
        ["7", () => store.setBrushSize(7)],
        ["8", () => store.setBrushSize(8)],
        ["9", () => store.setBrushSize(9)],
        ["0", () => store.setBrushSize(10)],
        ["mod+1", () => store.recentColors.at(0) && store.setColor(store.recentColors[0])],
        ["mod+2", () => store.recentColors.at(1) && store.setColor(store.recentColors[1])],
        ["mod+3", () => store.recentColors.at(2) && store.setColor(store.recentColors[2])],
        ["mod+4", () => store.recentColors.at(3) && store.setColor(store.recentColors[3])],
    ])

    useHotkeys(
        editorTools
            .filter(it => it.shortcut)
            .map((it, i) => [it.shortcut!.join("+"), () => store.setToolIndex(i)])
    )

    return (
        <div onWheel={handleWheel} className={classes.editor}>
            <header className={classes.editor__header}>
                <Center p="md">
                    <Title order={2}>{hero?.name}</Title>
                </Center>
            </header>
            <div className={classes.editor__sidebar}>
                <Stack gap="sm" px="xs" py="sm">
                    <Group gap={6}>
                        <Popover position="bottom-start" withArrow shadow="md">
                            <PopoverTarget>
                                <Tooltip label={(<Group>Brush size <Kbd>{brushSizeTooltip}</Kbd></Group>)}>
                                    <ActionIcon size="lg" variant="outline">
                                        <Text size="sm" fw={600}>{store.brushSize}</Text><Text size="0.6667em">px</Text>
                                    </ActionIcon>
                                </Tooltip>
                            </PopoverTarget>
                            <PopoverDropdown>
                                <Slider
                                    w={160}
                                    min={1}
                                    max={EditorStore.MAX_BRUSH_SIZE}
                                    value={store.brushSize}
                                    onChange={store.setBrushSize}
                                />
                            </PopoverDropdown>
                        </Popover>
                        <Popover position="right-start" withArrow shadow="md">
                            <PopoverTarget>
                                <Tooltip label="Tool color">
                                    <ActionIcon size="lg" variant="outline">
                                        <ColorSwatch color={store.color} size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </PopoverTarget>
                            <PopoverDropdown>
                                <ColorPalette />
                            </PopoverDropdown>
                        </Popover>
                    </Group>
                    <Divider orientation="horizontal" />
                    <Toolbar
                        toolItems={editorTools}
                        transformItems={editorTransforms}
                        toolIndex={store.toolIndex}
                        onChange={store.setToolIndex}
                    />
                    <Divider orientation="horizontal" />
                    <Stack align="center" gap="xs">
                        {store.recentColors.map((col, index) => (
                            <Tooltip
                                label={(
                                    <Group>
                                        Set color {col}
                                        <Group gap={4}><Kbd>ctrl/⌘</Kbd>+<Kbd>{index + 1}</Kbd></Group>
                                    </Group>
                                )}
                            >
                                <ColorSwatch
                                    color={col}
                                    onClick={() => store.setColor(col)}
                                    style={{ cursor: "pointer" }}
                                />
                            </Tooltip>
                        ))}
                    </Stack>
                </Stack>
            </div>
            <main className={classes.editor__main}>
                {hero
                    ? (
                        <Center p="xl" h="100%">
                            <div
                                style={{
                                    display: "grid",
                                    backgroundColor: store.showDarkBackground ? "black" : "white"
                                }}
                                className={classes.editor__canvas__stack}
                            >
                                <Checkerboard
                                    width={hero.logo.width}
                                    height={hero.logo.height}
                                    zoom={store.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 1,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                    }}
                                />
                                <BitmapView
                                    bmp={hero.logo as Bitmap}
                                    zoom={store.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 2,
                                    }}
                                />
                                <ToolPreview
                                    bmp={hero.logo as Bitmap}
                                    tool={tool}
                                    color={store.color}
                                    brushSize={store.brushSize}
                                    zoom={store.scale}
                                    onDone={handlePaint}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 4,
                                        mixBlendMode: "difference",
                                        opacity: 0.7
                                    }}
                                />
                                <Checkerboard
                                    width={hero.logo.width}
                                    height={hero.logo.height}
                                    zoom={store.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 4,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                        visibility: store.showCheckerboardOverlay ? "visible" : "collapse",
                                    }}
                                />
                            </div>
                        </Center>
                    )
                    : null}
            </main>
            <footer className={classes.editor__footer}>
                <Group p={6} gap="md" justify="space-between">
                    <Group gap={6}>
                        <ActionIcon
                            variant={store.showDarkBackground ? "filled" : "subtle"}
                            color={store.showDarkBackground ? "green" : undefined}
                            onClick={store.toggleDarkBackground}
                        >
                            <i.ColorSchemeMd />
                        </ActionIcon>
                        <ActionIcon
                            variant={store.showCheckerboardOverlay ? "filled" : "subtle"}
                            color={store.showCheckerboardOverlay ? "green" : undefined}
                            onClick={store.toggleCheckerboardOverlay}
                        >
                            <i.CheckerboardMd />
                        </ActionIcon>
                    </Group>
                    <Group>
                        <i.MagnifyingGlassSm />
                        <Slider
                            w={310}
                            min={1}
                            max={EditorStore.MAX_ZOOM}
                            value={store.scale}
                            onChange={store.setZoom}
                        />
                    </Group>
                    <Space w={100} />
                </Group>
            </footer>
        </div>
    )
})