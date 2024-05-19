import { makeAutoObservable } from "mobx"
import React from "react"
import { clamp } from "../common"

export class EditorStore {
    constructor() {
        makeAutoObservable(this, undefined, { autoBind: true })
    }

    toolIndex: number = 0
    zoom: number = 16

    get scale(): number {
        return Math.floor(this.zoom)
    }

    setToolIndex(value: number) {
        if (value != this.toolIndex) this.toolIndex = value
    }


    setZoom(value: number) {
        if (value != this.zoom) this.zoom = clamp(1, EditorStore.MAX_ZOOM, value)
    }

    changeZoom(delta: number) {
        const value = this.zoom + delta
        this.zoom = clamp(1, EditorStore.MAX_ZOOM, value)
    }

    static readonly MAX_ZOOM = 32
}

export const editorStore = new EditorStore()

export const EditorContext = React.createContext(editorStore)