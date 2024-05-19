import { ActionIcon, Divider, Stack } from "@mantine/core"
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
        <ToolGroup
            cols={2}
            items={toolItems}
            value={toolIndex}
            onChange={onChange}
        />
        <Divider orientation="horizontal" />
        <ActionGroup
            cols={2}
            items={transformItems}
        />
        <Divider orientation="horizontal" />
        <ActionIcon
            size="lg"
            variant="subtle"
            disabled={!hasUndo}
            onClick={onUndo}
        >
            <UndoMd />
        </ActionIcon>
    </Stack>
)
