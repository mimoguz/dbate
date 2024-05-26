import { Button, Group, Input, Modal, Select, Slider, Stack, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React, { useCallback, useState } from "react"
import { bitmap } from "../../drawing"
import { DataContext } from "../../stores"

interface Props {
    value: string | undefined
    onChange: (value: string | undefined) => void
}

export const HeroSelector = ({ value, onChange }: Props): JSX.Element => {
    const store = React.useContext(DataContext)
    const [opened, { open, close }] = useDisclosure(false)
    const [name, setName] = useState("")
    const [width, setWidth] = useState(24)
    const [height, setHeight] = useState(24)
    const handleHeroChange = (name: string | null | undefined) => onChange(name ?? undefined)
    const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = e => setName(e.target.value)
    const addHero = useCallback(
        () => {
            store.createHero(name, bitmap.empty(width, height)).then(error => {
                if (!error) store.selectHero(name)
            })
            setName("")
            close()
        },
        [close, height, name, store, width]
    )

    return (
        <>
            <Group>
                <Select
                    data={store.heroes.map(it => it.name)}
                    value={value}
                    onChange={handleHeroChange}
                    placeholder="Select hero to edit"
                    comboboxProps={{ shadow: 'md' }}
                />
                <Button onClick={open} disabled={opened}>Add new hero</Button>
            </Group>
            <Modal opened={opened} withCloseButton onClose={close} size="lg" radius="md">
                <Stack>
                    <TextInput label="Hero name" value={name} onChange={handleNameChange} />
                    <Input.Wrapper label="Logo width">
                        <Slider min={1} max={50} value={width} onChange={setWidth} />
                    </Input.Wrapper>
                    <Input.Wrapper label="Logo height">
                        <Slider min={1} max={50} value={height} onChange={setHeight} />
                    </Input.Wrapper>
                    <Group>
                        <Button onClick={addHero} disabled={name.trim() === ""}>Add</Button>
                        <Button color="red">Cancel</Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    )
}