import pako from "pako";
import { Bitmap, Database, EncodedBitmap, Hero } from "../database/db";

const MAX_HISTORY = 8

export class DataStore {
    constructor(db: Database) {
        this.db = db
    }

    private readonly db: Database

    selectedHero?: Hero
    selectedLogo?: Bitmap
    selectedName?: string
    selectedHistory: Array<Bitmap> = []
    heroes: Array<Hero> = []

    async selectHero(name: string): Promise<void> {
        const hero = this.heroes.find(hero => hero.name === name)
        this.selectedHero = hero
        this.selectedLogo = hero ? DataStore.decodeBitmap(hero.encodedLogo) : undefined
        // Restore the history if the hero is the last edited one
        this.selectedHistory = (await this.db.history.where("heroName").equals(name).toArray())
            .map(it => DataStore.decodeBitmap(it.encodedLogo))
            .filter(it => it) as Array<Bitmap>
    }

    deselectHero() {
        this.selectedHero = undefined
        this.selectedLogo = undefined
        this.selectedName = undefined
        this.selectedHistory = []
    }

    updateSelectedLogo(bmp: Bitmap) {
        this.selectedLogo = bmp
    }

    async load(): Promise<void> {
        this.heroes = await this.db.heroes.toArray()
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

    async writeLogo() {
        const currentHero = this.selectedHero
        const currentLogo = this.selectedLogo
        if (!(currentHero && currentLogo)) return

        const db = this.db
        const history = this.selectedHistory.length > MAX_HISTORY
            ? this.selectedHistory.slice(0, MAX_HISTORY)
            : this.selectedHistory

        currentHero.thumbnail = undefined
        currentHero.encodedLogo = DataStore.encodeBitmap(currentLogo)

        // Update database
        await db.transaction("rw", this.db.heroes, this.db.history, async () => {
            const heroQuery = db.heroes.where("name").equals("name")
            const hero = await heroQuery.first()
            if (!hero) return

            const historyItems = history.map(hist => ({
                heroName: hero.name,
                encodedLogo: DataStore.encodeBitmap(hist)
            }))

            // Only keep the last edited hero's history
            await db.history.clear()
            await db.history.bulkAdd(historyItems)

            await db.heroes.where("name").equals(currentHero.name).modify(hero => {
                hero.encodedLogo = currentHero.encodedLogo
                hero.thumbnail = undefined
            })
        })
    }

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
            const inflated = pako.inflate(Buffer.from(json.data, "base64"))
            return ({
                width: json.width,
                height: json.height,
                colorBuffer: new Uint8ClampedArray(inflated)
            })
        } catch (error) {
            console.debug(error)
            return undefined
        }
    }
}