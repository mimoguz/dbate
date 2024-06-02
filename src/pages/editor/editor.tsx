import {
    Center,
    Group,
    Slider,
    Space
} from "@mantine/core"
import { useHotkeys } from "@mantine/hooks"
import { observer } from "mobx-react-lite"
import React from "react"
import { KbdTip, ToggleAction, hotkey } from "../../common/components"
import * as i from "../../icons"
import { EditorContext, HeroContext, constants } from "../../stores"
import { ToolResult } from "../../tools"
import { Transform } from "../../transforms"
import { BitmapView } from "./bitmap-view"
import { Checkerboard } from "./checkerboard"
import { SideBar } from "./sidebar"
import { createTool, editorTools } from "./editor-tools"
import { editorTransformItems } from "./editor-transforms"
import classes from "./editor.module.css"
import { Header } from "./header"
import { ToolPreview } from "./tool-preview"
import { ClipboardContext } from "../../common"


export const Editor = observer(() => {
    const heroStore = React.useContext(HeroContext)
    const editorStore = React.useContext(EditorContext)
    const clipboard = React.useContext(ClipboardContext)
    const tool = React.useMemo(() => createTool(editorStore.toolId), [editorStore.toolId])

    React.useEffect(() => { heroStore.selectHero("bob") }, [heroStore])

    const handleToolResult = React.useCallback(
        (result: ToolResult | undefined) => {
            if (!result) return
            switch (result.tag) {
                case "affects-bitmap":
                    heroStore.updateLogo(result.value)
                    break
                case "affects-options":
                    editorStore.setColor(result.value.color)
                    editorStore.setBrushSize(result.value.brushSize)
                    break
            }
        },
        [heroStore, editorStore]
    )

    const handleWheel: React.WheelEventHandler = e => {
        if (e.shiftKey) {
            e.stopPropagation()
            editorStore.updateZoom(e.deltaY * -0.01)
        }
    }

    useHotkeys([
        ["1", () => editorStore.setBrushSize(1)],
        ["2", () => editorStore.setBrushSize(2)],
        ["3", () => editorStore.setBrushSize(3)],
        ["4", () => editorStore.setBrushSize(4)],
        ["5", () => editorStore.setBrushSize(5)],
        ["6", () => editorStore.setBrushSize(6)],
        ["7", () => editorStore.setBrushSize(7)],
        ["8", () => editorStore.setBrushSize(8)],
        ["9", () => editorStore.setBrushSize(9)],
        ["0", () => editorStore.setBrushSize(10)],
        ["mod+1", () => editorStore.setColor("transparent")],
        ["mod+2", () => editorStore.quickColors.at(2) && editorStore.setColor(editorStore.quickColors[2])],
        ["mod+3", () => editorStore.quickColors.at(1) && editorStore.setColor(editorStore.quickColors[1])],
        ["mod+4", () => editorStore.quickColors.at(0) && editorStore.setColor(editorStore.quickColors[0])],
        ["mod+Z", () => heroStore.undoLogo()],
        ["mod+Y", () => heroStore.redoLogo()],
        ["mod+C", () => heroStore.copy(clipboard)],
        ["mod+V", () => heroStore.paste(clipboard)],
        ["D", () => editorStore.toggleCanvasBackground()],
        ["O", () => editorStore.toggleGridOverlay()],
    ])

    useHotkeys(
        editorTools
            .filter(it => it.shortcut)
            .map(({ shortcut }, i) => [
                hotkey(shortcut!),
                () => editorStore.setToolId(i)
            ])
    )

    const applyTransform = React.useCallback(
        (transform: Transform) => () => heroStore.modifyLogo(transform),
        [heroStore]
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
                <SideBar />
            </div>
            <main className={classes.editor__main}>
                {heroStore.currentHero?.logo
                    ? (
                        <Center p="xl" h="100%">
                            <div
                                style={{
                                    display: "grid",
                                    backgroundColor: editorStore.canvasBackground === "dark" ? "black" : "white"
                                }}
                                className={classes.editor__canvas__stack}
                            >
                                <Checkerboard
                                    width={heroStore.currentHero.logo.width}
                                    height={heroStore.currentHero.logo.height}
                                    zoom={editorStore.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 1,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                    }}
                                />
                                <BitmapView
                                    bmp={heroStore.currentHero.logo}
                                    zoom={editorStore.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 2,
                                    }}
                                />
                                <ToolPreview
                                    bmp={heroStore.currentHero.logo}
                                    tool={tool}
                                    color={editorStore.color}
                                    brushSize={editorStore.brushSize}
                                    zoom={editorStore.scale}
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
                                    zoom={editorStore.scale}
                                    style={{
                                        gridArea: "1 / 1",
                                        zIndex: 4,
                                        opacity: 0.1,
                                        pointerEvents: "none",
                                        visibility: editorStore.gridOverlay,
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
                        <ToggleAction
                            icon={<i.ColorSchemeMd />}
                            selected={editorStore.isDarkBackground}
                            onChange={editorStore.toggleCanvasBackground}
                            tooltip={<KbdTip label="Toggle dark background" sKey="D" />}
                        />
                        <ToggleAction
                            icon={<i.CheckerboardMd />}
                            selected={editorStore.isGridVisible}
                            onChange={editorStore.toggleGridOverlay}
                            tooltip={<KbdTip label="Toggle grid overlay" sKey="O" />}
                        />
                    </Group>
                    <Group>
                        <i.MagnifyingGlassSm />
                        <Slider
                            w={310}
                            min={1}
                            max={constants.maxZoom}
                            value={editorStore.scale}
                            onChange={editorStore.setZoom}
                        />
                    </Group>
                    <Space w={100} />
                </Group>
            </footer>
        </div>
    )
})