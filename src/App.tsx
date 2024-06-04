import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.layer.css"
import { Editor } from "./pages/editor/editor"
import { theme } from "./theme"
import { DataContext, EditorContext, HeroContext, SettingsContext, dataStore, editorStore, heroStore, settingsStore } from "./stores"
import { ClipboardContext, InternalClipboard } from "./common"
import { observer } from "mobx-react-lite"
import React from "react"

export default function App() {
    return (
        <SettingsContext.Provider value={settingsStore}>
            <Aux />
        </SettingsContext.Provider>
    )
}

const Aux = observer(() => {
    const settingsStore = React.useContext(SettingsContext)
    return (
        <MantineProvider
            theme={theme}
            defaultColorScheme={settingsStore.theme}
            forceColorScheme={settingsStore.theme === "auto" ? undefined : settingsStore.theme}
        >
            <DataContext.Provider value={dataStore}>
                <EditorContext.Provider value={editorStore}>
                    <ClipboardContext.Provider value={new InternalClipboard()}>
                        <HeroContext.Provider value={heroStore}>
                            <Editor />
                        </HeroContext.Provider>
                    </ClipboardContext.Provider>
                </EditorContext.Provider>
            </DataContext.Provider>
        </MantineProvider>
    )
})
