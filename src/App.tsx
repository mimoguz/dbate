import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.layer.css"
import { Editor } from "./pages/editor/editor"
import { theme } from "./theme"
import { DataContext, dataStore } from "./stores"

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <DataContext.Provider value={dataStore}>
                <Editor />
            </DataContext.Provider>
        </MantineProvider>
    )
}
