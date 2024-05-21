import { makeAutoObservable } from "mobx"
import React from "react"
import { clamp } from "../common"
import { DbType } from "../database"
import { EditorStateDocument } from "../schema"
import { Subscription } from "rxjs"

export class EditorStore {
    constructor(getDb?: Promise<DbType>) {
        if (getDb) {
            getDb?.then(db => {
                db.editorState.findOne().exec().then(doc => {
                    this.subscription?.unsubscribe()
                    if (!doc) {
                        this.db = undefined
                        return
                    }
                    this.subscription = doc.$.subscribe(doc => {
                        this.db = doc
                        this.color = doc.color
                        this.showDarkBackground = doc.showDarkBackground
                        this.showCheckerboardOverlay = doc.showCheckerboardOverlay
                        this.quickColors = doc.recentColors
                        this.swatches = doc.swatches
                    })
                })
            })
        }
        makeAutoObservable(this, undefined, { autoBind: true })
    }

    private db?: EditorStateDocument
    private subscription?: Subscription
    brushSize: number = 1
    toolIndex: number = 0
    zoom: number = 16
    showDarkBackground: boolean = false
    showCheckerboardOverlay: boolean = false
    color: string = "#0000ff"
    quickColors: Array<string> = []
    swatches: Array<string> = []

    get scale(): number {
        return Math.floor(this.zoom)
    }

    setBrushSize(value: number) {
        const v = clamp(1, EditorStore.MAX_BRUSH_SIZE, value)
        if (v !== this.brushSize) this.brushSize = v
    }

    setColor(value: string) {
        if (value !== this.color) {
            this.color = value
            this.db?.setColor(value)
            this.quickColors = this.db?.recentColors ?? []
        }
    }

    setToolIndex(value: number) {
        if (value != this.toolIndex) this.toolIndex = value
    }


    setZoom(value: number) {
        const v = clamp(1, EditorStore.MAX_ZOOM, value)
        if (v != this.zoom) this.zoom = v
    }

    changeZoom(delta: number) {
        const value = this.zoom + delta
        this.zoom = clamp(1, EditorStore.MAX_ZOOM, value)
    }

    toggleDarkBackground() {
        this.showDarkBackground != this.showDarkBackground
        this.db?.incrementalPatch({ showDarkBackground: this.showDarkBackground })
    }

    toggleCheckerboardOverlay() {
        this.showCheckerboardOverlay != this.showCheckerboardOverlay
        this.db?.incrementalPatch({ showCheckerboardOverlay: this.showCheckerboardOverlay })
    }

    addSwatch(value: string) {
        if (this.swatches.indexOf(value) >= 0) return
        this.db?.addSwatch(value)
        this.swatches = this.db?.swatches ?? []
    }

    removeSwatch(value: string) {
        if (this.swatches.indexOf(value) === -1) return
        this.db?.removeSwatch(value)
        this.swatches = this.db?.swatches ?? []
    }

    static readonly MAX_ZOOM = 32
    static readonly MAX_BRUSH_SIZE = 10
}

export const editorStore = new EditorStore()

export const EditorContext = React.createContext(editorStore)