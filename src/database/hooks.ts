import React from "react"
import { HeroDocument } from "../schema"
import { Subscription } from "rxjs"
import * as DB from "./database"

export const useHero = (name: string) => {
    const [hero, setHero] = React.useState<HeroDocument | undefined>(undefined)
    const [subscription, setSubscription] = React.useState<Subscription | undefined>(undefined)

    React.useEffect(
        () => {
            if (!subscription || hero?.name !== name) {
                subscription?.unsubscribe()

                const fetch = async () => {
                    const db = await DB.get()
                    const sub = db.heroes
                        .findOne({ selector: { name: name } })
                        .$.subscribe(doc => setHero(doc ?? undefined))
                    setSubscription(sub)
                }

                fetch()
            }
            return () => { subscription?.unsubscribe() }
        },
        [hero, name, subscription]
    )

    return hero
}