import { ActionIcon, Group, Kbd, MantineSpacing, SimpleGrid, StyleProp, Tooltip } from "@mantine/core"

export interface ToolGroupItem<T> {
    icon: JSX.Element
    accessibleLabel: string
    value: T
    key: React.Key
    shortcut?: Array<string>
}

interface Props<T> {
    cols: number,
    items: Array<ToolGroupItem<T>>,
    value: T,
    p?: StyleProp<MantineSpacing>
    px?: StyleProp<MantineSpacing>
    py?: StyleProp<MantineSpacing>
    onChange: (value: T) => void,
}

export const ToolGroup = <T,>({ cols, items, value, onChange, ...padding }: Props<T>): JSX.Element => {
    const handleClick = (itemValue: T) => () => onChange(itemValue)

    return (
        <SimpleGrid
            {...padding}
            cols={cols}
            style={{ width: "fit-content" }}
            spacing="6px" verticalSpacing="6px"
        >
            {items.map(({ icon, accessibleLabel, shortcut, value: itemValue, key }) => {
                const tooltip = shortcut
                    ? <Group>{accessibleLabel} {shortcut.map((s, i) => <Kbd key={i}>{s}</Kbd>)}</Group>
                    : accessibleLabel
                return (
                    <Tooltip label={tooltip} key={key}>
                        <ActionIcon
                            aria-label={accessibleLabel}
                            variant={itemValue === value ? "filled" : "subtle"}
                            color={itemValue === value ? "green" : undefined}
                            onClick={handleClick(itemValue)}
                            size="lg"
                        >
                            {icon}
                        </ActionIcon>
                    </Tooltip>
                )
            })}
        </SimpleGrid>
    )
} 