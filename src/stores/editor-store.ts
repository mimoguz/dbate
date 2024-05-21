import { makeAutoObservable } from "mobx"
import React from "react"
import { clamp } from "../common"
import { DbType } from "../database"
import { Bitmap, EditorStateDocument, HeroDocument } from "../schema"
import { Subscription } from "rxjs"

export class EditorStore {
    constructor(getDb?: Promise<DbType>) {
        if (getDb) {
            getDb?.then(db => {
                this.db = db
                db.editorState.findOne().exec().then(doc => {
                    this.stateSubscriptions.forEach(sub => sub.unsubscribe())
                    this.stateSubscriptions = []
                    this.setState(doc ?? undefined)
                })
                if (this.selectedHeroName) this.selectHero(this.selectedHeroName)
            })
        }
        makeAutoObservable(this, {}, { autoBind: true })
    }

    private db?: DbType
    private state?: EditorStateDocument
    private stateSubscriptions: Array<Subscription> = []
    private hero?: HeroDocument
    private heroSubscriptions: Array<Subscription> = []
    private selectedHeroName?: string
    private selectedHistorySize: number = 0

    selectedLogo?: Bitmap
    selectedName?: string
    brushSize: number = 1
    toolIndex: number = 0
    zoom: number = 16
    showDarkBackground: boolean = false
    showCheckerboardOverlay: boolean = false
    color: string = "#0000ff"
    quickColors: Array<string> = []
    swatches: Array<string> = []

    get canUndo(): boolean {
        return this.selectedHistorySize > 0
    }

    get scale(): number {
        return Math.floor(this.zoom)
    }

    selectHero(name: string) {
        this.selectedHeroName = name
        this.db?.heroes.findOne({ selector: { name } }).exec().then(doc => {
            this.cleanHero()
            this.setHero(doc)
        })
    }

    updateLogo(bmp: Bitmap) {
        this.hero?.updateLogo(bmp)
    }

    undoLogoUpdate() {
        this.hero?.goBack()
    }

    setBrushSize(value: number) {
        const v = clamp(1, EditorStore.MAX_BRUSH_SIZE, value)
        if (v !== this.brushSize) this.brushSize = v
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

    setColor(value: string) {
        if (value !== this.color) this.state?.setColor(value)
    }

    toggleDarkBackground() {
        this.state?.toggleDarkBackground()
    }

    toggleCheckerboardOverlay() {
        this.state?.toggleCheckerboardOverlay()
    }

    addSwatch(value: string) {
        if (this.swatches.indexOf(value) >= 0) return
        this.state?.addSwatch(value)
    }

    removeSwatch(value: string) {
        if (this.swatches.indexOf(value) === -1) return
        this.state?.removeSwatch(value)
    }

    private setState(value?: EditorStateDocument) {
        if (!value) return
        this.state = value
        this.stateSubscriptions.push(value.color$.subscribe(this.syncColor))
        this.stateSubscriptions.push(value.recentColors$.subscribe(this.syncQuickColors))
        this.stateSubscriptions.push(value.swatches$.subscribe(this.syncSwatches))
        this.stateSubscriptions.push(value.showDarkBackground$.subscribe(this.syncShowDarkBackground))
        this.stateSubscriptions.push(value.showCheckerboardOverlay$.subscribe(this.syncShowCheckerboardOverlay))
    }

    private setHero(value: HeroDocument | null | undefined) {
        if (!value) return
        this.hero = value
        this.heroSubscriptions.push(value.name$.subscribe(this.syncSelectedName))
        this.heroSubscriptions.push(value.logo$.subscribe(logo => this.syncSelectedLogo(logo as Bitmap)))
        this.heroSubscriptions.push(value.history$.subscribe(this.syncSelectedHistorySize))
    }

    private cleanHero() {
        this.heroSubscriptions.forEach(sub => sub.unsubscribe())
        this.heroSubscriptions = []
        this.hero = undefined
        this.syncSelectedName(undefined)
        this.syncSelectedLogo(undefined)
        this.syncSelectedHistorySize([])
    }

    // Settings collection sync actions
    private syncColor(value: string) { if (value !== this.color) this.color = value }
    private syncQuickColors(value: Array<string>) { if (value !== this.quickColors) this.quickColors = value }
    private syncSwatches(value: Array<string>) { if (value !== this.swatches) this.swatches = value }
    private syncShowDarkBackground(value: boolean) { if (value !== this.showDarkBackground) this.showDarkBackground = value }
    private syncShowCheckerboardOverlay(value: boolean) { if (value !== this.showCheckerboardOverlay) this.showCheckerboardOverlay = value }

    // Hero sync actions
    private syncSelectedHistorySize(history: Array<unknown>) { if (history.length !== this.selectedHistorySize) this.selectedHistorySize = history.length }
    private syncSelectedName(value?: string) { if (value !== this.selectedName) this.selectedHeroName = value }
    private syncSelectedLogo(value?: Bitmap) { if (value !== this.selectedLogo) this.selectedLogo = value }

    static readonly MAX_ZOOM = 32
    static readonly MAX_BRUSH_SIZE = 10
}

export const editorStore = new EditorStore()

export const EditorContext = React.createContext(editorStore)