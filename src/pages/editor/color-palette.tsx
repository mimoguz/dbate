import { Button, ColorPicker, ColorSwatch, Group, Stack } from "@mantine/core"
import React from "react"

interface Props {
    value: string,
    onChange: (newValue: string) => void
}

export const ColorPalette = ({ value, onChange }: Props) => {
    const [currentValue, setCurrentValue] = React.useState(value)

    return (
        <Stack>
            <Group justify="space-between">
                <Group gap={0}>
                    <ColorSwatch color={value} radius="6px 0 0 6px" withShadow={false} size={35} />
                    <ColorSwatch color={currentValue} radius="0 6px 6px 0" withShadow={false} size={35} />
                </Group>
                <Button onClick={() => onChange(currentValue)}>Select</Button>
            </Group>
            <ColorPicker
                value={currentValue}
                onChange={setCurrentValue}
                format="hex"
            />
        </Stack>
    )
}