import "@mantine/core/styles.layer.css"
import { MantineProvider } from "@mantine/core"
import { theme } from "./theme"
import { Editor } from "./pages/editor/editor"
import { EditorContext, editorStore } from "./stores"

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <EditorContext.Provider value={editorStore}>
                <Editor />
            </EditorContext.Provider>
        </MantineProvider>
    )
}
