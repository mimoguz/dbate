import {
    ExtractDocumentTypeFromTypedRxJsonSchema,
    RxCollection,
    RxDocument,
    RxJsonSchema,
    toTypedRxJsonSchema,
} from "rxdb"

export const editorStateSchemaLiteral = {
    title: "editor state schema",
    description: "describes the state of the editor page",
    version: 0,
    primaryKey: "id",
    type: "object",
    properties: {
        id: { type: "string", maxLength: 100 },
        toolIndex: { type: "integer" },
        brushSize: { type: "integer" },
        color: { type: "string" },
        showDarkBackground: { type: "boolean" },
        showCheckerboardOverlay: { type: "boolean" },
        zoom: { type: "number" },
        recentColors: {
            type: "array",
            items: { type: "string", maxLength: 16 },
        },
        swatches: {
            type: "array",
            items: { type: "string", maxLength: 16 },
        },
    },
    required: [
        "id", "toolIndex", "brushSize", "color",
        "showDarkBackground", "showCheckerboardOverlay",
        "zoom", "recentColors", "recentColors", "swatches"
    ],
} as const

const schemaTyped = toTypedRxJsonSchema(editorStateSchemaLiteral)

export type EditorState = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>

export const editorStateSchema: RxJsonSchema<EditorState> = editorStateSchemaLiteral

export type EditorStateDocumentMethods = {
    addSwatch: (color: string) => Promise<void>
    removeSwatch: (color: string) => Promise<void>,
    scale: () => number,
    setBrushSize: (value: number) => Promise<void>
    setCheckerboardOverlay: (value: boolean) => Promise<void>,
    setColor: (color: string) => Promise<void>,
    setDarkBackground: (value: boolean) => Promise<void>,
    setToolIndex: (value: number) => Promise<void>
    setZoom: (value: number) => Promise<void>
    toggleCheckerboardOverlay: () => Promise<void>,
    toggleDarkBackground: () => Promise<void>,
    updateZoom: (delta: number) => Promise<void>
}

export type EditorStateDocument = RxDocument<EditorState, EditorStateDocumentMethods>

export type EditorStateCollection = RxCollection<EditorState, EditorStateDocumentMethods>
