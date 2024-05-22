import pako from "pako";
import { Bitmap, Database, EncodedBitmap, Hero } from "../database/db";

const MAX_HISTORY = 64

export class DataStore {
    constructor(db: Database) {
        this.db = db
    }

    selectedHero?: Hero
    selectedLogo?: Bitmap
    selectedName?: string
    heroes: Array<Hero> = []
    currentHistory: Array<Bitmap> = []

    async load(): Promise<void> {
        this.heroes = await this.db.heroes.toArray()
    }

    // TODO: load history
    selectHero(this: DataStore, name: string): Hero | undefined {
        const hero = this.heroes.find(hero => hero.name === name)
        this.selectedHero = hero
        this.selectedLogo = hero ? DataStore.decodeBitmap(hero.encodedLogo) : undefined
        return hero
    }

    async createHero(name: string, logo: Bitmap): Promise<string | undefined> {
        const encodedLogo = DataStore.encodeBitmap(logo)
        try {
            await this.db.heroes.add({ name, encodedLogo })
            return undefined
        } catch (error) {
            console.error(error)
            return (
                error instanceof Error
                    ? `Can' add hero: ${error.message}`
                    : "Can't add hero: reason unknown"
            )
        }
    }

    async writeLogo(bmp: Bitmap) {
        const currentHero = this.selectedHero
        const history = this.currentHistory
        const db = this.db
        if (currentHero) {
            currentHero.thumbnail = undefined
            await db.transaction("rw", this.db.heroes, this.db.history, async () => {
                const heroQuery = db.heroes.where("name").equals("name")

                // If hero doesn't exists, clear any traces of its history and return
                const hero = await heroQuery.first()
                if (!hero) {
                    await db.history.where("heroName").equals(currentHero.name).delete()
                    return
                }

                // Limit history size
                const historySize = await db.history.count()
                if ((historySize + history.length) > MAX_HISTORY) {
                    const toDelete = await db.history.limit((historySize + history.length) - MAX_HISTORY).sortBy("id")
                    await db.history.bulkDelete(toDelete)
                }

                const historyItems = history.map(bmp => ({
                    heroName: hero.name,
                    encodedLogo: DataStore.encodeBitmap(bmp)
                }))

                await db.history.bulkAdd(historyItems)
                await db.heroes.where("name").equals(currentHero.name).modify(hero => {
                    hero.encodedLogo = DataStore.encodeBitmap(bmp)
                    hero.thumbnail = undefined
                })
            })
        }
    }

    private readonly db: Database

    static async getThumbnail(hero: Hero): Promise<ImageBitmap> {
        if (hero.thumbnail) return hero.thumbnail
        const bmp = DataStore.decodeBitmap(hero.encodedLogo)
        if (!bmp) throw new Error(`Hero ${hero.name}: Invalid logo image!`)
        const data = new ImageData(bmp.colorBuffer, bmp.width, bmp.height)
        const image = await createImageBitmap(data)
        hero.thumbnail = image
        return image
    }

    private static encodeBitmap(bmp: Bitmap): string {
        const base64 = Buffer.from(pako.deflate(bmp.colorBuffer)).toString("base64")
        return JSON.stringify({
            width: bmp.width,
            height: bmp.height,
            data: base64
        })
    }

    private static decodeBitmap(source: string): Bitmap | undefined {
        try {
            const json: EncodedBitmap = JSON.parse(source)
            const colorBuffer = new Uint8ClampedArray(Buffer.from(json.data, "base64"))
            return ({
                width: json.width,
                height: json.height,
                colorBuffer
            })
        } catch (error) {
            console.debug(error)
            return undefined
        }
    }
}