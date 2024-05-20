import { Group, Kbd } from "@mantine/core"
import { Shortcut } from "./shortcut"

export const ShortcutGroup = ({ mod, shift, sKey }: Shortcut) => (
    (mod || shift)
        ? (
            <Group gap={4}>
                {mod ? <><Kbd style={{ textTransform: "capitalize" }}>{mod === "mod" ? "Ctrl/⌘" : mod}</Kbd>+</> : null}
                {shift ? <><Kbd>Shift</Kbd>+</> : null}
                <Kbd style={{ textTransform: "capitalize" }}>{sKey}</Kbd>
            </Group>
        )
        : <Kbd style={{ textTransform: "capitalize" }}>{sKey}</Kbd>
)


