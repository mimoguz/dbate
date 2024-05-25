export type CanvasBackground = "light" | "dark"

export type GridOverlayVisibility = "visible" | "hidden"

export interface EditorState {
    id: number
    color: string
    brushSize: number
    zoom: number
    toolId: number
    canvasBackground: "light" | "dark"
    gridOverlay: "visible" | "hidden"
}