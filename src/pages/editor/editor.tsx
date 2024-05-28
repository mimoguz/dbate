import {
    ActionIcon,
    Center,
    ColorSwatch,
    Divider,
    Group,
    Popover,
    PopoverDropdown,
    PopoverTarget,
    SimpleGrid,
    Slider,
    Space,
    Stack,
    Text,
    Tooltip
} from "@mantine/core"
import { useHotkeys } from "@mantine/hooks"
import { observer } from "mobx-react-lite"
import React, { useCallback, useMemo } from "react"
import { ShortcutGroup, hotkey } from "../../common/components"
import * as i from "../../icons"
import { DataContext, EditorContext, HeroContext, constants } from "../../stores"
import { ToolResult } from "../../tools"
import { Transform } from "../../transforms"
import { BitmapView } from "./bitmap-view"
import { Checkerboard } from "./checkerboard"
import { ColorPalette } from "./color-palette"
import { createTool, editorTools } from "./editor-tools"
import { editorTransformItems } from "./editor-transforms"
import classes from "./editor.module.css"
import { Header } from "./header"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"
import { clamp } from "../../common"

const brushSizeTooltip = `1,2…${constants.maxBrushSize > 9 ? 0 : constants.maxBrushSize}`

export const Editor = observer(() => {
    const heroStore = React.useContext(HeroContext)
    const editorStore = React.useContext(EditorContext)
    const tool = useMemo(() => createTool(editorStore.state.toolId), [editorStore.state])

    React.useEffect(() => { heroStore.selectHero("bob") }, [heroStore])

    const handleToolResult = useCallback(
        (result: ToolResult | undefined) => {
            if (!result) return
            switch (result.tag) {
                case "affects-bitmap":
                    heroStore.updateLogo(result.value)
                    break
                case "affects-options":
                    editorStore.setEditorState(result.value)
                    break
            }
        },
        [heroStore, editorStore]
    )

    const handleBrushSizeChange = useCallback(
        (value: number) => editorStore.setEditorState({ brushSize: clamp(1, constants.maxBrushSize, value }),
        [editorStore]
    )

    const applyTransform = useCallback(
        (transform: Transform) => () => heroStore.modifyLogo(transform),
        [heroStore]
    )

    const editorTransforms = React.useMemo(
        () => editorTransformItems.map(({ item, transformAction }) => ({
            ...item,
            action: applyTransform(transformAction)
        })),
        [applyTransform]
    )

    const handleWheel: React.WheelEventHandler = e => {
        if (e.shiftKey) {
            e.stopPropagation()
            editorStore.changeZoom(e.deltaY * -0.01)
        }
    }

    useHotkeys([
        ["1", () => editorStore.setEditorState({ brushSize: 1 })],
        ["2", () => editorStore.setEditorState({ brushSize: 2 })],
        ["3", () => editorStore.setEditorState({ brushSize: 3 })],
        ["4", () => editorStore.setEditorState({ brushSize: 4 })],
        ["5", () => editorStore.setEditorState({ brushSize: 5 })],
        ["6", () => editorStore.setEditorState({ brushSize: 6 })],
        ["7", () => editorStore.setEditorState({ brushSize: 7 })],
        ["8", () => editorStore.setEditorState({ brushSize: 8 })],
        ["9", () => editorStore.setEditorState({ brushSize: 9 })],
        ["0", () => editorStore.setEditorState({ brushSize: 10 })],
        ["mod+1", () => editorStore.setEditorState({ color: "transparent" })],
        ["mod+2", () => editorStore.quickColors.at(2) && editorStore.setEditorState({ color: editorStore.quickColors[2] })],
        ["mod+3", () => editorStore.quickColors.at(1) && editorStore.setEditorState({ color: editorStore.quickColors[1] })],
        ["mod+4", () => editorStore.quickColors.at(0) && editorStore.setEditorState({ color: editorStore.quickColors[0] })],
        ["mod+Z", () => heroStore.undoLogo()],
        ["D", () => editorStore.toggleCanvasBackground()],
        ["O", () => editorStore.toggleGridOverlay()],
    ])

    useHotkeys(
        editorTools
            .filter(it => it.shortcut)
            .map(({ shortcut }, i) => [
                hotkey(shortcut!),
                () => editorStore.setEditorState({ toolId: i })
            ])
    )

    useHotkeys(
        editorTransformItems
            .filter(it => it.item.shortcut)
            .map(({ item: { shortcut }, transformAction }) => [
                hotkey(shortcut!),
                applyTransform(transformAction)
            ])
    )

    return (
        <div onWheel={handleWheel} className={classes.editor}>
            <header className={classes.editor__header}>
                <Header />
            </header>
            <div className={classes.editor__sidebar}>
                <Stack gap="sm" px={6} py="xs">
                    <Divider orientation="horizontal" label="Brush" />
                    <Group gap={6} px="xs">
                        <Popover position="bottom-start" withArrow shadow="md">
                            <PopoverTarget>
                                <Tooltip label={<Group>Brush size <ShortcutGroup sKey={brushSizeTooltip} /></Group>}>
                                    <ActionIcon size="lg" variant="outline">
                                        <Text size="sm" fw={600}>{editorStore.state.brushSize}</Text><Text size="0.6667em">px</Text>
                                    </ActionIcon>
                                </Tooltip>
                            </PopoverTarget>
                            <PopoverDropdown>
                                <Slider
                                    w={160}
                                    min={1}
                                    max={constants.maxBrushSize}
                                    value={editorStore.state.brushSize}
                                    onChange={handleBrushSizeChange}
                                />
                            </PopoverDropdown>
                        </Popover>
                        <Popover position="right-start" withArrow shadow="md">
                            <PopoverTarget>
                                <Tooltip label="Tool color">
                                    <ActionIcon size="lg" variant="outline">
                                        <ColorSwatch color={editorStore.state.color} size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </PopoverTarget>
                            <PopoverDropdown>
                                <ColorPalette />
                            </PopoverDropdown>
                        </Popover>
                    </Group>
                    <Toolbar
                        toolItems={editorTools}
                        transformItems={editorTransforms}
                        toolIndex={editorStore.state.toolId}
                        onChange={editorStore.state.setToolId}
                        hasUndo={editorStore.state.canUndo}
                        onUndo={editorStore.state.undoLogo}
                    />
                    <Divider orientation="horizontal" label="Quick colors" />
                    <Center>
                        <SimpleGrid cols={2} spacing={6} verticalSpacing={6}>
                            <Tooltip
                                label={(<Group> Set color transparent <ShortcutGroup mod="mod" sKey={1} /> </Group>)}
                            >
                                <ColorSwatch
                                    color={"transparent"}
                                    onClick={() => heroStore.setColor("transparent")}
                                    style={{ cursor: "pointer" }}
                                />
                            </Tooltip>
                            {heroStore.quickColors.map((color, index) => (
                                <Tooltip
                                    label={(<Group> Set color {color} <ShortcutGroup mod="mod" sKey={constants.maxQuickColors - index + 1} /> </Group>)}
                                    key={color}
                                >
                                    <ColorSwatch
                                        color={color}
                                        onClick={() => heroStore.setColor(color)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </Tooltip>
                            )).reverse()}
                        </SimpleGrid>
                    </Center>
                </Stack>
            </div>
            <main className={classes.editor__main}>
                {heroStore.currentHero?.logo
                    ? (
                        <Center p="xl" h="100%">
                            <div
                                style={{
                                    display: "grid",
                                    backgroundColor: heroStore.canvasBackground === "dark" ? "black" : "white"
                                }}
                                className={classes.editor__canvas__stack}
                            >
                                <Checkerboard
                                    width={heroStore.currentHero.logo.width}
                                    height={heroStore.currentHero.logo.height}
                                    zoom={heroStore.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 1,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                    }}
                                />
                                <BitmapView
                                    bmp={heroStore.currentHero.logo}
                                    zoom={heroStore.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 2,
                                    }}
                                />
                                <ToolPreview
                                    bmp={heroStore.currentHero.logo}
                                    tool={tool}
                                    color={heroStore.color}
                                    brushSize={heroStore.brushSize}
                                    zoom={heroStore.scale}
                                    onDone={handleToolResult}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 4,
                                        mixBlendMode: "difference",
                                        opacity: 0.7
                                    }}
                                />
                                <Checkerboard
                                    width={heroStore.currentHero.logo.width}
                                    height={heroStore.currentHero.logo.height}
                                    zoom={heroStore.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 4,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                        visibility: heroStore.gridOverlay,
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
                        <Tooltip label={<Group>Toggle dark background <ShortcutGroup sKey="D" /></Group>}>
                            <ActionIcon
                                variant={heroStore.canvasBackground === "dark" ? "filled" : "subtle"}
                                color={heroStore.canvasBackground === "dark" ? "green" : undefined}
                                onClick={heroStore.toggleCanvasBackground}
                            >
                                <i.ColorSchemeMd />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={<Group>Toggle checkerboard overlay <ShortcutGroup sKey="O" /></Group>}>
                            <ActionIcon
                                variant={heroStore.gridOverlay === "visible" ? "filled" : "subtle"}
                                color={heroStore.gridOverlay === "visible" ? "green" : undefined}
                                onClick={heroStore.toggleGridOverlay}
                            >
                                <i.CheckerboardMd />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    <Group>
                        <i.MagnifyingGlassSm />
                        <Slider
                            w={310}
                            min={1}
                            max={constants.maxZoom}
                            value={heroStore.scale}
                            onChange={heroStore.setZoom}
                        />
                    </Group>
                    <Space w={100} />
                </Group>
            </footer>
        </div>
    )
})