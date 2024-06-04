import { makeAutoObservable } from "mobx"
import React from "react"

const THEME_KEY = "app-theme"

export type Theme = "auto" | "light" | "dark"

export class SettingsStore {
    constructor() {
        this.load()
        makeAutoObservable(this, {}, { autoBind: true })
    }

    theme: Theme = "light"

    setTheme(value: Theme) {
        if (value !== this.theme) {
            this.theme = value
            localStorage.setItem(THEME_KEY, value)
        }
    }

    private load() {
        const theme = localStorage.getItem(THEME_KEY)
        switch (theme) {
            case "auto":
                this.setTheme("auto")
                break
            case "dark":
                this.setTheme("dark")
                break
            default:
                this.setTheme("light")
                break
        }
    }
}

export const settingsStore = new SettingsStore()

export const SettingsContext = React.createContext(settingsStore)