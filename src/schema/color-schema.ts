import {
    ExtractDocumentTypeFromTypedRxJsonSchema,
    RxCollection,
    RxDocument,
    RxJsonSchema,
    toTypedRxJsonSchema,
} from "rxdb"

export const colorSchemaLiteral = {
    title: "color schema",
    description: "describes a color",
    version: 0,
    primaryKey: "value",
    type: "object",
    properties: {
        value: { type: "string", maxLength: 100 },
    },
    required: ["value"],
} as const

const schemaTyped = toTypedRxJsonSchema(colorSchemaLiteral)

export type Color = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>

export const colorSchema: RxJsonSchema<Color> = colorSchemaLiteral

export type ColorDocument = RxDocument<Color>

export type ColorCollection = RxCollection<Color>