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
import React, { useCallback, useMemo } from "react"
import { clamp } from "../../common"
import * as DB from "../../database"
import * as i from "../../icons"
import { Bitmap } from "../../schema"
import { ToolOptions, ToolResult } from "../../tools"
import { BitmapView } from "./bitmap-view"
import { Checkerboard } from "./checkerboard"
import { ColorPalette } from "./color-palette"
import { createTool, editorTools } from "./editor-tools"
import { editorTransformItems } from "./editor-transforms"
import classes from "./editor.module.css"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"

const MAX_ZOOM = 32

export const Editor = () => {
    const hero = DB.useHero("Bob")
    const [toolIndex, setToolIndex] = React.useState(0)
    const [zoom, setZoom] = React.useState(16)
    const [toolOptions, setToolOptions] = React.useState<ToolOptions>({
        color: "#0000ff",
        brushSize: 3,
    })
    const [isDarkBg, setDarkBg] = React.useState(false)
    const [isCheckerVisible, setCheckerVisible] = React.useState(false)
    const [recentColors, setRecentColors] = React.useState<Array<string>>(["#0000ff"])
    const tool = useMemo(() => createTool(toolIndex), [toolIndex])

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
            setZoom(z => clamp(1, MAX_ZOOM, e.deltaY * -0.01 + z))
        }
    }

    const setColor = (color: string) => {
        setToolOptions(opt => ({ brushSize: opt.brushSize, color }))
        setRecentColors(cols => cols.indexOf(color) >= 0 ? cols : [color, ...cols.slice(0, 2)])
    }

    const setBrushSize = (brushSize: number) => setToolOptions(opt => ({
        color: opt.color,
        brushSize,
    }))

    const handleDarkBgClick = () => setDarkBg(bg => !bg)

    const handleCheckerClick = () => setCheckerVisible(visible => !visible)

    useHotkeys([
        ["1", () => setBrushSize(1)],
        ["2", () => setBrushSize(2)],
        ["3", () => setBrushSize(3)],
        ["4", () => setBrushSize(4)],
        ["5", () => setBrushSize(5)],
        ["6", () => setBrushSize(6)],
        ["7", () => setBrushSize(7)],
        ["8", () => setBrushSize(8)],
        ["9", () => setBrushSize(9)],
    ])

    useHotkeys(
        editorTools
            .filter(it => it.shortcut)
            .map((it, i) => [it.shortcut!.join("+"), () => setToolIndex(i)])
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
                    <Group gap="6px">
                        <Popover position="bottom-start" withArrow shadow="md">
                            <PopoverTarget>
                                <Tooltip label={<Group>Brush size <Group><Kbd>1,2,...9</Kbd></Group></Group>}>
                                    <ActionIcon size="lg" variant="outline">
                                        <Text size="sm" fw={600}>{toolOptions.brushSize}px</Text>
                                    </ActionIcon>
                                </Tooltip>
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
                        <Popover position="right-start" withArrow shadow="md">
                            <PopoverTarget>
                                <Tooltip label="Tool color">
                                    <ActionIcon size="lg" variant="outline">
                                        <ColorSwatch color={toolOptions.color} size={20} />
                                    </ActionIcon>
                                </Tooltip>
                            </PopoverTarget>
                            <PopoverDropdown>
                                <ColorPalette
                                    value={toolOptions.color}
                                    onChange={setColor}
                                />
                            </PopoverDropdown>
                        </Popover>
                    </Group>
                    <Divider orientation="horizontal" />
                    <Toolbar
                        toolItems={editorTools}
                        transformItems={editorTransforms}
                        toolIndex={toolIndex}
                        onChange={setToolIndex}
                    />
                    <Divider orientation="horizontal" />
                    <Stack align="center" gap="xs">
                        {recentColors.map(col => (
                            <ColorSwatch
                                color={col}
                                onClick={() => setColor(col)}
                                style={{ cursor: "pointer" }}
                            />
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
                                    backgroundColor: isDarkBg ? "black" : "white"
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
                                        visibility: isCheckerVisible ? "visible" : "collapse",
                                    }}
                                />
                            </div>
                        </Center>
                    )
                    : null}
            </main>
            <footer className={classes.editor__footer}>
                <Group p="6px" gap="md" justify="space-between">
                    <Group gap="6px">
                        <ActionIcon
                            variant={isDarkBg ? "filled" : "subtle"}
                            color={isDarkBg ? "green" : undefined}
                            onClick={handleDarkBgClick}
                        >
                            <i.ColorSchemeMd />
                        </ActionIcon>
                        <ActionIcon
                            variant={isCheckerVisible ? "filled" : "subtle"}
                            color={isCheckerVisible ? "green" : undefined}
                            onClick={handleCheckerClick}
                        >
                            <i.CheckerboardMd />
                        </ActionIcon>
                    </Group>
                    <Group>
                        <i.MagnifyingGlassSm />
                        <Slider
                            w={310}
                            min={1}
                            max={MAX_ZOOM}
                            value={Math.floor(zoom)}
                            onChange={setZoom}
                        />
                    </Group>
                    <Space w={100} />
                </Group>
            </footer>
        </div>
    )
}