import React from "react"
import { DataContext } from "../../stores"
import { Button, Group } from "@mantine/core"
import { Bitmap, bitmap } from "../../drawing"

const download = (bmp: Bitmap, name: string) => {
    bitmap.dataURL(bmp).then(dataURL => {
        const elem = document.createElement("a")
        elem.href = dataURL
        elem.download = `${name}.png`
        document.body.appendChild(elem)
        elem.click()
        document.body.removeChild(elem)
    })
}

export const HeroActionGroup = (): JSX.Element => {
    const store = React.useContext(DataContext)

    const handleDownload = React.useCallback(
        () => { if (store.currentHero) download(store.currentHero.logo, store.currentHero.name) },
        [store.currentHero]
    )

    return (
        <Group>
            <Button
                onClick={() => store.writeLogo()}
                disabled={!store.currentHero?.edited}
            >
                Apply changes
            </Button>
            <Button disabled={store.currentHero === undefined} onClick={handleDownload}>Download logo</Button>
        </Group>
    )
}