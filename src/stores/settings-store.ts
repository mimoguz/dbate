const THEME_KEY = "app-theme"

export type Theme = "light" | "dark"

export class SettingsStore {
    constructor() {
        this.load()
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
        this.theme = theme === "light" || theme === "dark" ? theme : "light"
    }
}