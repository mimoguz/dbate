import { ActionIcon, Center, Group } from "@mantine/core"
import * as i from "../../icons"

export const Toolbar = (): JSX.Element => {
    return (
        <Center>
            <Group p="md" gap="xs">
                <ActionIcon variant="subtle"><i.AreaEraserMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.BucketMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.CheckerboardMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.ColorSchemeMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.EditMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.EllipseMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.EraserMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.EyeDropperMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.GearMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.InvertMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.LineMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.MarkerHorizontalMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.MarkerVerticalMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.MoveMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.PencilMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.PlusMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.RectangleMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.SwatchesMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.TrashMd /></ActionIcon>
                <ActionIcon variant="subtle"><i.UndoMd /></ActionIcon>
            </Group>
        </Center>
    )
}