import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgEditMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            fill={color ?? "currentColor"}
        >
            <path d="m5.5 11.5 3 3L4 16l1.5-4.5Zm9-9 1.083-1.083a2.001 2.001 0 0 1 2.831.003l.171.172a1.999 1.999 0 0 1-.002 2.825L17.5 5.5l-3-3Zm-1-.5-1 1H3v14h14V7.5l1-1V18H2V2h11.5Z" />
            <path fillOpacity="0.5" d="m6.5 10.5 3 3 7-7-3-3-7 7Z" />
        </svg>
    )
}

export const EditMd = memo(SvgEditMd)
