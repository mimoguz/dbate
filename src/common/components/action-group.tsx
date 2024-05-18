import { ActionIcon, SimpleGrid, Tooltip } from "@mantine/core"

export interface ActionGroupItem {
    accessibleLabel: string,
    icon: JSX.Element,
    key: React.Key
    tooltip?: JSX.Element,
    action: (key: React.Key) => void,
}

interface Props {
    cols: number,
    items: Array<ActionGroupItem>,
}

export const ActionGroup = ({ cols, items }: Props): JSX.Element => {
    return (
        <SimpleGrid cols={cols} style={{ width: "fit-content" }} spacing="6px" verticalSpacing="6px">
            {items.map(({ icon, accessibleLabel, tooltip, action, key }, index) => (
                <Tooltip label={tooltip ?? accessibleLabel} key={key ?? index}>
                    <ActionIcon
                        aria-label={accessibleLabel}
                        variant="subtle"
                        size="lg"
                        onClick={() => action(key)}
                    >
                        {icon}
                    </ActionIcon>
                </Tooltip>
            ))}
        </SimpleGrid>
    )
} 