import { Group } from "@mantine/core"
import { HeroSelector } from "./hero-selector"
import { HeroActionGroup } from "./hero-action-group"

export const Header = (): JSX.Element => (
    <Group p="md" justify="space-between">
        <HeroSelector />
        <HeroActionGroup />
    </Group>
)