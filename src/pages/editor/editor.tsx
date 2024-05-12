import { Center, Stack, Title } from "@mantine/core"
import React from "react"
import { HeroDocument } from "../../schema"
import * as DB from "../../database/database"
import { Subscription } from "rxjs"
import { ToolPreview } from "./tool-preview"
import { NoopTool } from "../../tools/noop-tool"

export const Editor = () => {
    const [hero, setHero] = React.useState<HeroDocument | undefined>(undefined)
    const [subscription, setSubscription] = React.useState<Subscription | undefined>(undefined)

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
                                tool={NoopTool}
                                color="black"
                                brushSize={3}
                                zoom={16}
                            />
                        </Stack>
                    </Center>
                )
                : null}
        </div>
    )
}