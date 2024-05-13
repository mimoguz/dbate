import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgMarkerVerticalMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M14.2 6.4 17 5v2.5l-1.8.9-1-2ZM18 11V1h1v10h-1Zm-7.179 2.643L1 19v-8l6.8-3.4 3.021 6.043Z"
            />
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="m9 7 3 6 2-4-1-2H9Z"
            />
        </svg>
    )
}

export const MarkerVerticalMd = memo(SvgMarkerVerticalMd)

