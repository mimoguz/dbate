import { action, computed, makeAutoObservable, makeObservable, observable } from "mobx"
import { clamp } from "../common"
import React from "react"

export class EditorStore {
    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true })
    }

    toolIndex: number = 0
    brushSize: number = 2
    color: string = "#0000ff"
    showDarkBackground: boolean = false
    showCheckerboardOverlay: boolean = false
    zoom: number = 16
    recentColors: Array<string> = ["transparent", "#0000ff"]
    swatches: Array<string> = []

    get scale(): number {
        return Math.floor(this.zoom)
    }

    setToolIndex(value: number) {
        if (value != this.toolIndex) this.toolIndex = value
    }

    setBrushSize(value: number) {
        if (value != this.brushSize) this.brushSize = clamp(1, EditorStore.MAX_BRUSH_SIZE, value)
    }

    setColor(value: string) {
        if (value === this.color) return
        this.color = value
        if (value !== "#00000000" && this.recentColors.indexOf(value) === -1) {
            this.recentColors = ["transparent", value, ...this.recentColors.slice(1, EditorStore.MAX_RECENT_COLORS)]
        }
    }

    setShowDarkBackground(value: boolean) {
        if (value !== this.showDarkBackground) this.showDarkBackground = value
    }

    toggleDarkBackground() {
        this.showDarkBackground = !this.showDarkBackground
    }

    setShowCheckerboardOverlay(value: boolean) {
        if (value !== this.showCheckerboardOverlay) this.showCheckerboardOverlay = value
    }

    toggleCheckerboardOverlay() {
        this.showCheckerboardOverlay = !this.showCheckerboardOverlay
    }

    setZoom(value: number) {
        if (value != this.zoom) this.zoom = clamp(1, EditorStore.MAX_ZOOM, value)
    }

    changeZoom(delta: number) {
        const value = this.zoom + delta
        this.zoom = clamp(1, EditorStore.MAX_ZOOM, value)
    }

    addSwatch(value: string) {
        if (this.swatches.indexOf(value) >= 0) return
        if (this.swatches.length >= EditorStore.MAX_SWATCHES) this.swatches.pop()
        this.swatches.push(value)
    }

    removeSwatch(value: string) {
        const index = this.swatches.indexOf(value)
        if (index >= 0) this.swatches.splice(index, 1)
    }

    static readonly MAX_ZOOM = 32
    static readonly MAX_BRUSH_SIZE = 10
    static readonly MAX_SWATCHES = 12
    static readonly MAX_RECENT_COLORS = 3
}

export const editorStore = new EditorStore()

export const EditorContext = React.createContext(editorStore)