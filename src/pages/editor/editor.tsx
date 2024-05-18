import {
    ActionIcon,
    Center,
    ColorPicker,
    ColorSwatch,
    Divider,
    Group,
    Popover,
    PopoverDropdown,
    PopoverTarget,
    Slider,
    Space,
    Stack,
    Text,
    Title
} from "@mantine/core"
import React, { useCallback, useMemo } from "react"
import { clamp } from "../../common"
import * as DB from "../../database"
import * as i from "../../icons"
import { Bitmap } from "../../schema"
import { ToolOptions, ToolResult } from "../../tools"
import { BitmapView } from "./bitmap-view"
import { Checkerboard } from "./checkerboard"
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

    const setColor = (color: string) => setToolOptions(opt => ({
        brushSize: opt.brushSize,
        color,
    }))

    const setBrushSize = (brushSize: number) => setToolOptions(opt => ({
        color: opt.color,
        brushSize,
    }))

    const handleDarkBgClick = () => setDarkBg(bg => !bg)

    const handleCheckerClick = () => setCheckerVisible(visible => !visible)


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
                        <Popover position="right-start" withArrow shadow="md">
                            <PopoverTarget>
                                <ActionIcon size="lg" variant="outline">
                                    <ColorSwatch color={toolOptions.color} size={20} />
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
                        toolItems={editorTools}
                        transformItems={editorTransforms}
                        toolIndex={toolIndex}
                        onChange={setToolIndex}
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