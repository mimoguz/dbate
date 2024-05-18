import { ActionIcon, Divider, SimpleGrid, Stack } from "@mantine/core"
import { ToolGroup, ToolGroupItem } from "../../common/components"
import * as i from "../../icons"

interface Props {
    tools: Array<ToolGroupItem<number>>
    toolIndex: number,
    onChange: (index: number) => void
    onInvert?: () => void
    onFlipHorizontal?: () => void
    onFlipVertical?: () => void
    onRotateClockwise?: () => void
    onRotateCounterClockwise?: () => void
}

export const Toolbar = ({ tools, toolIndex, ...actions }: Props): JSX.Element => (
    <Stack gap="sm" p={0}>
        <ToolGroup
            direction="column"
            items={tools}
            value={toolIndex}
            onChange={actions.onChange}
        />
        <Divider orientation="horizontal" />
        <SimpleGrid cols={2} style={{ width: "fit-content" }} spacing="6px" verticalSpacing="6px">
            <ActionIcon onClick={actions.onFlipHorizontal} variant="subtle" size="lg">
                <i.FlipHorizontalMd />
            </ActionIcon>
            <ActionIcon onClick={actions.onFlipVertical} variant="subtle" size="lg">
                <i.FlipVerticalMd />
            </ActionIcon>
            <ActionIcon onClick={actions.onRotateClockwise} variant="subtle" size="lg">
                <i.RotateClockwiseMd />
            </ActionIcon>
            <ActionIcon onClick={actions.onRotateCounterClockwise} variant="subtle" size="lg">
                <i.RotateCounterClockwiseMd />
            </ActionIcon>
            <ActionIcon onClick={actions.onInvert} variant="subtle" size="lg">
                <i.InvertMd />
            </ActionIcon>
        </SimpleGrid>
    </Stack>
)
