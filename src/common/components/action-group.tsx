import { ActionIcon, Group, MantineSpacing, SimpleGrid, StyleProp, Tooltip } from "@mantine/core"
import { getShortcut } from "./shared"

export interface ActionGroupItem {
    accessibleLabel: string
    icon: JSX.Element
    key: React.Key
    shortcut?: Array<string>
    action: (key: React.Key) => void
}

interface Props {
    cols: number
    items: Array<ActionGroupItem>
    p?: StyleProp<MantineSpacing>
    px?: StyleProp<MantineSpacing>
    py?: StyleProp<MantineSpacing>
}

export const ActionGroup = ({ cols, items, ...padding }: Props): JSX.Element => {
    return (
        <SimpleGrid
            {...padding}
            cols={cols}
            style={{ width: "fit-content" }}
            spacing={6}
            verticalSpacing={6}
        >
            {items.map(({ icon, accessibleLabel, shortcut, action, key }, index) => {
                const tooltip = shortcut
                    ? <Group>{accessibleLabel} {getShortcut(shortcut)}</Group>
                    : accessibleLabel
                return (
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
                )
            })}

        </SimpleGrid>
    )
}
