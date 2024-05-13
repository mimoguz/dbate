import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgMarkerHorizontalMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="m6.4 14.2 2 1-.9 1.8H5l1.4-2.8ZM11 18v1H1v-1h10Zm2.643-7.179L7.6 7.8 11 1h8l-5.357 9.821Z"
            />
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="m7 9 6 3-4 2-2-1V9Z"
            />
        </svg>
    )
}

export const MarkerHorizontalMd = memo(SvgMarkerHorizontalMd)

