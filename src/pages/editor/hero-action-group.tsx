import { Button, Group } from "@mantine/core"
import { observer } from "mobx-react-lite"
import React from "react"
import { Bitmap, bitmap } from "../../drawing"
import { HeroContext } from "../../stores"

const download = (bmp: Bitmap, name: string) => {
    bitmap.dataURL(bmp).then(dataURL => {
        const element = document.createElement("a")
        element.href = dataURL
        element.download = `${name}.png`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
    })
}

export const HeroActionGroup = observer((): JSX.Element => {
    const heroStore = React.useContext(HeroContext)

    const handleDownload = React.useCallback(
        () => { if (heroStore.currentHero) download(heroStore.currentHero.logo, heroStore.currentHero.name) },
        [heroStore.currentHero]
    )

    return (
        <Group>
            <Button
                onClick={() => heroStore.writeLogo()}
                disabled={!heroStore.currentHero?.edited}
            >
                Apply changes
            </Button>
            <Button disabled={heroStore.currentHero === undefined} onClick={handleDownload}>Download logo</Button>
        </Group>
    )
})