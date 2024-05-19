import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.layer.css"
import { Editor } from "./pages/editor/editor"
import { theme } from "./theme"

export default function App() {
    return (
        <MantineProvider theme={theme}>
            <Editor />
        </MantineProvider>
    )
}
