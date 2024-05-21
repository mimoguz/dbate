import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.layer.css"
import { Editor } from "./pages/editor/editor"
import { theme } from "./theme"
import { EditorContext, EditorStore } from "./stores"
import * as DB from "./database"

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <EditorContext.Provider value={new EditorStore(DB.get())}>
                <Editor />
            </EditorContext.Provider>
        </MantineProvider>
    )
}
