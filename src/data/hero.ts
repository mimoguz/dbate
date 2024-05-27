import { Bitmap } from "../drawing"
import { encodedBitmap } from "./encoded-bitmap"

export interface HeroItem {
    name: string
    encodedLogo: string
    thumbnail?: ImageBitmap
}

export interface Hero {
    name: string
    logo: Bitmap
    edited: boolean
}

export const heroItem = {
    decode: (heroItem: HeroItem): Hero => {
        const logo = encodedBitmap.toBitmap(heroItem.encodedLogo)
        if (!logo) throw new Error(`Hero ${heroItem.name}: invalid logo`)
        return ({
            name: heroItem.name,
            logo,
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