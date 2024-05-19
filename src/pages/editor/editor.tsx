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

const brushSizeTooltip = `1,2…${DB.MAX_BRUSH_SIZE > 9 ? 0 : DB.MAX_BRUSH_SIZE}`

export const Editor = observer(() => {
    const hero = DB.useHero("Bob")
    const state = DB.useEditorState("editor-state-0")
    const store = React.useContext(EditorContext)
    const tool = useMemo(() => createTool(store.toolIndex), [store.toolIndex])

    const handlePaint = useCallback((result: ToolResult | undefined) => {
        if (!result) return
        switch (result.tag) {
            case "affects-bitmap":
                hero?.incrementalPatch({ logo: result.value })
                break
            case "affects-options":
                state?.setColor(result.value.color)
                state?.setBrushSize(result.value.brushSize)
                break
        }
    }, [hero, state])

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
        ["1", () => state?.setBrushSize(1)],
        ["2", () => state?.setBrushSize(2)],
        ["3", () => state?.setBrushSize(3)],
        ["4", () => state?.setBrushSize(4)],
        ["5", () => state?.setBrushSize(5)],
        ["6", () => state?.setBrushSize(6)],
        ["7", () => state?.setBrushSize(7)],
        ["8", () => state?.setBrushSize(8)],
        ["9", () => state?.setBrushSize(9)],
        ["0", () => state?.setBrushSize(10)],
        ["mod+1", () => state?.recentColors.at(0) && state?.setColor(state?.recentColors[0])],
        ["mod+2", () => state?.recentColors.at(1) && state?.setColor(state?.recentColors[1])],
        ["mod+3", () => state?.recentColors.at(2) && state?.setColor(state?.recentColors[2])],
        ["mod+4", () => state?.recentColors.at(3) && state?.setColor(state?.recentColors[3])],
    ])

    useHotkeys(
        editorTools
            .filter(it => it.shortcut)
            .map((it, i) => [it.shortcut!.join("+"), () => store.setToolIndex(i)])
    )

    return (
        !state
            ? <div>Error: Couldn't find editor state!</div>
            : (
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
                                                <Text size="sm" fw={600}>{state.brushSize}</Text><Text size="0.6667em">px</Text>
                                            </ActionIcon>
                                        </Tooltip>
                                    </PopoverTarget>
                                    <PopoverDropdown>
                                        <Slider
                                            w={160}
                                            min={1}
                                            max={DB.MAX_BRUSH_SIZE}
                                            value={state.brushSize ?? 1}
                                            onChange={state.setBrushSize}
                                        />
                                    </PopoverDropdown>
                                </Popover>
                                <Popover position="right-start" withArrow shadow="md">
                                    <PopoverTarget>
                                        <Tooltip label="Tool color">
                                            <ActionIcon size="lg" variant="outline">
                                                <ColorSwatch color={state.color ?? "transparent"} size={20} />
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
                                {state.recentColors.map((color, index) => (
                                    <Tooltip
                                        label={(
                                            <Group>
                                                Set color {color}
                                                <Group gap={4}><Kbd>ctrl/⌘</Kbd>+<Kbd>{index + 1}</Kbd></Group>
                                            </Group>
                                        )}
                                        key={color}
                                    >
                                        <ColorSwatch
                                            color={color}
                                            onClick={() => state.setColor(color)}
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
                                            backgroundColor: state.showDarkBackground ? "black" : "white"
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
                                            color={state.color}
                                            brushSize={state.brushSize}
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
                                                visibility: state.showCheckerboardOverlay ? "visible" : "collapse",
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
                                    variant={state.showDarkBackground ? "filled" : "subtle"}
                                    color={state.showDarkBackground ? "green" : undefined}
                                    onClick={state.toggleDarkBackground}
                                >
                                    <i.ColorSchemeMd />
                                </ActionIcon>
                                <ActionIcon
                                    variant={state.showCheckerboardOverlay ? "filled" : "subtle"}
                                    color={state.showCheckerboardOverlay ? "green" : undefined}
                                    onClick={state.toggleCheckerboardOverlay}
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
    )
})