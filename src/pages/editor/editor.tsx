import { Center, Stack, Title, Text } from "@mantine/core"
import React, { useMemo } from "react"
import { Subscription } from "rxjs"
import * as DB from "../../database/database"
import { HeroDocument } from "../../schema"
import { Tool, boundedTools, floodTools, freehandTools } from "../../tools"
import { ToolPreview } from "./tool-preview"
import { Toolbar } from "./toolbar"
import * as i from "../../icons"
import { ToggleGroupItem } from "../../common/components"
import { NoopTool } from "../../tools/noop-tool"

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
        icon: <i.BucketMd />,
        accessibleLabel: "Flood fill",
        tooltip: <Text>Flood fill</Text>,
        key: "flood-fill",
        value: 6
    },
    {
        icon: <i.EraserMd />,
        accessibleLabel: "Eraser",
        tooltip: <Text>Eraser</Text>,
        key: "eraser",
        value: 7
    },
    {
        icon: <i.AreaEraserMd />,
        accessibleLabel: "Area eraser",
        tooltip: <Text>Area eraser</Text>,
        key: "flood-erase",
        value: 8
    },
]

const createTool = (index: number): Tool => {
    switch (index) {
        case 0: return boundedTools.line()
        case 1: return boundedTools.rectangle()
        case 2: return boundedTools.ellipse()
        case 3: return freehandTools.pencil()
        case 4: return freehandTools.markerPenHorizontal()
        case 5: return freehandTools.markerPenVertical()
        case 6: return floodTools.bucket()
        case 7: return freehandTools.eraser()
        case 8: return floodTools.eraser()
        default: return new NoopTool()
    }
}

export const Editor = () => {
    const [hero, setHero] = React.useState<HeroDocument | undefined>(undefined)
    const [subscription, setSubscription] = React.useState<Subscription | undefined>(undefined)
    const [toolIndex, setToolIndex] = React.useState(0)
    const tool = useMemo(() => createTool(toolIndex), [toolIndex])

    React.useEffect(
        () => {
            if (!subscription) {
                const fetch = async () => {
                    const db = await DB.get()
                    const sub = db.heroes
                        .findOne()
                        .$.subscribe(doc => setHero(doc ?? undefined))
                    setSubscription(sub)
                }

                fetch()
                console.log("Hero loaded")
            }

            return () => { subscription?.unsubscribe() }
        },
        [subscription]
    )

    return (
        <div>
            <header><Title order={2}>{hero?.name}</Title></header>
            <Toolbar
                tools={tools}
                toolIndex={toolIndex}
                onChange={setToolIndex}
            />
            {hero
                ? (
                    <Center p="xl" bg="gray">
                        <Stack p={0} bg="white">
                            <ToolPreview
                                bmp={hero.logo}
                                tool={tool}
                                color="black"
                                brushSize={4}
                                zoom={16}
                            />
                        </Stack>
                    </Center>
                )
                : null}
        </div>
    )
}