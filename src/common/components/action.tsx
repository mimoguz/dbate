import { ActionIcon, MantineSize, Tooltip } from "@mantine/core";
import React from "react";
import { ReactNode } from "react";

interface Props {
    icon: ReactNode
    tooltip: ReactNode
    onAction: () => void,
    disabled?: boolean
    size?: MantineSize
}

export const Action = ({ icon, tooltip, onAction, disabled, size }: Props): JSX.Element => {
    const id = React.useId()
    return (
        <Tooltip label={tooltip} id={id}>
            <ActionIcon
                aria-labelledby={id}
                size={size}
                disabled={disabled}
                onClick={onAction}
            >
                {icon}
            </ActionIcon>
        </Tooltip>
    )
}