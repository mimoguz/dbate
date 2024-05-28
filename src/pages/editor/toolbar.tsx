import { ActionIcon, Divider, Group, Stack, Tooltip } from "@mantine/core"
import { ActionGroup, ActionGroupItem, ShortcutGroup, ToolGroup, ToolGroupItem } from "../../common/components"
import { RedoMd, UndoMd } from "../../icons"

interface Props {
    toolItems: Array<ToolGroupItem<number>>
    toolIndex: number
    transformItems: Array<ActionGroupItem>
    hasUndo: boolean
    hasRedo: boolean
    onChange: (index: number) => void
    onUndo?: () => void
    onRedo?: () => void
}

export const Toolbar = ({ toolItems, toolIndex, transformItems, hasUndo, hasRedo, onChange, onUndo, onRedo }: Props): JSX.Element => (
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
        <Group px="xs" gap={6}>
            <Tooltip label={<Group>Undo <ShortcutGroup mod="mod" sKey="Z" /></Group>}>
                <ActionIcon
                    size="lg"
                    variant="subtle"
                    disabled={!hasUndo}
                    onClick={onUndo}
                >
                    <UndoMd />
                </ActionIcon>
            </Tooltip>
            <Tooltip label={<Group>Redo <ShortcutGroup mod="mod" sKey="Y" /></Group>}>
                <ActionIcon
                    size="lg"
                    variant="subtle"
                    disabled={!hasRedo}
                    onClick={onRedo}
                >
                    <RedoMd />
                </ActionIcon>
            </Tooltip>
        </Group>
    </Stack>
)
