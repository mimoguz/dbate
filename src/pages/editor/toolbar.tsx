import { Center, Text } from "@mantine/core"
import React from "react"
import { ToggleGroup, ToggleGroupItem } from "../../common/components"
import * as i from "../../icons"

const tools: Array<ToggleGroupItem<number>> = [
    {
        icon: <i.LineMd />,
        accessibleLabel: "Draw line",
        tooltip: <Text>Draw line</Text>,
        key: "line",
        value: 0
    },
    {
        icon: <i.RectangleMd />,
        accessibleLabel: "Draw rectangle",
        tooltip: <Text>Draw rectangle</Text>,
        key: "rectangle",
        value: 1
    },
    {
        icon: <i.EllipseMd />,
        accessibleLabel: "Draw ellipse",
        tooltip: <Text>Draw ellipse</Text>,
        key: "ellipse",
        value: 2
    },
    {
        icon: <i.PencilMd />,
        accessibleLabel: "Pencil",
        tooltip: <Text>Pencil</Text>,
        key: "pencil",
        value: 3
    },
    {
        icon: <i.MarkerHorizontalMd />,
        accessibleLabel: "Horizontal marker",
        tooltip: <Text>Horizontal marker</Text>,
        key: "marker-horizontal",
        value: 4
    },
    {
        icon: <i.MarkerVerticalMd />,
        accessibleLabel: "Vertical marker",
        tooltip: <Text>Vertical marker</Text>,
        key: "marker-vertical",
        value: 5
    },
    {
        icon: <i.EraserMd />,
        accessibleLabel: "Eraser",
        tooltip: <Text>Eraser</Text>,
        key: "eraser",
        value: 6
    },
    {
        icon: <i.AreaEraserMd />,
        accessibleLabel: "Area eraser",
        tooltip: <Text>Area eraser</Text>,
        key: "area-eraser",
        value: 7
    },
    {
        icon: <i.MoveMd />,
        accessibleLabel: "Move",
        tooltip: <Text>Move</Text>,
        key: "move",
        value: 8
    },
]

export const Toolbar = (): JSX.Element => {
    const [toolIndex, setToolIndex] = React.useState(0)

    return (
        <Center p="sm">
            <ToggleGroup
                items={tools}
                value={toolIndex}
                onChange={setToolIndex}
            />
        </Center>
    )
}