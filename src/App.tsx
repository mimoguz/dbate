import "@mantine/core/styles.css"
import { MantineProvider } from "@mantine/core"
import { theme } from "./theme"
import { Editor } from "./pages/editor/editor"

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <Editor />
        </MantineProvider>
    )
}
