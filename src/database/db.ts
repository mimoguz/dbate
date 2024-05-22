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

export interface History {
    id?: number
    heroName: string
    encodedLogo: string
}

export class Database extends Dexie {
    constructor() {
        super('myDatabase');
        this.version(1).stores({
            // Primary key and indexed props
            heroes: "name",
            history: "++id, heroName"
        });
    }

    heroes!: Table<Hero>
    history!: Table<History>
}

export const db = new Database();
