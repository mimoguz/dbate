import { ActionIcon, Center, Divider, Group, Stack, Tooltip } from "@mantine/core"
import { ActionGroup, ActionGroupItem, ShortcutGroup, ToolGroup, ToolGroupItem } from "../../common/components"
import { CopyMd, PasteMd, RedoMd, UndoMd } from "../../icons"

interface Props {
    toolItems: Array<ToolGroupItem<number>>
    toolIndex: number
    transformItems: Array<ActionGroupItem>
    hasUndo: boolean
    hasRedo: boolean
    onChange: (index: number) => void
    onUndo?: () => void
    onRedo?: () => void
    onCopy?: () => void
    onPaste?: () => void
}

// TODO: Toolbar can use editor store
export const Toolbar = ({ toolItems, toolIndex, transformItems, hasUndo, hasRedo, ...actions }: Props): JSX.Element => (
    <Stack gap="sm" p={0}>
        <Divider orientation="horizontal" label="Tools" />
        <ToolGroup
            cols={4}
            items={toolItems}
            value={toolIndex}
            onChange={actions.onChange}
            px="xs"
        />
        <Divider orientation="horizontal" label="Transforms" />
        <ActionGroup
            cols={4}
            items={transformItems}
            px="xs"
        />
        <Divider orientation="horizontal" label="Actions" />
        <Center>
            <Group px="xs" gap={6}>
                <Tooltip label={<Group>Undo <ShortcutGroup mod="mod" sKey="Z" /></Group>}>
                    <ActionIcon
                        size="lg"
                        variant="subtle"
                        disabled={!hasUndo}
                        onClick={actions.onUndo}
                    >
                        <UndoMd />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label={<Group>Redo <ShortcutGroup mod="mod" sKey="Y" /></Group>}>
                    <ActionIcon
                        size="lg"
                        variant="subtle"
                        disabled={!hasRedo}
                        onClick={actions.onRedo}
                    >
                        <RedoMd />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label={<Group>Copy <ShortcutGroup mod="mod" sKey="C" /></Group>}>
                    <ActionIcon
                        size="lg"
                        variant="subtle"
                        onClick={actions.onCopy}
                    >
                        <CopyMd />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label={<Group>Paste <ShortcutGroup mod="mod" sKey="V" /></Group>}>
                    <ActionIcon
                        size="lg"
                        variant="subtle"
                        onClick={actions.onPaste}
                    >
                        <PasteMd />
                    </ActionIcon>
                </Tooltip>
            </Group>
        </Center>
    </Stack>
)
