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
    Stack,
    Text,
    Tooltip,
} from "@mantine/core"
import { observer } from "mobx-react-lite"
import React from "react"
import { ClipboardContext } from "../../common"
import { Action, KbdTip, ToggleAction } from "../../common/components"
import * as i from "../../icons"
import { EditorContext, HeroContext, constants } from "../../stores"
import { Transform } from "../../transforms"
import { ColorPalette } from "./color-palette"
import { editorTools } from "./editor-tools"
import { editorTransformItems } from "./editor-transforms"


const brushSizeKbd = `1,2…${constants.maxBrushSize > 9 ? 0 : constants.maxBrushSize}`

const group = { gap: 6, px: "xs" }

const grid = {
    spacing: 6,
    verticalSpacing: 6,
    cols: 2,
    style: { width: "fit-content" },
    px: "xs"
}

export const SideBar = observer((): JSX.Element => {
    const editorStore = React.useContext(EditorContext)
    const heroStore = React.useContext(HeroContext)
    const clipboard = React.useContext(ClipboardContext)

    const applyTransform = React.useCallback(
        (transform: Transform) => () => heroStore.modifyLogo(transform),
        [heroStore]
    )

    const transforms = React.useMemo(
        () => editorTransformItems.map(({ item, transformAction }) => ({
            ...item,
            action: applyTransform(transformAction)
        })),
        [applyTransform]
    )

    const handleCopy = React.useCallback(() => heroStore.copy(clipboard), [heroStore, clipboard])
    const handlePaste = React.useCallback(() => heroStore.paste(clipboard), [heroStore, clipboard])

    return (
        <Stack gap="sm" px={6} py="xs">
            <Divider orientation="horizontal" label="Brush" />
            <Center>
                <Group {...group}>
                    <Popover position="bottom-start" withArrow shadow="md">
                        <PopoverTarget>
                            <Tooltip label={<KbdTip label="Brush size" sKey={brushSizeKbd} />}>
                                <ActionIcon size="lg" variant="outline">
                                    <Text size="sm" fw={600}>{editorStore.brushSize}</Text><Text size="0.6667em">px</Text>
                                </ActionIcon>
                            </Tooltip>
                        </PopoverTarget>
                        <PopoverDropdown>
                            <Slider
                                w={160}
                                min={1}
                                max={constants.maxBrushSize}
                                value={editorStore.brushSize}
                                onChange={editorStore.setBrushSize}
                            />
                        </PopoverDropdown>
                    </Popover>
                    <Popover position="right-start" withArrow shadow="md">
                        <PopoverTarget>
                            <Tooltip label="Tool color">
                                <ActionIcon size="lg" variant="outline">
                                    <ColorSwatch color={editorStore.color} size={20} />
                                </ActionIcon>
                            </Tooltip>
                        </PopoverTarget>
                        <PopoverDropdown>
                            <ColorPalette />
                        </PopoverDropdown>
                    </Popover>
                </Group>
            </Center>
            <Divider orientation="horizontal" label="Tools" />
            <Center>
                <SimpleGrid {...grid}>
                    {editorTools.map((tool, index) => (
                        <ToggleAction
                            key={tool.key}
                            tooltip={tool.shortcut ? <KbdTip label={tool.accessibleLabel} {...tool.shortcut} /> : tool.accessibleLabel}
                            selected={editorStore.toolId === index}
                            onChange={v => { if (v) { editorStore.setToolId(index) } }}
                            icon={tool.icon}
                        />
                    ))}
                </SimpleGrid>
            </Center>
            <Divider orientation="horizontal" label="Transforms" />
            <Center>
                <SimpleGrid {...grid}>
                    {transforms.map(({ icon, accessibleLabel, shortcut, action, key }) => {
                        return (
                            <Action
                                key={key}
                                onAction={action}
                                icon={icon}
                                tooltip={shortcut ? <KbdTip label={accessibleLabel} {...shortcut} /> : accessibleLabel}
                            />
                        )
                    })}
                </SimpleGrid>
            </Center>
            <Divider orientation="horizontal" label="Actions" />
            <Center>
                <SimpleGrid {...grid}>
                    <Action
                        disabled={!heroStore.canUndo}
                        onAction={heroStore.undoLogo}
                        tooltip={<KbdTip label="Undo" sKey="Z" mod="mod" />}
                        icon={<i.UndoMd />}
                    />
                    <Action
                        disabled={!heroStore.canRedo}
                        onAction={heroStore.redoLogo}
                        tooltip={<KbdTip label="Undo" sKey="Y" mod="mod" />}
                        icon={<i.RedoMd />}
                    />
                    <Action
                        onAction={handleCopy}
                        tooltip={<KbdTip label="Copy" sKey="C" mod="mod" />}
                        icon={<i.CopyMd />}
                    />
                    <Action
                        disabled={!clipboard.hasImage}
                        onAction={handlePaste}
                        tooltip={<KbdTip label="Paste" sKey="V" mod="mod" />}
                        icon={<i.PasteMd />}
                    />
                </SimpleGrid>
            </Center>
            <Divider orientation="horizontal" label="Quick colors" />
            <Center>
                <SimpleGrid cols={2} spacing={12} verticalSpacing={6}>
                    <Tooltip label={<KbdTip label="Set color transparent" mod="mod" sKey={1} />} id="transparent">
                        <ColorSwatch
                            color={"transparent"}
                            onClick={() => editorStore.setColor("transparent")}
                            style={{ cursor: "pointer" }}
                            aria-labelledby="transparent"
                        />
                    </Tooltip>
                    {editorStore.quickColors.map((color, index) => {
                        const id = `tip${index}`
                        return (
                            <Tooltip
                                label={<KbdTip label={`Set color ${color}`} mod="mod" sKey={constants.maxQuickColors - index + 1} />}
                                id={id}
                                key={color}
                            >
                                <ColorSwatch
                                    color={color}
                                    onClick={() => editorStore.setColor(color)}
                                    style={{ cursor: "pointer" }}
                                    aria-labelledby={id}
                                />
                            </Tooltip>
                        )
                    }).reverse()}
                </SimpleGrid>
            </Center>
        </Stack>
    )
})
