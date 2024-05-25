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
        });
    }

    heroes!: Table<Data.Hero>
    history!: Table<Data.HistoryItem>
    swatches!: Table<Data.ColorItem>
    quickColors!: Table<Data.ColorItem>
    editorState!: Table<Data.EditorState>
}

export const db = new Database();
