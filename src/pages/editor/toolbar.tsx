import { ActionIcon, Divider, Group } from "@mantine/core"
import { ToggleGroup, ToggleGroupItem } from "../../common/components"
import * as i from "../../icons"

interface Props {
    tools: Array<ToggleGroupItem<number>>
    toolIndex: number,
    onChange: (index: number) => void
    onInvert?: () => void
    onFlipHorizontal?: () => void
    onFlipVertical?: () => void
    onRotateClockwise?: () => void
    onRotateCounterClockwise?: () => void
}

export const Toolbar = ({ tools, toolIndex, ...actions }: Props): JSX.Element => (
    <Group gap="md" p={0}>
        <ToggleGroup
            items={tools}
            value={toolIndex}
            onChange={actions.onChange}
        />
        <Divider orientation="vertical" />
        <Group gap="xs" p={0}>
            <ActionIcon onClick={actions.onInvert} variant="subtle" size="lg">
                <i.InvertMd />
            </ActionIcon>
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
        </Group>
    </Group>
)
