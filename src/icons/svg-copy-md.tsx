import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgCopyMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            fill={color ?? "currentColor"}
        >
            <path fillOpacity="0.5" d="M6 15h7v4H2V6h4v9Zm6-14h1l5 5v1h-6V1Z" />
            <path d="M18 6v8H7V1h6v5h5Z" />
        </svg>
    )
}

export const CopyMd = memo(SvgCopyMd)
