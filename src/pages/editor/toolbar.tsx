import { Divider, Stack } from "@mantine/core"
import { ActionGroup, ActionGroupItem, ToolGroup, ToolGroupItem } from "../../common/components"

interface Props {
    toolItems: Array<ToolGroupItem<number>>
    toolIndex: number,
    transformItems: Array<ActionGroupItem>
    onChange: (index: number) => void
}

export const Toolbar = ({ toolItems, toolIndex, transformItems, onChange }: Props): JSX.Element => (
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
    </Stack>
)
