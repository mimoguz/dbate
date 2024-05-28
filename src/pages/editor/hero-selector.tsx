import { Button, Group, Input, Modal, Select, Slider, Stack, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { observer } from "mobx-react-lite"
import React from "react"
import { bitmap } from "../../drawing"
import { HeroContext } from "../../stores"

export const HeroSelector = observer((): JSX.Element => {
    const heroStore = React.useContext(HeroContext)
    const [addOpened, { open: addOpen, close: addClose }] = useDisclosure(false)
    const [confirmOpened, { open: confirmOpen, close: confirmClose }] = useDisclosure(false)
    const [name, setName] = React.useState("")
    const [width, setWidth] = React.useState(24)
    const [height, setHeight] = React.useState(24)
    const target = React.useRef<string | undefined>(undefined)

    const handleHeroChange = (name: string | null | undefined) => {
        if (!heroStore.currentHero?.edited) {
            heroStore.selectHero(name ?? undefined)
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
            heroStore.createHero(name, bitmap.empty(width, height)).then(error => {
                if (error) return
                if (heroStore.currentHero?.edited) {
                    target.current = name
                    confirmOpen()
                } else {
                    heroStore.selectHero(name)
                }
            })
            setName("")
        },
        [addClose, confirmOpen, height, name, heroStore, width]
    )

    const confirmLoad = React.useCallback(
        () => {
            confirmClose()
            heroStore.selectHero(target.current)
        },
        [confirmClose, heroStore, target]
    )

    const saveThenLoad = React.useCallback(
        () => {
            confirmClose()
            heroStore.writeLogo().then(() => { heroStore.selectHero(target.current) })
        },
        [confirmClose, heroStore, target]
    )

    return (
        <>
            <Group>
                <Select
                    data={heroStore.heroes.map(it => it.name)}
                    value={heroStore.currentHero?.name}
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
                        ? <Text>Hero {heroStore.currentHero?.name} has unsaved changes. Do you want to load {target.current} anyway?</Text>
                        : <Text>Hero {heroStore.currentHero?.name} has unsaved changes. Do you want to leave anyway?</Text>
                    }
                    <Text fw={600}>Unsaved changes will be lost.</Text>
                    <Group>
                        <Button onClick={confirmClose}>No, keep {heroStore.currentHero?.name}</Button>
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
})