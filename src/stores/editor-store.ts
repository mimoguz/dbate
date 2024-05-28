import { makeAutoObservable } from "mobx"
import * as DB from "../database"
import * as Data from "../data"
import { rgba } from "../drawing"
import { constants } from "./constants"
import React from "react"
import { clamp } from "../common"

export type EditorProperties = Omit<Data.EditorState, "id">

export class EditorStore {
    constructor(db: DB.Database) {
        makeAutoObservable(this, {}, { autoBind: true, deep: true })
        this.db = db
        this.load()
    }

    private readonly db: DB.Database

    private editorStateTimeout: NodeJS.Timeout | undefined

    state: EditorProperties = {
        brushSize: 1,
        canvasBackground: "light",
        color: "#0000ff",
        gridOverlay: "hidden",
        toolId: 0,
        zoom: 1,
    }

    quickColors: Array<string> = []

    swatches: Array<string> = []

    get scale(): number {
        return Math.floor(this.state.zoom)
    }

    setEditorState(stateUpdate: Partial<EditorProperties>) {
        if (stateUpdate.zoom) stateUpdate.zoom = clamp(1, constants.maxZoom, stateUpdate.zoom)
        this.setLocalEditorState(stateUpdate)
        this.writeEditorStateDeferred()
        if (stateUpdate.color) {
            this.updateQuickColors(stateUpdate.color)
        }
    }

    changeZoom(delta: number) {
        const zoom = this.state.zoom + delta
        this.setEditorState({ zoom })
    }

    toggleCanvasBackground() {
        this.setEditorState({ canvasBackground: this.state.canvasBackground === "light" ? "dark" : "light" })
    }

    toggleGridOverlay() {
        this.setEditorState({ gridOverlay: this.state.gridOverlay === "visible" ? "hidden" : "visible" })
    }

    async addSwatch(value: string) {
        const color = value.toLowerCase()
        if (
            this.swatches.length < constants.maxSwatches
            && rgba.fromString(color).a !== 0
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

    private async load(): Promise<void> {
        await this.db.editorState.where("id").equals(0).first(st => {
            if (!st) {
                console.log("Couldn't load editor state")
                return
            }
            this.setLocalEditorState(st)
        })
        this.quickColors = (await this.db.quickColors.toArray()).map(qc => qc.color)
        this.swatches = (await this.db.swatches.toArray()).map(qc => qc.color)
    }

    private setLocalEditorState(stateUpdate: Partial<EditorProperties>) {
        this.state = {
            ...stateUpdate,
            ...this.state
        }
    }

    private async updateQuickColors(newColor: string) {
        const color = newColor.toLowerCase()
        let dropped: string | undefined

        if (rgba.fromString(color).a !== 0 && !this.quickColors.includes(color)) {
            this.quickColors.push(color)
            if (this.quickColors.length > constants.maxQuickColors) dropped = this.quickColors.shift()
        }

        await this.db.transaction("rw", this.db.quickColors, async () => {
            if (dropped) await this.db.quickColors.where("color").equals(dropped).delete()
            await this.db.quickColors.add({ color })
        })
    }

    private writeEditorStateDeferred() {
        if (this.editorStateTimeout) clearTimeout(this.editorStateTimeout)
        this.editorStateTimeout = setTimeout(async () => { await this.writeEditorState() }, 1000)
    }

    private async writeEditorState() {
        await this.db.editorState.put({
            id: 0,
            ...this.state
        })
    }
}

export const editorStore = new EditorStore(DB.db)

export const EditorContext = React.createContext(editorStore)
