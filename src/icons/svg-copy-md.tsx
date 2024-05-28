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
            <path fill={color ?? "currentColor"} fillOpacity="0.5" d="M6 16h7v2H3V5h3v11Zm6-14h1l4 4v1h-5V2Z" />
            <path fill={color ?? "currentColor"} d="M17 6v9H7V2h6v4h4Z" />
        </svg>
    )
}

export const CopyMd = memo(SvgCopyMd)
