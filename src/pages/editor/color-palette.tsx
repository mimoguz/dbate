import { ActionIcon, Button, ColorPicker, ColorSwatch, Divider, Group, Paper, SimpleGrid, Stack } from "@mantine/core"
import { observer } from "mobx-react-lite"
import React from "react"
import { PlusMd, TrashMd } from "../../icons"
import { EditorContext, constants } from "../../stores"

export const ColorPalette = observer(() => {
    const editorStore = React.useContext(EditorContext)
    const [currentValue, setCurrentValue] = React.useState(editorStore.color)

    return (
        <Stack>
            <Group justify="space-between">
                <Paper withBorder>
                    <Group gap={0}>
                        <ColorSwatch color={editorStore.color} radius="4px 0 0 4px" withShadow={false} size={35} />
                        <ColorSwatch color={currentValue} radius="0 4px 4px 0" withShadow={false} size={35} />
                    </Group>
                </Paper>
                <Button onClick={() => editorStore.setColor(currentValue)}>Select</Button>
            </Group>

            <ColorPicker
                value={currentValue}
                onChange={setCurrentValue}
                format="hex"
            />

            <Divider label="Swatches" />
            <Group gap={6}>
                <ActionIcon
                    onClick={() => editorStore.addSwatch(currentValue)}
                    size="lg"
                    disabled={editorStore.swatches.length === constants.maxSwatches
                        || editorStore.swatches.includes(currentValue)}>
                    <PlusMd />
                </ActionIcon>
                <ActionIcon
                    onClick={() => editorStore.removeSwatch(currentValue)}
                    color="red"
                    size="lg"
                    disabled={!editorStore.swatches.includes(currentValue)}
                >
                    <TrashMd />
                </ActionIcon>
            </Group>
            <SimpleGrid cols={6} spacing={12} verticalSpacing={12}>
                {editorStore.swatches.map(color => (
                    <ColorSwatch
                        key={color}
                        color={color}
                        onClick={() => setCurrentValue(color)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </SimpleGrid>
        </Stack>
    )
})