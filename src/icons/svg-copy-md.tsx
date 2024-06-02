import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgCopyMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path fill={color ?? "currentColor"} fillOpacity="0.5" d="M6 15h7v4H2V6h4v9Zm7-14h1l4 4v1h-5V1Z" />
            <path fill={color ?? "currentColor"} d="M18 5v9H7V1h7v4h4Z" />
        </svg>
    )
}

export const CopyMd = memo(SvgCopyMd)
