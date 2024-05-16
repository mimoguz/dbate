import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgFlipHorizontalMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path fill={color ?? "currentColor"} d="M11 2v16h7L11 2Z" />
            <path fill={color ?? "currentColor"} fillOpacity="0.5" d="M9 2v16H2L9 2Z" />
        </svg>
    )
}

export const FlipHorizontalMd = memo(SvgFlipHorizontalMd)
