import { action, makeAutoObservable } from "mobx"
import React from "react"
import { ClipboardOps } from "../common"
import * as Data from "../data"
import { encodedBitmap } from "../data"
import * as DB from "../database"
import { BitmapImage } from "../drawing"
import { constants } from "./constants"

const compareStr = (a: string, b: string): number => (
    a.toLocaleLowerCase("en").localeCompare(b.toLocaleLowerCase("en"), "en")
)

export class HeroStore {
    constructor(db: DB.Database) {
        makeAutoObservable(this, {}, { autoBind: true, deep: true })
        this.db = db
        this.load()
    }

    private readonly db: DB.Database

    private currentName?: string
    private currentItem?: Data.HeroItem
    heroes: Array<Data.HeroItem> = []
    currentHero?: Data.Hero
    history: Array<Data.Hero> = []
    future: Array<Data.Hero> = []

    get canUndo(): boolean {
        return (this.currentHero ? this.history.length > 0 : false)
    }

    get canRedo(): boolean {
        return (this.currentHero ? this.future.length > 0 : false)
    }

    async selectHero(name?: string): Promise<void> {
        if (!name) {
            this.setCurrentHeroItem(undefined)
            return
        }
        this.currentName = name
        const hero = this.heroes.find(hero => hero.name === name)
        this.setCurrentHeroItem(hero)
    }

    updateLogo(bmp: BitmapImage) {
        if (this.currentHero) {
            this.history.push(this.currentHero)
            if (this.history.length > constants.maxHistory) this.history.shift()
            this.currentHero = {
                name: this.currentHero.name,
                logo: bmp,
                edited: true
            }
            // Purge future
            if (this.future.length > 0) this.future = []
        }
    }

    modifyLogo(f: (bmp: BitmapImage) => BitmapImage) {
        if (this.currentHero) this.updateLogo(f(this.currentHero.logo))
    }

    undoLogo() {
        if (!this.currentHero) return
        const previous = this.history.pop()
        if (previous) {
            this.future.push(this.currentHero)
            if (this.future.length > constants.maxHistory) this.future.shift()
            this.currentHero = previous
        }
    }

    redoLogo() {
        if (!this.currentHero) return
        const next = this.future.pop()
        if (next) {
            this.history.push(this.currentHero)
            if (this.history.length > constants.maxHistory) this.history.shift()
            this.currentHero = next
        }
    }

    async writeLogo() {
        const currentHero = this.currentHero
        const currentItem = this.currentItem
        if (!(currentHero && currentItem)) return

        currentItem.thumbnail = undefined
        currentItem.encodedLogo = currentHero.logo.toJSON()
        this.currentHero = {
            ...currentHero,
            edited: false,
        }

        // Update database
        await this.db.transaction("rw", this.db.heroes, this.db.history, async () => {
            const heroQuery = this.db.heroes.where("name").equals(currentItem.name)
            const hero = await heroQuery.first()
            if (!hero) {
                console.debug(`Hero ${currentItem.name}: Can't write logo, hero doesn't exist in database`)
                return
            }

            const historyItems = this.history.map(hist => ({
                heroName: hist.name,
                encodedLogo: hist.logo.toJSON()
            }))

            // Only keep the last edited hero's history
            await this.db.history.clear()
            await this.db.history.bulkAdd(historyItems)

            await this.db.heroes.where("name").equals(currentHero.name).modify(hero => {
                hero.encodedLogo = currentItem.encodedLogo
            })
        })
    }

    async createHero(name: string, logo: BitmapImage): Promise<string | undefined> {
        const encodedLogo = logo.toJSON()
        const hero = { name, encodedLogo }
        try {
            await this.db.heroes.add(hero)
            this.heroes.push(hero)
            this.heroes.sort((a, b) => compareStr(a.name, b.name))
            return undefined
        } catch (error) {
            console.error(error)
            return (
                error instanceof Error
                    ? `Can't add hero: ${error.message}`
                    : "Can't add hero: reason unknown"
            )
        }
    }

    load() {
        this.db.heroes.toArray().then(action("fetchHeroes", heroes => {
            this.heroes = heroes.sort((a, b) => compareStr(a.name, b.name))
            if (this.currentName !== undefined && this.currentItem?.name !== this.currentName) {
                this.selectHero(this.currentName)
            }
        }))
    }

    copy(clipboard: ClipboardOps) {
        if (!this.currentHero) return
        clipboard.copyImage(this.currentHero.logo)
    }

    paste(clipboard: ClipboardOps) {
        const image = clipboard.pasteImage()
        if (image && this.currentHero) {
            const logo = this.currentHero.logo
            const target = new BitmapImage(logo.width, logo.height)
            image.copy(target)
            this.updateLogo(target)
        }
    }

    private setCurrentHeroItem(heroItem?: Data.HeroItem) {
        this.currentItem = heroItem
        this.currentName = heroItem?.name
        if (heroItem) {
            this.db.history.where("heroName").equals(heroItem.name).toArray().then(action("fetchHistory", history => {
                this.history = history.map(hist => ({
                    name: hist.heroName,
                    logo: BitmapImage.fromJSON(hist.encodedLogo)!,
                    edited: true
                }))
            }))
            this.future = []
            this.currentHero = Data.heroItem.decode(heroItem)
        } else {
            this.currentHero = undefined
        }
    }

    static async getThumbnail(hero: Data.HeroItem): Promise<ImageBitmap> {
        if (hero.thumbnail) return hero.thumbnail
        const bmp = encodedBitmap.toBitmap(hero.encodedLogo)
        if (!bmp) throw new Error(`Hero ${hero.name}: Invalid logo image!`)
        const data = new ImageData(bmp.colorBuffer, bmp.width, bmp.height)
        const image = await createImageBitmap(data)
        hero.thumbnail = image
        return image
    }
}

export const heroStore = new HeroStore(DB.db)

export const HeroContext = React.createContext(heroStore)