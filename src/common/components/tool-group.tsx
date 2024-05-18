import { ActionIcon, SimpleGrid, StyleProp, Tooltip } from "@mantine/core"

export interface ToolGroupItem<T> {
    icon: JSX.Element,
    accessibleLabel: string,
    tooltip: JSX.Element
    value: T,
    key?: React.Key
}

interface Props<T> {
    items: Array<ToolGroupItem<T>>,
    value: T,
    onChange: (value: T) => void,
    direction?: StyleProp<"row" | "column">
}

export const ToolGroup = <T,>({ items, value, onChange, direction }: Props<T>): JSX.Element => {
    const handleClick = (itemValue: T) => () => onChange(itemValue)
    const cols = direction === "column" ? 2 : Math.ceil(items.length / 2)

    return (
        <SimpleGrid cols={cols} style={{ width: "fit-content" }} spacing="6px" verticalSpacing="6px">
            {items.map(({ icon, accessibleLabel, tooltip, value: itemValue, key }, index) => (
                <Tooltip label={tooltip} key={key ?? index}>
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
            ))}
        </SimpleGrid>
    )
} 