import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgPasteMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M15 4a2 2 0 0 1 2 2v5.5L15.5 10H9v8H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3l2 2 2-2h3Zm-1 7h1l3 3v1h-4v-4Z"
            />
            <path fill={color ?? "currentColor"} d="M7 4a3.001 3.001 0 0 1 6 0v5H7V4Zm3-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm8 11v5h-8v-8h5v3h3Z" />
        </svg>
    )
}

export const PasteMd = memo(SvgPasteMd)
