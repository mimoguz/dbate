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
            <path fill={color ?? "currentColor"} fillOpacity="0.5" d="M5 15h9v3H2V6h3v9Zm8-13h1l4 4v1h-5V2Z" />
            <path fill={color ?? "currentColor"} d="M18 6v8H6V2h8v4h4Z" />
        </svg>
    )
}

export const CopyMd = memo(SvgCopyMd)
