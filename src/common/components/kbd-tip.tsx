import { Group, Text } from "@mantine/core";
import { Shortcut } from "./shortcut";
import { KbdGroup } from "./kbd-group";

interface Props extends Shortcut {
    label: string
}

export const KbdTip = ({ label, ...shortcut }: Props): JSX.Element => {
    return (
        <Group>
            <Text>{label}</Text>
            <KbdGroup {...shortcut} />
        </Group>
    )
}