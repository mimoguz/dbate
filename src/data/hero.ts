import { Bitmap } from "../drawing"
import { encodedBitmap } from "./encoded-bitmap"
import { HistoryItem } from "./history-item"

export interface HeroItem {
    name: string
    encodedLogo: string
    thumbnail?: ImageBitmap
}

export interface Hero {
    name: string
    logo: Bitmap
    history: Array<Bitmap>
    edited: boolean
}

export const heroItem = {
    decode: (heroItem: HeroItem, historyItems: Array<HistoryItem> = []): Hero => {
        const logo = encodedBitmap.toBitmap(heroItem.encodedLogo)
        const history = historyItems.map(it => encodedBitmap.toBitmap(it.encodedLogo)).filter(it => it) as Array<Bitmap>
        if (!logo) throw new Error(`Hero ${heroItem.name}: invalid logo`)
        return ({
            name: heroItem.name,
            logo,
            history,
            edited: false
        })
    }
}

export const hero = {
    encode: (hero: Hero): HeroItem => ({
        name: hero.name,
        encodedLogo: encodedBitmap.fromBitmap(hero.logo)
    })
}