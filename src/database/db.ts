import Dexie, { Table } from 'dexie'
import * as Data from '../data';

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
            colors: "index, value"
        });
    }

    heroes!: Table<Data.HeroItem>
    history!: Table<Data.HistoryItem>
    swatches!: Table<Data.ColorItem>
    quickColors!: Table<Data.ColorItem>
    editorState!: Table<Data.EditorState>
    colors!: Table<Data.IndexedColor>
}

export const db = new Database();
