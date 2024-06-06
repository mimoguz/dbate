import {
    ActionIcon,
    Button,
    CheckIcon,
    Checkbox,
    ColorInput,
    ColorSwatch,
    Group,
    Popover,
    Space,
    Stack,
    TextInput,
    Tooltip
} from "@mantine/core"
import { observer } from "mobx-react-lite"
import React from "react"
import { Action } from "../../common/components"
import { toCSSValue } from "../../drawing"
import { EditMd, PlusMd } from "../../icons"
import { ColorsContext } from "../../stores"
import classes from "./colors.module.css"

export const Colors = observer((): JSX.Element => {
    const colorStore = React.useContext(ColorsContext)
    const [color, setColor] = React.useState("#000000FF")
    return (
        <Stack p="sm">
            <Group gap="sm">
                <ColorInput value={color} onChange={setColor} format="hexa" />
                <Action
                    icon={<PlusMd />}
                    tooltip="Add color"
                    onAction={() => colorStore.add(color)}
                    disabled={!colorStore.canAdd}
                />
            </Group>
            <Space h="sm" />
            <div className={classes.tableParent}>
                <table className={classes.colorTable}>
                    <thead>
                        <th className={classes.defaultFill}>Default Fill</th>
                        <th className={classes.index}>Index</th>
                        <th className={classes.name}>Name</th>
                        <th className={classes.value}>Value</th>
                        <th className={classes.action}></th>
                    </thead>
                    <tbody>
                        {colorStore.colorTable.map((color) => {
                            const hex = toCSSValue(color)
                            return (
                                <tr key={color.index} className={color.index === colorStore.defaultFill ? classes.defaultFill : undefined}>
                                    <td>
                                        {color.index === colorStore.defaultFill
                                            ? <CheckIcon size={12} />
                                            : null
                                        }
                                    </td>
                                    <td><div>{color.index}</div></td>
                                    <td className={classes.name}><div>{color.name}</div></td>
                                    <td>
                                        <div className={classes.group}>
                                            <ColorSwatch color={hex} />
                                            {hex}
                                        </div>
                                    </td>
                                    <td>
                                        <Popover withArrow shadow="sm" arrowSize={10}>
                                            <Popover.Target>
                                                <Tooltip label="Edit item">
                                                    <ActionIcon><EditMd /></ActionIcon>
                                                </Tooltip>
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <ColorEditor index={color.index} />
                                            </Popover.Dropdown>
                                        </Popover>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </Stack>
    )
})

const ColorEditor = observer(({ index }: { index: number, }): JSX.Element => {
    const store = React.useContext(ColorsContext)
    const [cValue, setValue] = React.useState("")
    const [cName, setName] = React.useState("")
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => setName(e.target.value)
    const handleApply = React.useCallback(
        () => {
            store.update(index, { name: cName, value: cValue })
            if (check.current?.checked) store.setDefaultFill(index)
        },
        [cName, cValue, index, store]
    )
    const check = React.useRef<HTMLInputElement>(null)

    React.useEffect(
        () => {
            const item = store.colorTable[index]
            setName(item.name)
            setValue(toCSSValue(item))
        },
        [store.colorTable, index]
    )

    return (
        <Stack gap="sm">
            <TextInput value={cName} onChange={handleChange} label="Name" maxLength={100} />
            <ColorInput
                popoverProps={{
                    withinPortal: false,
                    position: "left",
                    withArrow: true,
                    arrowSize: 10,
                    shadow: "md",
                }}
                format="hexa" value={cValue}
                onChange={setValue}
                label="Value"
            />
            <Checkbox label="Default fill" defaultChecked={index === store.defaultFill} ref={check} />
            <Button onClick={() => handleApply()}>Apply</Button>
        </Stack>
    )
})