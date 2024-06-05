import { ActionIcon, Button, ColorInput, ColorSwatch, Group, Popover, Space, Stack, Table, Tooltip } from "@mantine/core"
import { observer } from "mobx-react-lite"
import React from "react"
import { Action } from "../../common/components"
import { toCSSValue } from "../../data"
import { EditMd, PlusMd } from "../../icons"
import { ColorsContext } from "../../stores"

export const Colors = observer((): JSX.Element => {
    const colorStore = React.useContext(ColorsContext)
    const [color, setColor] = React.useState("#000000FF")
    return (
        <Stack p="sm">
            <Group gap="sm">
                <ColorInput value={color} onChange={setColor} format="hexa" />
                <Action
                    icon={<PlusMd />}
                    tooltip="Add color"
                    onAction={() => colorStore.add(color)}
                    disabled={!colorStore.canAdd}
                />
            </Group>
            <Space h="sm" />
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Index</Table.Th>
                        <Table.Th>Value</Table.Th>
                        <Table.Th></Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {colorStore.colorTable.map((color) => {
                        const hex = toCSSValue(color)
                        return (
                            <Table.Tr key={color.index}>
                                <Table.Td>{color.index}</Table.Td>
                                <Table.Td>{hex}</Table.Td>
                                <Table.Td><ColorSwatch color={hex} /></Table.Td>
                                <Table.Td>
                                    <Popover withArrow>
                                        <Popover.Target>
                                            <Tooltip label="Edit color">
                                                <ActionIcon><EditMd /></ActionIcon>
                                            </Tooltip>
                                        </Popover.Target>
                                        <Popover.Dropdown>
                                            <ColorEditor value={hex} onSet={(v) => colorStore.update(color.index, v)} />
                                        </Popover.Dropdown>
                                    </Popover>
                                </Table.Td>
                            </Table.Tr>
                        )
                    })}
                </Table.Tbody>
            </Table>
        </Stack>
    )
})

const ColorEditor = ({ value, onSet }: { value: string, onSet: (v: string) => void }): JSX.Element => {
    const [color, setColor] = React.useState(value)
    return (
        <Group gap="sm">
            <ColorInput popoverProps={{ withinPortal: false }} format="hexa" value={color} onChange={setColor} />
            <Button onClick={() => onSet(color)}>Set</Button>
        </Group>
    )
} 