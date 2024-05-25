import Dexie, { Table } from 'dexie'

export interface Bitmap {
    width: number
    height: number
    colorBuffer: Uint8ClampedArray
}

export interface EncodedBitmap {
    width: number
    height: number
    data: string
}

export interface Hero {
    name: string
    encodedLogo: string
    thumbnail?: ImageBitmap
}

export interface HistoryItem {
    id?: number
    heroName: string
    encodedLogo: string
}

export interface ColorItem {
    color: string
}

export type CanvasBackground = "light" | "dark"

export type GridOverlayVisibility = "visible" | "hidden"

export interface EditorState {
    id: number
    color: string
    brushSize: number
    toolId: number
    canvasBackground: "light" | "dark"
    gridOverlay: "visible" | "hidden"
}

export class Database extends Dexie {
    constructor() {
        super('myDatabase');
        this.version(1).stores({
            // Primary key and indexed props
            heroes: "name",
            history: "++id, heroName",
            swatches: "color",
            quickColors: "color",
            editorState: "id",
        });
    }

    heroes!: Table<Hero>
    history!: Table<HistoryItem>
    swatches!: Table<ColorItem>
    quickColors!: Table<ColorItem>
    editorState!: Table<EditorState>
}

export const db = new Database();
