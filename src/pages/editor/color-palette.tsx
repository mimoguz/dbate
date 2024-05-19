import { ActionIcon, Button, ColorPicker, ColorSwatch, Divider, Group, SimpleGrid, Stack } from "@mantine/core"
import { observer } from "mobx-react-lite"
import React from "react"
import { EditorContext } from "../../stores"
import { PlusMd, TrashMd } from "../../icons"

export const ColorPalette = observer(() => {
    const store = React.useContext(EditorContext)
    const [currentValue, setCurrentValue] = React.useState(store.color)

    return (
        <Stack>
            <Group justify="space-between">
                <Group gap={0}>
                    <ColorSwatch color={store.color} radius="4px 0 0 4px" withShadow={false} size={35} />
                    <ColorSwatch color={currentValue} radius="0 4px 4px 0" withShadow={false} size={35} />
                </Group>
                <Button onClick={() => store.setColor(currentValue)}>Select</Button>
            </Group>
            <ColorPicker
                value={currentValue}
                onChange={setCurrentValue}
                format="hex"
            />
            <Divider label="Swatches" />
            <SimpleGrid cols={6} spacing={6} verticalSpacing={12}>
                {store.swatches.map(color => (
                    <ColorSwatch
                        key={color}
                        color={color}
                        onClick={() => setCurrentValue(color)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </SimpleGrid>
            <Group gap={6}>
                <ActionIcon onClick={() => store.addSwatch(currentValue)} color="green" size="lg"><PlusMd /></ActionIcon>
                <ActionIcon onClick={() => store.removeSwatch(currentValue)} color="red" size="lg"><TrashMd /></ActionIcon>
            </Group>
        </Stack>
    )
})