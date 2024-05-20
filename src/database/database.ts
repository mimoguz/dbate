import { RxDatabase, addRxPlugin, createRxDatabase } from "rxdb"
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"
import { bitmap } from "../drawing"
import { Bitmap, HeroCollection, HeroDocument, HeroDocumentMethods } from "../schema"
import { EditorStateCollection, EditorStateDocument, EditorStateDocumentMethods, editorStateSchema } from "../schema/editor-state-schema"
import { heroSchema } from "../schema/hero-schema"

addRxPlugin(RxDBLeaderElectionPlugin)

let dbPromise: Promise<DbType> | null = null

export type DbCollections = {
    heroes: HeroCollection
    editorState: EditorStateCollection
}

export type DbType = RxDatabase<DbCollections, unknown, unknown, unknown>

export const MAX_RECENT_COLORS = 3
export const MAX_SWATCHES = 16
export const MAX_HISTORY = 8

const editorStateDocumentMethods: EditorStateDocumentMethods = {
    setColor: async function (this: EditorStateDocument, value: string): Promise<void> {
        if (this.color === value) return
        await this.incrementalModify(doc => {
            doc.color = value
            let recentColors = doc.recentColors ?? []
            if (recentColors.indexOf(value) >= 0 || value === "#00000000") return doc
            recentColors = ["transparent", value, ...recentColors.slice(1, MAX_RECENT_COLORS)]
            doc.recentColors = recentColors
            return doc
        })
    },

    addSwatch: async function (this: EditorStateDocument, value: string): Promise<void> {
        if (this.swatches.indexOf(value) >= 0) return
        await this.incrementalModify(doc => {
            const swatches = doc.swatches ?? []
            if (swatches.length >= MAX_SWATCHES) swatches.splice(15)
            swatches.push(value)
            doc.swatches = swatches
            return doc
        })
    },

    removeSwatch: async function (this: EditorStateDocument, value: string): Promise<void> {
        await this.incrementalModify(doc => {
            const swatches = doc.swatches ?? []
            const index = swatches.indexOf(value)
            if (index === -1) return doc
            swatches.splice(index, 1)
            doc.swatches = swatches
            return doc
        })
    },

    setCheckerboardOverlay: async function (this: EditorStateDocument, value: boolean): Promise<void> {
        if (this.showCheckerboardOverlay === value) return
        await this.incrementalPatch({ showCheckerboardOverlay: value })
    },

    setDarkBackground: async function (this: EditorStateDocument, value: boolean): Promise<void> {
        if (this.showDarkBackground === value) return
        await this.incrementalPatch({ showDarkBackground: value })
    },

    toggleCheckerboardOverlay: async function (this: EditorStateDocument): Promise<void> {
        await this.incrementalPatch({ showCheckerboardOverlay: !this.showCheckerboardOverlay })
    },

    toggleDarkBackground: async function (this: EditorStateDocument): Promise<void> {
        await this.incrementalPatch({ showDarkBackground: !this.showDarkBackground })
    },
} as const

const heroDocumentMethods: HeroDocumentMethods = {
    updateLogo: async function (this: HeroDocument, bmp: Bitmap): Promise<void> {
        await this.incrementalModify(doc => {
            const history = doc.history
            if (history.length >= (MAX_HISTORY - 1)) {
                doc.history.splice(0, history.length - MAX_HISTORY + 1)
            }
            history.push(doc.logo)
            doc.logo = bmp
            doc.history = history
            return doc
        })

    },

    goBack: async function (this: HeroDocument): Promise<void> {
        await this.incrementalModify(doc => {
            const history = this.history
            const result = history.pop()
            if (result) {
                doc.logo = result
                doc.history = history
            }
            return doc
        })

    },

    historySize: function (this: HeroDocument): number {
        return this.history.length
    },
} as const

const create = async (): Promise<DbType> => {
    const dbName = "heroesRxDatabase"

    // await removeRxDatabase(dbName, getRxStorageDexie())

    const db = await createRxDatabase<DbCollections>({
        name: dbName,
        storage: getRxStorageDexie(),
    })

    db.waitForLeadership().then(() => console.debug(db.name, "is leader now"))

    await db.addCollections({
        heroes: {
            schema: heroSchema,
            methods: heroDocumentMethods,
        },
        editorState: {
            schema: editorStateSchema,
            methods: editorStateDocumentMethods,
        },
    })

    if ((await db.heroes.find().exec()).length === 0) {
        await db.heroes.upsert({
            name: "Bob",
            logo: bitmap.empty(32, 32),
            history: [],
        })
    }

    if (!(await db.editorState.findOne({ selector: { id: "editor-state-0" } }).exec())) {
        await db.editorState.upsert({
            id: "editor-state-0",
            color: "#0000ff",
            showDarkBackground: false,
            showCheckerboardOverlay: false,
            recentColors: ["transparent", "#0000ff"],
            swatches: ["#ff0000", "#00ff00", "#0000ff"]
        })
    }

    return db
}

export const get = (): Promise<DbType> => {
    if (!dbPromise) dbPromise = create()
    return dbPromise
}
