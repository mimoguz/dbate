import { Center, Stack, Title } from "@mantine/core"
import React, { useMemo } from "react"
import { Subscription } from "rxjs"
import * as DB from "../../database/database"
import { HeroDocument } from "../../schema"
import { freehandTools } from "../../tools"
import { ToolPreview } from "./tool-preview"

export const Editor = () => {
    const [hero, setHero] = React.useState<HeroDocument | undefined>(undefined)
    const [subscription, setSubscription] = React.useState<Subscription | undefined>(undefined)
    const tool = useMemo(() => freehandTools.markerPenVertical(), [])

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