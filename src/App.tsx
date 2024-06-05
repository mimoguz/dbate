import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.layer.css"
import { observer } from "mobx-react-lite"
import React from "react"
import { ClipboardContext, InternalClipboard } from "./common"
import { ColorsContext, EditorContext, HeroContext, SettingsContext, colorStore, editorStore, heroStore, settingsStore } from "./stores"
import { theme } from "./theme"
import { Colors, Editor } from "./pages"

export default function App() {
    return (
        <SettingsContext.Provider value={settingsStore}>
            <ColorsApp />
        </SettingsContext.Provider>
    )
}

const ColorsApp = observer(() => {
    const settingsStore = React.useContext(SettingsContext)
    return (
        <MantineProvider
            theme={theme}
            defaultColorScheme={settingsStore.theme}
            forceColorScheme={settingsStore.theme === "auto" ? undefined : settingsStore.theme}
        >
            <ColorsContext.Provider value={colorStore}>
                <Colors />
            </ColorsContext.Provider>
        </MantineProvider>
    )
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditorApp = observer(() => {
    const settingsStore = React.useContext(SettingsContext)
    return (
        <MantineProvider
            theme={theme}
            defaultColorScheme={settingsStore.theme}
            forceColorScheme={settingsStore.theme === "auto" ? undefined : settingsStore.theme}
        >
            <EditorContext.Provider value={editorStore}>
                <ClipboardContext.Provider value={new InternalClipboard()}>
                    <HeroContext.Provider value={heroStore}>
                        <Editor />
                    </HeroContext.Provider>
                </ClipboardContext.Provider>
            </EditorContext.Provider>
        </MantineProvider>
    )
})
