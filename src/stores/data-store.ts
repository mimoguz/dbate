import { makeAutoObservable } from "mobx"
import React from "react"
import { clamp } from "../common"
import * as Data from "../data"
import { encodedBitmap } from "../data"
import * as DB from "../database"
import { Bitmap } from "../drawing"
import { constants } from "./constants"

const compareStr = (a: string, b: string): number => (
    a.toLocaleLowerCase("en").localeCompare(b.toLocaleLowerCase("en"), "en")
)

// TODO: Consider splitting this class 
export class DataStore {
    constructor(db: DB.Database) {
        makeAutoObservable(this, {}, { autoBind: true, deep: true })
        this.db = db
        this.load().then(() => {
            if (this.currentName !== undefined && this.currentItem?.name !== this.currentName) {
                this.selectHero(this.currentName)
            }
        })
    }

    private readonly db: DB.Database

    // Hero properties
    private currentName?: string
    private currentItem?: Data.HeroItem
    heroes: Array<Data.HeroItem> = []
    currentHero?: Data.Hero
    history: Array<Data.Hero> = []

    // Color collections
    quickColors: Array<string> = []
    swatches: Array<string> = []

    // Editor state properties
    brushSize: number = 1
    canvasBackground: Data.CanvasBackground = "light"
    color: string = "#0000ff"
    gridOverlay: Data.GridOverlayVisibility = "hidden"
    toolId: number = 0
    editorStateTimeout: NodeJS.Timeout | undefined
    zoom: number = 1

    // Hero Methods

    async selectHero(name?: string): Promise<void> {
        if (!name) {
            this.setCurrentHeroItem(undefined)
            return
        }
        this.currentName = name
        const hero = this.heroes.find(hero => hero.name === name)
        this.setCurrentHeroItem(hero)
    }

    private async setCurrentHeroItem(heroItem?: Data.HeroItem) {
        this.currentItem = heroItem
        this.currentName = heroItem?.name
        if (heroItem) {
            // TODO: Error handling?
            this.history = (await this.db.history.where("heroName").equals(heroItem.name).toArray()).map(hist => ({
                name: hist.heroName,
                logo: encodedBitmap.toBitmap(hist.encodedLogo)!,
                edited: true
            }))
            this.currentHero = Data.heroItem.decode(heroItem)
        } else {
            this.currentHero = undefined
        }
    }

    updateLogo(bmp: Bitmap) {
        if (this.currentHero) {
            this.history.push(this.currentHero)
            if (this.history.length > constants.maxHistory) this.history.shift()
            this.currentHero = {
                name: this.currentHero.name,
                logo: bmp,
                edited: true
            }
        }
    }

    modifyLogo(f: (bmp: Bitmap) => Bitmap) {
        if (this.currentHero) this.updateLogo(f(this.currentHero.logo))
    }

    undoLogo() {
        if (!this.currentHero) return
        const previous = this.history.pop()
        if (previous) this.currentHero = previous
    }

    async writeLogo() {
        const currentHero = this.currentHero
        const currentItem = this.currentItem
        if (!(currentHero && currentItem)) return

        currentItem.thumbnail = undefined
        currentItem.encodedLogo = encodedBitmap.fromBitmap(currentHero.logo)
        this.currentHero = {
            ...currentHero,
            edited: false,
        }

        // Update database
        await this.db.transaction("rw", this.db.heroes, this.db.history, async () => {
            const heroQuery = this.db.heroes.where("name").equals(currentItem.name)
            const hero = await heroQuery.first()
            if (!hero) {
                console.debug(`Hero ${currentItem.name}: Can't update logo, hero doesn't exist`)
                return
            }

            const historyItems = this.history.map(hist => ({
                heroName: hist.name,
                encodedLogo: encodedBitmap.fromBitmap(hist.logo)
            }))

            // Only keep the last edited hero's history
            await this.db.history.clear()
            await this.db.history.bulkAdd(historyItems)

            await this.db.heroes.where("name").equals(currentHero.name).modify(hero => {
                hero.encodedLogo = currentItem.encodedLogo
            })
        })
    }

    async createHero(name: string, logo: Bitmap): Promise<string | undefined> {
        const encodedLogo = encodedBitmap.fromBitmap(logo)
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

    // Color collection methods

    async addSwatch(color: string) {
        const newColor = color.toLowerCase()
        if (
            newColor === "transparent"
            || newColor === "#00000000"
            || this.swatches.some(s => s === newColor)
            || this.swatches.length >= constants.maxSwatches
        ) return
        this.swatches.push(newColor)
        await this.db.swatches.add({ color: newColor })
    }

    async removeSwatch(color: string) {
        const colorToRemove = color.toLowerCase()
        const index = this.swatches.indexOf(colorToRemove)
        this.swatches.splice(index, 1)
        await this.db.swatches.where("color").equals(colorToRemove).delete()
    }

    async addQuickColor(color: string) {
        const newColor = color.toLowerCase()
        if (
            newColor === "transparent"
            || newColor === "#00000000"
            || this.quickColors.some(s => s === newColor)
        ) return
        this.quickColors.push(newColor)
        const droppedColor = this.quickColors.length > constants.maxQuickColors
            ? this.quickColors.shift()
            : undefined
        await this.db.transaction("rw", this.db.quickColors, async () => {
            if (droppedColor) await this.db.quickColors.where("color").equals(droppedColor.toLowerCase()).delete()
            await this.db.quickColors.add({ color: newColor })
        })
    }

    // Editor state methods

    get canUndo(): boolean {
        return (this.currentHero ? this.history.length > 0 : false)
    }

    get scale(): number {
        return Math.floor(this.zoom)
    }

    setColor(color: string) {
        if (color === this.color) return
        this.color = color
        this.addQuickColor(color)
        this.writeEditorStateDeferred()
    }

    setBrushSize(value: number) {
        const brushSize = clamp(1, constants.maxBrushSize, value)
        if (brushSize === this.brushSize) return
        this.brushSize = brushSize
        this.writeEditorStateDeferred()
    }

    setToolId(value: number) {
        if (value === this.toolId) return
        this.toolId = value
        this.writeEditorStateDeferred()
    }

    setZoom(value: number) {
        const zoom = clamp(1, constants.maxZoom, value)
        if (this.zoom === zoom) return
        this.zoom = zoom
        this.writeEditorStateDeferred()
    }

    changeZoom(delta: number) {
        this.setZoom(this.zoom + delta)
    }

    setCanvasBackground(value: Data.CanvasBackground) {
        if (value === this.canvasBackground) return
        this.canvasBackground = value
        this.writeEditorStateDeferred()
    }

    setGridOverlay(value: Data.GridOverlayVisibility) {
        if (value === this.gridOverlay) return
        this.gridOverlay = value
        this.writeEditorStateDeferred()
    }

    toggleCanvasBackground() {
        this.setCanvasBackground(this.canvasBackground === "light" ? "dark" : "light")
    }

    toggleGridOverlay() {
        this.setGridOverlay(this.gridOverlay === "visible" ? "hidden" : "visible")
    }

    private writeEditorStateDeferred() {
        if (this.editorStateTimeout) clearTimeout(this.editorStateTimeout)
        this.editorStateTimeout = setTimeout(async () => { await this.writeEditorState() }, 1000)
    }

    private async writeEditorState() {
        await this.db.editorState.put({
            id: 0,
            color: this.color,
            brushSize: this.brushSize,
            zoom: this.zoom,
            toolId: this.toolId,
            canvasBackground: this.canvasBackground,
            gridOverlay: this.gridOverlay,
        })
    }

    // General

    async load(): Promise<void> {
        this.heroes = (await this.db.heroes.toArray()).sort((a, b) => compareStr(a.name, b.name))
        this.swatches = (await this.db.swatches.toArray()).map(it => it.color).slice(0, constants.maxSwatches)
        this.quickColors = (await this.db.quickColors.toArray()).map(it => it.color)
        const state = await this.db.editorState.where("id").equals(0).first()
        if (state) {
            this.color = state.color
            this.brushSize = state.brushSize
            this.toolId = state.toolId
            this.zoom = state.zoom
            this.canvasBackground = state.canvasBackground
            this.gridOverlay = state.gridOverlay
        }
    }

    // Helpers

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

export const dataStore = new DataStore(DB.db)

export const DataContext = React.createContext(dataStore)