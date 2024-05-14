import { Center } from "@mantine/core"
import { ToggleGroup, ToggleGroupItem } from "../../common/components"

interface Props {
    tools: Array<ToggleGroupItem<number>>
    toolIndex: number,
    onChange: (index: number) => void
}

export const Toolbar = ({ tools, toolIndex, onChange }: Props): JSX.Element => {

    return (
        <Center p="sm">
            <ToggleGroup
                items={tools}
                value={toolIndex}
                onChange={onChange}
            />
        </Center>
    )
}