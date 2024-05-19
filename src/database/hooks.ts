import React from "react"
import { HeroDocument, EditorStateDocument } from "../schema"
import { Subscription } from "rxjs"
import * as DB from "./database"

export const useHero = (name: string): HeroDocument | undefined => {
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

export const useEditorState = (id: string): EditorStateDocument | undefined => {
    const [state, setEditorState] = React.useState<EditorStateDocument | undefined>(undefined)
    const [subscription, setSubscription] = React.useState<Subscription | undefined>(undefined)

    React.useEffect(
        () => {
            if (!subscription || state?.id !== id) {
                subscription?.unsubscribe()

                const fetch = async () => {
                    const db = await DB.get()
                    const sub = db.editorState
                        .findOne({ selector: { id: id } })
                        .$.subscribe(doc => {
                            if (!doc) throw new Error(`Can't find editor state ${id}`)
                            setEditorState(doc)
                        })
                    setSubscription(sub)
                }

                fetch()
            }
            return () => { subscription?.unsubscribe() }
        },
        [state, id, subscription]
    )

    return state
}