import { Button, Group, Input, Modal, Select, Slider, Stack, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React from "react"
import { bitmap } from "../../drawing"
import { DataContext } from "../../stores"

export const HeroSelector = (): JSX.Element => {
    const store = React.useContext(DataContext)
    const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false)
    const [confirmOpened, { open: confirmOpen, close: confirmClose }] = useDisclosure(false)
    const [name, setName] = React.useState("")
    const [width, setWidth] = React.useState(24)
    const [height, setHeight] = React.useState(24)
    const target = React.useRef<string | undefined>(undefined)

    const handleHeroChange = (name: string | null | undefined) => {
        if (!store.currentHero?.edited) {
            store.selectHero(name ?? undefined)
        } else {
            if (name) {
                target.current = name
                confirmOpen()
            }
        }
    }

    const handleNameChange: React.ChangeEventHandler<HTMLInputElement> = e => setName(e.target.value)

    const addHero = React.useCallback(
        () => {
            addClose()
            store.createHero(name, bitmap.empty(width, height)).then(error => {
                if (error) return
                if (store.currentHero?.edited) {
                    target.current = name
                    confirmOpen()
                } else {
                    store.selectHero(name)
                }
            })
            setName("")
        },
        [addClose, confirmOpen, height, name, store, width]
    )

    const confirmLoad = React.useCallback(
        () => {
            confirmClose()
            store.selectHero(target.current)
        },
        [confirmClose, store, target]
    )

    const saveThenLoad = React.useCallback(
        () => {
            confirmClose()
            store.writeLogo().then(() => { store.selectHero(target.current) })
        },
        [confirmClose, store, target]
    )

    return (
        <>
            <Group>
                <Select
                    data={store.heroes.map(it => it.name)}
                    value={store.currentHero?.name}
                    onChange={handleHeroChange}
                    placeholder="Select hero to edit"
                    comboboxProps={{ shadow: 'md' }}
                />
                <Button onClick={addOpen} disabled={addOpened}>Add new hero</Button>
            </Group>

            {/* Add hero dialog */}
            <Modal title="Add New Hero" opened={addOpened} withCloseButton onClose={addClose}>
                <Stack>
                    <TextInput label="Hero name" value={name} onChange={handleNameChange} />
                    <Input.Wrapper label="Logo width">
                        <Slider min={1} max={50} value={width} onChange={setWidth} labelAlwaysOn />
                    </Input.Wrapper>
                    <Input.Wrapper label="Logo height">
                        <Slider min={1} max={50} value={height} onChange={setHeight} labelAlwaysOn />
                    </Input.Wrapper>
                    <Group>
                        <Button onClick={addHero} disabled={name.trim() === ""}>Add</Button>
                        <Button color="red" onClick={addClose}>Cancel</Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Confirmation dialog */}
            <Modal title="Confirm Hero Change" opened={confirmOpened} withCloseButton onClose={confirmClose} size="lg">
                <Stack>
                    {target.current
                        ? <Text>Hero {store.currentHero?.name} has unsaved changes. Do you want to load {target.current} anyway?</Text>
                        : <Text>Hero {store.currentHero?.name} has unsaved changes. Do you want to leave anyway?</Text>
                    }
                    <Text fw={600}>Unsaved changes will be lost.</Text>
                    <Group>
                        <Button onClick={confirmClose}>No, keep {store.currentHero?.name}</Button>
                        <Button onClick={saveThenLoad}>
                            {target.current
                                ? <>Save first, then load {target.current}</>
                                : <>Save first, then leave</>
                            }
                        </Button>
                        <Button color="red" onClick={confirmLoad}>
                            {target.current
                                ? <>Yes, load {target.current}</>
                                : <>Yes, leave</>
                            }
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    )
}