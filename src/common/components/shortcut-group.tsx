import { Group, Kbd } from "@mantine/core"
import { Shortcut } from "./shortcut"

export const ShortcutGroup = ({ mod, shift, sKey }: Shortcut) => (
    (mod || shift)
        ? (
            <Group gap={4}>
                {mod ? <><Kbd style={{ textTransform: "capitalize" }} size="xs">{mod}</Kbd>+</> : null}
                {shift ? <><Kbd size="xs">Shift</Kbd>+</> : null}
                <Kbd style={{ textTransform: "capitalize" }} size="xs">{sKey}</Kbd>
            </Group>
        )
        : <Kbd style={{ textTransform: "capitalize" }} size="xs">{sKey}</Kbd>
)


