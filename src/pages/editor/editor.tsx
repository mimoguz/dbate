import {
    ActionIcon,
    Button,
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
import { bitmap } from "../../drawing"
import * as i from "../../icons"
import { DataContext, constants } from "../../stores"
import { ToolResult } from "../../tools"
import { Transform } from "../../transforms"
import { BitmapView } from "./bitmap-view"
import { Checkerboard } from "./checkerboard"
import { ColorPalette } from "./color-palette"
import { createTool, editorTools } from "./editor-tools"
import { editorTransformItems } from "./editor-transforms"
import classes from "./editor.module.css"
import { HeroSelector } from "./hero-selector"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"

const brushSizeTooltip = `1,2…${constants.maxBrushSize > 9 ? 0 : constants.maxBrushSize}`

export const Editor = observer(() => {
    const store = React.useContext(DataContext)
    const tool = useMemo(() => createTool(store.toolId), [store.toolId])

    React.useEffect(() => { store.selectHero("bob") }, [store])

    const handleChange = React.useCallback(
        (name: string | undefined) => {
            if (name) {
                store.selectHero(name)
            } else {
                store.deselectHero()
            }
        },
        [store])

    const download = React.useCallback(
        () => {
            const hero = store.currentHero
            if (!hero) return
            bitmap.dataURL(hero.logo).then(dataURL => {
                const elem = document.createElement("a")
                elem.href = dataURL
                elem.download = `${hero.name}.png`
                document.body.appendChild(elem)
                elem.click()
                document.body.removeChild(elem)
            })

        },
        [store.currentHero]
    )

    const handleToolResult = useCallback(
        (result: ToolResult | undefined) => {
            if (!result) return
            switch (result.tag) {
                case "affects-bitmap":
                    store.updateLogo(result.value)
                    break
                case "affects-options":
                    store.setColor(result.value.color)
                    store.setBrushSize(result.value.brushSize)
                    break
            }
        },
        [store]
    )

    const applyTransform = useCallback(
        (transform: Transform) => () => store.modifyLogo(transform),
        [store]
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
        ["mod+1", () => store.setColor("transparent")],
        ["mod+2", () => store.quickColors.at(2) && store.setColor(store.quickColors.at(2)!)],
        ["mod+3", () => store.quickColors.at(1) && store.setColor(store.quickColors.at(1)!)],
        ["mod+4", () => store.quickColors.at(0) && store.setColor(store.quickColors.at(0)!)],
        ["mod+Z", () => store.undoLogo()],
        ["D", () => store.toggleCanvasBackground()],
        ["O", () => store.toggleGridOverlay()],
    ])

    useHotkeys(
        editorTools
            .filter(it => it.shortcut)
            .map(({ shortcut }, i) => [
                hotkey(shortcut!),
                () => store.setToolId(i)
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

                <Group p="md" justify="space-between">
                    <HeroSelector
                        value={store.currentHero?.name}
                        onChange={handleChange}
                    />
                    <Group>
                        <Button
                            onClick={() => store.writeLogo()}
                            disabled={store.currentHero === undefined || !store.currentHero.edited}
                        >
                            Apply changes
                        </Button>
                        <Button disabled={store.currentHero === undefined} onClick={download}>Download logo</Button>
                    </Group>
                </Group>
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
                                    max={constants.maxBrushSize}
                                    value={store.brushSize ?? 1}
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
                    <Toolbar
                        toolItems={editorTools}
                        transformItems={editorTransforms}
                        toolIndex={store.toolId}
                        onChange={store.setToolId}
                        hasUndo={store.canUndo}
                        onUndo={store.undoLogo}
                    />
                    <Divider orientation="horizontal" label="Quick colors" />
                    <Center>
                        <SimpleGrid cols={2} spacing={6} verticalSpacing={6}>
                            <Tooltip
                                label={(<Group> Set color transparent <ShortcutGroup mod="mod" sKey={1} /> </Group>)}
                            >
                                <ColorSwatch
                                    color={"transparent"}
                                    onClick={() => store.setColor("transparent")}
                                    style={{ cursor: "pointer" }}
                                />
                            </Tooltip>
                            {store.quickColors.map((color, index) => (
                                <Tooltip
                                    label={(<Group> Set color {color} <ShortcutGroup mod="mod" sKey={constants.maxColors - index + 1} /> </Group>)}
                                    key={color}
                                >
                                    <ColorSwatch
                                        color={color}
                                        onClick={() => store.setColor(color)}
                                        style={{ cursor: "pointer" }}
                                    />
                                </Tooltip>
                            )).reverse()}
                        </SimpleGrid>
                    </Center>
                </Stack>
            </div>
            <main className={classes.editor__main}>
                {store.currentHero?.logo
                    ? (
                        <Center p="xl" h="100%">
                            <div
                                style={{
                                    display: "grid",
                                    backgroundColor: store.canvasBackground === "dark" ? "black" : "white"
                                }}
                                className={classes.editor__canvas__stack}
                            >
                                <Checkerboard
                                    width={store.currentHero.logo.width}
                                    height={store.currentHero.logo.height}
                                    zoom={store.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 1,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                    }}
                                />
                                <BitmapView
                                    bmp={store.currentHero.logo}
                                    zoom={store.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 2,
                                    }}
                                />
                                <ToolPreview
                                    bmp={store.currentHero.logo}
                                    tool={tool}
                                    color={store.color}
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
                                    width={store.currentHero.logo.width}
                                    height={store.currentHero.logo.height}
                                    zoom={store.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 4,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                        visibility: store.gridOverlay,
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
                                variant={store.canvasBackground === "dark" ? "filled" : "subtle"}
                                color={store.canvasBackground === "dark" ? "green" : undefined}
                                onClick={store.toggleCanvasBackground}
                            >
                                <i.ColorSchemeMd />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label={<Group>Toggle checkerboard overlay <ShortcutGroup sKey="O" /></Group>}>
                            <ActionIcon
                                variant={store.gridOverlay === "visible" ? "filled" : "subtle"}
                                color={store.gridOverlay === "visible" ? "green" : undefined}
                                onClick={store.toggleGridOverlay}
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