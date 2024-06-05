import { BitmapImage } from "../drawing"

export interface HeroItem {
    name: string
    encodedLogo: string
    thumbnail?: ImageBitmap
}

export interface Hero {
    name: string
    logo: BitmapImage
    edited: boolean
}

export const heroItem = {
    decode: (heroItem: HeroItem): Hero => {
        const logo = BitmapImage.fromJSON(heroItem.encodedLogo)
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
        encodedLogo: hero.logo.toJSON()
    })
}