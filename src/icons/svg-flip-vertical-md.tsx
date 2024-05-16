import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgFlipVerticalMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path fill={color ?? "currentColor"} d="M2 9h16V2L2 9Z" />
            <path fill={color ?? "currentColor"} fillOpacity="0.5" d="M2 11h16v7L2 11Z" />
        </svg>
    )
}

export const FlipVerticalMd = memo(SvgFlipVerticalMd)
