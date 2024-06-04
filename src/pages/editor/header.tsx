import { Drawer, Group, Select, Stack } from "@mantine/core"
import { HeroSelector } from "./hero-selector"
import { HeroActionGroup } from "./hero-action-group"
import { Action } from "../../common/components"
import { GearMd } from "../../icons"
import { useDisclosure } from "@mantine/hooks"
import { observer } from "mobx-react-lite"
import React from "react"
import { SettingsContext } from "../../stores"
import { Theme } from "../../stores/settings-store"

export const Header = observer((): JSX.Element => {
    const [opened, { open, close }] = useDisclosure(false)
    const settingsStore = React.useContext(SettingsContext)
    const handleThemeChange = React.useCallback(
        (value: string | null | undefined) => {
            if (value) settingsStore.setTheme(value as Theme)
        },
        [settingsStore]
    )

    return (
        <>
            <Group p="md" justify="space-between">
                <HeroSelector />
                <Group>
                    <HeroActionGroup />
                    <Action
                        icon={<GearMd />}
                        tooltip="Settings"
                        onAction={open}
                    />
                </Group>
            </Group>
            <Drawer opened={opened} onClose={close} position="right">
                <Stack p="lg">
                    <Select
                        label="Theme"
                        data={[
                            { value: "auto", label: "Auto" },
                            { value: "light", label: "Light" },
                            { value: "dark", label: "Dark" },
                        ]}
                        value={settingsStore.theme}
                        onChange={handleThemeChange}
                    />
                </Stack>
            </Drawer>
        </>
    )
})