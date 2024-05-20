import { ActionIcon, Divider, Group, Kbd, Stack, Tooltip } from "@mantine/core"
import { ActionGroup, ActionGroupItem, ToolGroup, ToolGroupItem } from "../../common/components"
import { UndoMd } from "../../icons"

interface Props {
    toolItems: Array<ToolGroupItem<number>>
    toolIndex: number
    transformItems: Array<ActionGroupItem>
    hasUndo: boolean
    onChange: (index: number) => void
    onUndo?: () => void
}

export const Toolbar = ({ toolItems, toolIndex, transformItems, hasUndo, onChange, onUndo }: Props): JSX.Element => (
    <Stack gap="sm" p={0}>
        <Divider orientation="horizontal" label="Tools" />
        <ToolGroup
            cols={2}
            items={toolItems}
            value={toolIndex}
            onChange={onChange}
            px="xs"
        />
        <Divider orientation="horizontal" label="Actions" />
        <ActionGroup
            cols={2}
            items={transformItems}
            px="xs"
        />
        <Divider orientation="horizontal" label="History" />
        <Group px="xs">
            <Tooltip label={<Group>Undo <Group gap={4}><Kbd>Ctrl/⌘</Kbd>+<Kbd>Z</Kbd></Group></Group>}>
                <ActionIcon
                    size="lg"
                    variant="subtle"
                    disabled={!hasUndo}
                    onClick={onUndo}
                >
                    <UndoMd />
                </ActionIcon>
            </Tooltip>
        </Group>
    </Stack>
)
