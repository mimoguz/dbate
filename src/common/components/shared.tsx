import { Group, Kbd } from "@mantine/core"
import { intersperse } from "../array"

export const getShortcut = (shortcut: Array<string>): JSX.Element => (
    <Group gap={4}>
        {[...intersperse(shortcut.map((it, idx) => <Kbd key={idx} style={{ textTransform: "capitalize" }}>{it}</Kbd>), "+")]}
    </Group>
)