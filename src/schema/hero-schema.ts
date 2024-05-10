import {
    ExtractDocumentTypeFromTypedRxJsonSchema,
    RxCollection,
    RxDocument,
    RxJsonSchema,
    toTypedRxJsonSchema,
} from "rxdb"
import { Bitmap, bitmapSchema } from "./bitmap-schema"

export const heroSchemaLiteral = {
    title: "hero schema",
    description: "describes a simple hero",
    version: 0,
    primaryKey: "name",
    type: "object",
    properties: {
        name: {
            type: "string",
            maxLength: 100,
        },
        logo: bitmapSchema,
        history: {
            type: "array",
            items: bitmapSchema,
        },
    },
    required: ["name", "logo", "history"],
} as const

const schemaTyped = toTypedRxJsonSchema(heroSchemaLiteral)

export type Hero = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>

export const heroSchema: RxJsonSchema<Hero> = heroSchemaLiteral

export type HeroDocumentMethods = {
    pushHistory: (item: Bitmap, limit: number) => Promise<void>
    popHistory: () => Promise<Bitmap | undefined>
    historySize: () => number
}

export type HeroDocument = RxDocument<Hero, HeroDocumentMethods>

export type HeroCollection = RxCollection<Hero, HeroDocumentMethods>