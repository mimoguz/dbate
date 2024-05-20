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
import { ShortcutGroup, hotkey } from "../../common/components"
import { Transform } from "../../transforms"

const brushSizeTooltip = `1,2…${EditorStore.MAX_BRUSH_SIZE > 9 ? 0 : EditorStore.MAX_BRUSH_SIZE}`

export const Editor = observer(() => {
    const hero = DB.useHero("Bob")
    const state = DB.useEditorState("editor-state-0")
    const store = React.useContext(EditorContext)
    const tool = useMemo(() => createTool(store.toolIndex), [store.toolIndex])

    const handleToolResult = useCallback(
        (result: ToolResult | undefined) => {
            if (!result) return
            switch (result.tag) {
                case "affects-bitmap":
                    hero?.updateLogo(result.value)
                    break
                case "affects-options":
                    state?.setColor(result.value.color)
                    store.setBrushSize(result.value.brushSize)
                    break
            }
        },
        [hero, state, store]
    )

    const applyTransform = useCallback(
        (transform: Transform) => () => { if (hero) hero.updateLogo(transform(hero.logo as Bitmap)) },
        [hero]
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
        ["mod+1", () => state?.recentColors.at(0) && state?.setColor(state?.recentColors[0])],
        ["mod+2", () => state?.recentColors.at(1) && state?.setColor(state?.recentColors[1])],
        ["mod+3", () => state?.recentColors.at(2) && state?.setColor(state?.recentColors[2])],
        ["mod+4", () => state?.recentColors.at(3) && state?.setColor(state?.recentColors[3])],
        ["mod+Z", () => hero?.goBack()],
        ["D", () => state?.toggleDarkBackground()],
        ["O", () => state?.toggleCheckerboardOverlay()],
    ])

    useHotkeys(
        editorTools
            .filter(it => it.shortcut)
            .map(({ shortcut }, i) => [
                hotkey(shortcut!),
                () => store.setToolIndex(i)
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
                        <Stack gap="sm" px={6} py="xs">
                            <Divider orientation="horizontal" label="Brush" />
                            <Group gap={6} px="xs">
                                <Popover position="bottom-start" withArrow shadow="md">
                                    <PopoverTarget>
                                        <Tooltip label={<Group>Brush size <ShortcutGroup sKey={brushSizeTooltip} /></Group>}>
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
                                            value={store.brushSize ?? 1}
                                            onChange={store.setBrushSize}
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
                            <Toolbar
                                toolItems={editorTools}
                                transformItems={editorTransforms}
                                toolIndex={store.toolIndex}
                                onChange={store.setToolIndex}
                                hasUndo={(hero?.history?.length ?? 0) > 0}
                                onUndo={hero?.goBack}
                            />
                            <Divider orientation="horizontal" label="Quick colors" />
                            <Center>
                                <SimpleGrid cols={2} spacing={6} verticalSpacing={6}>
                                    {state.recentColors.map((color, index) => (
                                        <Tooltip
                                            label={(
                                                <Group>
                                                    Set color {color}
                                                    <ShortcutGroup mod="mod" sKey={index + 1} />
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
                                </SimpleGrid>
                            </Center>
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
                                            brushSize={store.brushSize}
                                            zoom={store.scale}
                                            onDone={handleToolResult}
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
                                <Tooltip label={<Group>Toggle dark background <ShortcutGroup sKey="D" /></Group>}>
                                    <ActionIcon
                                        variant={state.showDarkBackground ? "filled" : "subtle"}
                                        color={state.showDarkBackground ? "green" : undefined}
                                        onClick={state.toggleDarkBackground}
                                    >
                                        <i.ColorSchemeMd />
                                    </ActionIcon>
                                </Tooltip>
                                <Tooltip label={<Group>Toggle checkerboard overlay <ShortcutGroup sKey="O" /></Group>}>
                                    <ActionIcon
                                        variant={state.showCheckerboardOverlay ? "filled" : "subtle"}
                                        color={state.showCheckerboardOverlay ? "green" : undefined}
                                        onClick={state.toggleCheckerboardOverlay}
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