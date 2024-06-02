import { ActionIcon, MantineSize, Tooltip } from "@mantine/core";
import React from "react";
import { ReactNode } from "react";

interface Props {
    selected: boolean
    icon: ReactNode
    tooltip: ReactNode
    onChange: (value: boolean) => void,
    disabled?: boolean
    size?: MantineSize
}

export const ToggleAction = ({ selected, icon, tooltip, onChange, disabled, size }: Props): JSX.Element => {
    const id = React.useId()
    const handleClick = React.useCallback(() => onChange(!selected), [onChange, selected])
    return (
        <Tooltip label={tooltip} id={id}>
            <ActionIcon
                aria-labelledby={id}
                size={size}
                variant={selected ? "filled" : undefined}
                color={selected ? "green" : undefined}
                disabled={disabled}
                onClick={handleClick}
            >
                {icon}
            </ActionIcon>
        </Tooltip>
    )
}