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
            <path fill={color ?? "currentColor"} fillOpacity="0.5" d="M6 15h7v3H3V6h3v9Zm6-13h1l4 4v1h-5V2Z" />
            <path fill={color ?? "currentColor"} d="M17 6v8H7V2h6v4h4Z" />
        </svg>
    )
}

export const CopyMd = memo(SvgCopyMd)
