import { action, makeAutoObservable } from "mobx"
import React from "react"
import { IndexedColor, indexedColor, toCSSValue } from "../drawing"
import * as DB from "../database"
import { constants } from "./constants"

export class ColorStore {
    constructor(db: DB.Database) {
        makeAutoObservable(this, {}, { autoBind: true })
        this.db = db
        this.load()
    }

    private readonly db: DB.Database
    private timeout: NodeJS.Timeout | undefined
    private index: number = -1

    defaultFill: number = 0

    colorTable: Array<IndexedColor> = []

    get canAdd() {
        return this.index < constants.maxColorIndex
    }

    setDefaultFill(value: number) {
        if (value >= 0 && value <= this.index) this.defaultFill = value
    }

    get(index: number): number {
        return this.colorTable[index].value
    }

    getHex(index: number): string {
        return toCSSValue(this.colorTable[index])
    }

    add(value: string) {
        this.index++
        if (this.index > constants.maxColorIndex) {
            console.error("Max index has been reached")
            return
        }
        const color = indexedColor(this.index, "", value)
        this.colorTable.push(color)
        this.writeDeferred()
    }

    update(index: number, params: { name?: string, value?: string | number }) {
        if (index < 0 || index >= this.colorTable.length) {
            throw new Error("ColorStore.update: Invalid index")
        }
        const old = this.colorTable[index]
        const name = params.name ?? old.name
        const value = params.value ?? old.value
        this.colorTable[index] = indexedColor(index, name, value)
        this.writeDeferred()
    }

    load() {
        this.db.colors.toArray().then(action("fetchColors", colors => {
            this.colorTable = colors
            this.index = Math.max(-1, ...colors.map(color => color.index))
            console.debug(this.colorTable)
        }))
    }

    private writeDeferred() {
        if (this.timeout) clearTimeout(this.timeout)
        this.timeout = setTimeout(this.write, 1000)
    }

    private async write() {
        await this.db.transaction("rw", this.db.colors, async () => {
            await this.db.colors.clear()
            await this.db.colors.bulkAdd(this.colorTable.map(c => ({ index: c.index, name: c.name, value: c.value })))
        })
    }
}

export const colorStore = new ColorStore(DB.db)

export const ColorsContext = React.createContext(colorStore)
