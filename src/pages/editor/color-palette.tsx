import { ActionIcon, Button, ColorPicker, ColorSwatch, Divider, Group, SimpleGrid, Stack } from "@mantine/core"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { PlusMd, TrashMd } from "../../icons"
import { DataContext, constants } from "../../stores"

export const ColorPalette = observer(() => {
    const store = React.useContext(DataContext)
    const [currentValue, setCurrentValue] = React.useState(store.color)

    useEffect(
        () => console.log("Quick:", store.quickColors.count),
        [store.quickColors]
    )

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
            <Group gap={6}>
                <ActionIcon
                    onClick={() => store.addSwatch(currentValue)}
                    size="lg"
                    disabled={store.swatches.length === constants.maxSwatches}>
                    <PlusMd />
                </ActionIcon>
                <ActionIcon
                    onClick={() => store.removeSwatch(currentValue)}
                    color="red"
                    size="lg"
                >
                    <TrashMd />
                </ActionIcon>
            </Group>
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
        </Stack>
    )
})