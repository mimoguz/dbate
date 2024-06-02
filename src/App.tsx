import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.layer.css"
import { Editor } from "./pages/editor/editor"
import { theme } from "./theme"
import { DataContext, EditorContext, HeroContext, SettingsContext, dataStore, editorStore, heroStore, settingsStore } from "./stores"
import { ClipboardContext, InternalClipboard } from "./common"

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <DataContext.Provider value={dataStore}>
                <SettingsContext.Provider value={settingsStore}>
                    <EditorContext.Provider value={editorStore}>
                        <ClipboardContext.Provider value={new InternalClipboard()}>
                            <HeroContext.Provider value={heroStore}>
                                <Editor />
                            </HeroContext.Provider>
                        </ClipboardContext.Provider>
                    </EditorContext.Provider>
                </SettingsContext.Provider>
            </DataContext.Provider>
        </MantineProvider>
    )
}
