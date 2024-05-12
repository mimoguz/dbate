import { RxDatabase, addRxPlugin, createRxDatabase } from "rxdb"
import { RxDBLeaderElectionPlugin } from "rxdb/plugins/leader-election"
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie"
import { Bitmap, ColorCollection, HeroCollection, HeroDocument, HeroDocumentMethods } from "../schema"
import { heroSchema } from "../schema/hero-schema"
import { colorSchema } from "../schema/color-schema"
import { bitmap } from "../drawing"

addRxPlugin(RxDBLeaderElectionPlugin)

let dbPromise: Promise<DbType> | null = null

export type DbCollections = {
    heroes: HeroCollection
    savedColors: ColorCollection
}

export type DbType = RxDatabase<DbCollections, unknown, unknown, unknown>

const create = async (): Promise<DbType> => {
    const dbName = "heroesRxDatabase"

    // await removeRxDatabase(dbName, getRxStorageDexie())

    const db = await createRxDatabase<DbCollections>({
        name: dbName,
        storage: getRxStorageDexie(),
    })

    db.waitForLeadership().then(() => console.debug(db.name, "is leader now"))

    const heroDocumentMethods: HeroDocumentMethods = {
        pushHistory: async function (
            this: HeroDocument,
            bmp: Bitmap,
            limit: number
        ) {
            const history = this.history
            if (history.length >= limit) {
                history.splice(0, history.length - limit + 1)
            }
            history.push(bmp)
            await this.incrementalPatch({ history })
        },

        popHistory: async function (
            this: HeroDocument
        ): Promise<Bitmap | undefined> {
            const history = this.history
            const result = history.pop()
            await this.incrementalPatch({ history })
            return result
        },

        historySize: function (this: HeroDocument): number {
            return this.history.length
        },
    }

    await db.addCollections({
        heroes: {
            schema: heroSchema,
            methods: heroDocumentMethods,
        },
        savedColors: {
            schema: colorSchema,
        },
    })

    if ((await db.heroes.find().exec()).length === 0) {
        await db.heroes.upsert({
            name: "Bob",
            logo: bitmap.empty(32, 32),
            history: [],
        })
    }

    return db
}

export const get = (): Promise<DbType> => {
    if (!dbPromise) dbPromise = create()
    return dbPromise
}