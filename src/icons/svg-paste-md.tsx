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
                d="M15 4a2 2 0 0 1 2 2v4.5L14.5 8H8v10H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10Zm-2 5h1l3 3v1h-4V9Z"
            />
            <path fill={color ?? "currentColor"} d="M14 7H6V5h2V3a2 2 0 0 1 4 0v2h2v2Zm-4-5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm7 10v6H9V9h5v3h3Z" />
        </svg>
    )
}

export const PasteMd = memo(SvgPasteMd)
