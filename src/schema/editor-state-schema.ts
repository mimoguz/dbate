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
        color: { type: "string" },
        showDarkBackground: { type: "boolean" },
        showCheckerboardOverlay: { type: "boolean" },
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
        "id",
        "color",
        "showDarkBackground",
        "showCheckerboardOverlay",
        "swatches",
        "recentColors",
    ],
} as const

const schemaTyped = toTypedRxJsonSchema(editorStateSchemaLiteral)

export type EditorState = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>

export const editorStateSchema: RxJsonSchema<EditorState> = editorStateSchemaLiteral

export type EditorStateDocumentMethods = {
    addSwatch: (color: string) => Promise<void>
    removeSwatch: (color: string) => Promise<void>,
    setCheckerboardOverlay: (value: boolean) => Promise<void>,
    setColor: (color: string) => Promise<void>,
    setDarkBackground: (value: boolean) => Promise<void>,
    toggleCheckerboardOverlay: () => Promise<void>,
    toggleDarkBackground: () => Promise<void>,
}

export type EditorStateDocument = RxDocument<EditorState, EditorStateDocumentMethods>

export type EditorStateCollection = RxCollection<EditorState, EditorStateDocumentMethods>
