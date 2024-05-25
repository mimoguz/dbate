import { makeAutoObservable } from "mobx";
import pako from "pako";
import { SizedStack, clamp } from "../common";
import * as Data from "../database/db";

const MAX_HISTORY = 8
const MAX_SWATCHES = 16
const MAX_COLORS = 3
const MAX_BRUSH_SIZE = 10

const compareStr = (a: string, b: string): number => (
    a.toLocaleLowerCase("en").localeCompare(b.toLocaleLowerCase("en"), "en")
)

export class DataStore {
    constructor(db: Data.Database) {
        this.db = db
        makeAutoObservable(this, {}, { autoBind: true, deep: true })
        this.load()
    }

    private readonly db: Data.Database

    // Hero properties
    heroes: Array<Data.Hero> = []
    selectedHero?: Data.Hero
    selectedName?: string
    selectedLogo?: Data.Bitmap
    selectedHistory: SizedStack<Data.Bitmap> = new SizedStack(MAX_HISTORY)

    // Color collections
    quickColors: SizedStack<string> = new SizedStack(MAX_COLORS)
    swatches: SizedStack<string> = new SizedStack(MAX_SWATCHES)

    // Editor state properties
    brushSize: number = 1
    canvasBackground: Data.CanvasBackground = "light"
    color: string = "#0000ff"
    gridOverlay: Data.GridOverlayVisibility = "hidden"
    toolId: number = 0
    editorStateTimeout: NodeJS.Timeout | undefined

    // Hero Methods

    async selectHero(name: string): Promise<void> {
        const hero = this.heroes.find(hero => hero.name === name)
        this.selectedHero = hero
        this.selectedLogo = hero ? DataStore.decodeBitmap(hero.encodedLogo) : undefined
        // Restore the history if the hero is the last edited one
        this.selectedHistory = SizedStack.from<Data.Bitmap>(
            (await this.db.history.where("heroName").equals(name).toArray())
                .map(it => DataStore.decodeBitmap(it.encodedLogo))
                .filter(it => it) as Array<Data.Bitmap>,
            MAX_HISTORY
        )
    }

    deselectHero() {
        this.selectedHero = undefined
        this.selectedLogo = undefined
        this.selectedName = undefined
        this.selectedHistory.clear()
    }

    setSelectedLogo(bmp: Data.Bitmap) {
        this.selectedLogo = bmp
    }

    async writeLogo() {
        const currentHero = this.selectedHero
        const currentLogo = this.selectedLogo
        if (!(currentHero && currentLogo)) return

        const db = this.db
        const history = this.selectedHistory

        currentHero.thumbnail = undefined
        currentHero.encodedLogo = DataStore.encodeBitmap(currentLogo)

        // Update database
        await db.transaction("rw", this.db.heroes, this.db.history, async () => {
            const heroQuery = db.heroes.where("name").equals("name")
            const hero = await heroQuery.first()
            if (!hero) return

            const historyItems = history.mapToArray(hist => ({
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

    async createHero(name: string, logo: Data.Bitmap): Promise<string | undefined> {
        const encodedLogo = DataStore.encodeBitmap(logo)
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
        if (this.swatches.exists(s => s === newColor)) return
        const droppedColor = this.swatches.push(newColor)
        const db = this.db
        await this.db.transaction("r", this.db.swatches, async () => {
            if (droppedColor) await db.swatches.where("color").equals(droppedColor).delete()
            await db.swatches.add({ color: newColor })
        })
    }

    async removeSwatch(color: string) {
        const removedColor = color.toLowerCase()
        const swatches = this.swatches.mapToArray(s => s).filter(c => c !== removedColor)
        this.swatches = SizedStack.from<string>(swatches, MAX_COLORS)
        await this.db.swatches.where("color").equals(removedColor).delete()
    }

    async addQuickColor(color: string) {
        const newColor = color.toLowerCase()
        if (this.quickColors.exists(s => s === newColor)) return
        const droppedColor = this.quickColors.push(newColor)
        const db = this.db
        await db.transaction("r", db.quickColors, async () => {
            if (droppedColor) await db.quickColors.where("color").equals(droppedColor.toLowerCase()).delete()
            await db.quickColors.add({ color: newColor })
        })
    }

    // Editor state methods

    setColor(color: string) {
        if (color === this.color) return
        this.color = color
        this.addQuickColor(color)
        this.writeEditorStateDeferred()
    }

    setBrushSize(value: number) {
        const brushSize = clamp(1, MAX_BRUSH_SIZE, value)
        if (brushSize === this.brushSize) return
        this.brushSize = brushSize
        this.writeEditorStateDeferred()
    }

    setToolId(value: number) {
        if (value === this.toolId) return
        this.toolId = value
        this.writeEditorStateDeferred()
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

    private writeEditorStateDeferred() {
        if (this.editorStateTimeout) clearTimeout(this.editorStateTimeout)
        this.editorStateTimeout = setTimeout(async () => { await this.writeEditorState() }, 1000)
    }

    private async writeEditorState() {
        await this.db.editorState.put({
            id: 0,
            color: this.color,
            brushSize: this.brushSize,
            toolId: this.toolId,
            canvasBackground: this.canvasBackground,
            gridOverlay: this.gridOverlay,
        })
    }

    // General

    async load(): Promise<void> {
        this.heroes = (await this.db.heroes.toArray()).sort((a, b) => compareStr(a.name, b.name))
        this.swatches = SizedStack.from((await this.db.swatches.toArray()).map(it => it.color), MAX_SWATCHES)
        this.quickColors = SizedStack.from((await this.db.quickColors.toArray()).map(it => it.color), MAX_SWATCHES)
        const state = await this.db.editorState.where("id").equals(0).first()
        if (state) {
            this.color = state.color
            this.brushSize = state.brushSize
            this.toolId = state.toolId
            this.canvasBackground = state.canvasBackground
            this.gridOverlay = state.gridOverlay
        }
    }

    // Helpers

    static async getThumbnail(hero: Data.Hero): Promise<ImageBitmap> {
        if (hero.thumbnail) return hero.thumbnail
        const bmp = DataStore.decodeBitmap(hero.encodedLogo)
        if (!bmp) throw new Error(`Hero ${hero.name}: Invalid logo image!`)
        const data = new ImageData(bmp.colorBuffer, bmp.width, bmp.height)
        const image = await createImageBitmap(data)
        hero.thumbnail = image
        return image
    }

    private static encodeBitmap(bmp: Data.Bitmap): string {
        const base64 = Buffer.from(pako.deflate(bmp.colorBuffer)).toString("base64")
        return JSON.stringify({
            width: bmp.width,
            height: bmp.height,
            data: base64
        })
    }

    private static decodeBitmap(source: string): Data.Bitmap | undefined {
        try {
            const json: Data.EncodedBitmap = JSON.parse(source)
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