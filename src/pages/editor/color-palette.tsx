import { ActionIcon, Button, ColorPicker, ColorSwatch, Divider, Group, SimpleGrid, Stack } from "@mantine/core"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { PlusMd, TrashMd } from "../../icons"
import * as DB from "../../database"

export const ColorPalette = observer(() => {
    const state = DB.useEditorState("editor-state-0")
    const [currentValue, setCurrentValue] = React.useState(state?.color ?? "transparent")

    useEffect(() => setCurrentValue(state?.color ?? "transparent"), [state?.color])

    return (
        <Stack>
            <Group justify="space-between">
                <Group gap={0}>
                    <ColorSwatch color={state?.color ?? "transparent"} radius="4px 0 0 4px" withShadow={false} size={35} />
                    <ColorSwatch color={currentValue} radius="0 4px 4px 0" withShadow={false} size={35} />
                </Group>
                <Button onClick={() => state?.setColor(currentValue)}>Select</Button>
            </Group>
            <ColorPicker
                value={currentValue}
                onChange={setCurrentValue}
                format="hex"
            />
            <Divider label="Swatches" />
            <Group gap={6}>
                <ActionIcon onClick={() => state?.addSwatch(currentValue)} size="lg"><PlusMd /></ActionIcon>
                <ActionIcon onClick={() => state?.removeSwatch(currentValue)} color="red" size="lg"><TrashMd /></ActionIcon>
            </Group>
            <SimpleGrid cols={6} spacing={6} verticalSpacing={12}>
                {state?.swatches.map(color => (
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