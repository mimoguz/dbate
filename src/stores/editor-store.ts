import { makeAutoObservable } from "mobx"
import React from "react"
import { clamp } from "../common"

export class EditorStore {
    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true })
    }

    brushSize: number = 1
    toolIndex: number = 0
    zoom: number = 16

    get scale(): number {
        return Math.floor(this.zoom)
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

    static readonly MAX_ZOOM = 32
    static readonly MAX_BRUSH_SIZE = 10
}

export const editorStore = new EditorStore()

export const EditorContext = React.createContext(editorStore)