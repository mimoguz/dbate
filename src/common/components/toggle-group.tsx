import { ActionIcon, Flex, StyleProp, Tooltip } from "@mantine/core"

export interface ToggleGroupItem<T> {
    icon: JSX.Element,
    accessibleLabel: string,
    tooltip: JSX.Element
    value: T,
    key?: React.Key
}

interface Props<T> {
    items: Array<ToggleGroupItem<T>>,
    value: T,
    onChange: (value: T) => void,
    direction?: StyleProp<"row" | "column">
}

export const ToggleGroup = <T,>({ items, value, onChange, direction }: Props<T>): JSX.Element => {
    const handleClick = (itemValue: T) => () => onChange(itemValue)

    return (
        <Flex gap="xs" direction={direction ?? "row"} wrap="wrap">
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
        </Flex>
    )
} 