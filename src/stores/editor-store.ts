import { action, makeAutoObservable } from "mobx"
import React from "react"
import { clamp } from "../common"
import * as Data from "../data"
import * as DB from "../database"
import { constants } from "./constants"
import { Color } from "../drawing"

export type EditorProperties = Omit<Data.EditorState, "id">

export class EditorStore {
    constructor(db: DB.Database) {
        makeAutoObservable(this, {}, { autoBind: true, deep: true })
        this.db = db
        this.load()
    }

    private readonly db: DB.Database

    private editorStateTimeout: NodeJS.Timeout | undefined

    brushSize: number = 1

    canvasBackground: Data.CanvasBackground = "light"

    color: string = "#0000ff"

    gridOverlay: Data.GridOverlayVisibility = "hidden"

    toolId: number = 0

    zoom: number = 1

    quickColors: Array<string> = []

    swatches: Array<string> = []

    setBrushSize(value: number) {
        if (value !== this.brushSize) this.brushSize = clamp(1, constants.maxBrushSize, value)
        this.writeEditorStateDeferred()
    }

    setCanvasBackground(value: Data.CanvasBackground) {
        if (value !== this.canvasBackground) this.canvasBackground = value
        this.writeEditorStateDeferred()
    }

    toggleCanvasBackground() {
        this.setCanvasBackground(this.canvasBackground === "light" ? "dark" : "light")
    }

    get isDarkBackground(): boolean {
        return this.canvasBackground === "dark"
    }

    async setColor(value: string) {
        const color = value.toLowerCase()
        if (color === this.color) return
        this.color = color

        if (!(Color.fromCSSColor(color)?.isTransparent ?? true) && !this.quickColors.includes(color)) {
            this.quickColors = [color, ...this.quickColors.slice(0, constants.maxQuickColors - 1)]
        }

        await this.db.transaction("rw", this.db.quickColors, async () => {
            await this.db.quickColors.clear()
            await this.db.quickColors.bulkAdd(this.quickColors.map(color => ({ color })))
        })
    }

    setGridOverlay(value: Data.GridOverlayVisibility) {
        if (value !== this.gridOverlay) this.gridOverlay = value
        this.writeEditorStateDeferred()
    }

    toggleGridOverlay() {
        this.setGridOverlay(this.gridOverlay === "visible" ? "hidden" : "visible")
    }

    get isGridVisible(): boolean {
        return this.gridOverlay === "visible"
    }

    setToolId(value: number) {
        if (value != this.toolId) this.toolId = value
        this.writeEditorStateDeferred()
    }

    setZoom(value: number) {
        const zoom = clamp(1, constants.maxZoom, value)
        if (zoom !== this.zoom) this.zoom = value
        this.writeEditorStateDeferred()
    }

    updateZoom(delta: number) {
        this.setZoom(this.zoom + delta)
    }

    get scale(): number {
        return Math.floor(this.zoom)
    }

    async addSwatch(value: string) {
        const color = value.toLowerCase()
        if (
            this.swatches.length < constants.maxSwatches
            && !(Color.fromCSSColor(color)?.isTransparent ?? true)
            && !this.swatches.includes(color)
        ) {
            this.swatches.push(color)
            await this.db.swatches.add({ color })
        }
    }

    async removeSwatch(value: string) {
        const color = value.toLowerCase()
        const index = this.swatches.indexOf(color)
        if (index >= 0) {
            this.swatches.splice(index, 1)
            await this.db.quickColors.where("color").equals(color).delete()
        }
    }

    load() {
        this.db.quickColors.toArray().then(action("fetchQuickColors", colors => {
            this.quickColors = colors.map(qc => qc.color)
        }))

        this.db.swatches.toArray().then(action("fetchSwatches", colors => {
            this.swatches = colors.map(qc => qc.color)
        }))

        this.db.editorState.where("id").equals(0).first().then(action("fetchEditorState", state => {
            if (!state) {
                console.log("Couldn't load editor state")
                return
            }
            this.brushSize = state.brushSize
            this.canvasBackground = state.canvasBackground
            this.color = state.color
            this.gridOverlay = state.gridOverlay
            this.toolId = state.toolId
            this.zoom = state.zoom
        }))
    }

    private writeEditorStateDeferred() {
        if (this.editorStateTimeout) clearTimeout(this.editorStateTimeout)
        this.editorStateTimeout = setTimeout(async () => { await this.writeEditorState() }, 1000)
    }

    private async writeEditorState() {
        await this.db.editorState.put({
            id: 0,
            brushSize: this.brushSize,
            canvasBackground: this.canvasBackground,
            color: this.color,
            gridOverlay: this.gridOverlay,
            toolId: this.toolId,
            zoom: this.zoom,
        })
    }
}

export const editorStore = new EditorStore(DB.db)

export const EditorContext = React.createContext(editorStore)
