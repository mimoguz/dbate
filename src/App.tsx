import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.layer.css"
import { Editor } from "./pages/editor/editor"
import { theme } from "./theme"
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
