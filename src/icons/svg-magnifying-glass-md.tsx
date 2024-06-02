import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgMagnifyingGlassMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="m6.969 12.031 1.319-1.319A5.966 5.966 0 0 1 7 7c0-3.311 2.689-6 6-6s6 2.689 6 6-2.689 6-6 6a5.966 5.966 0 0 1-3.712-1.288l-1.319 1.319a1 1 0 0 1-.176 1.176l-4.586 4.586a1 1 0 0 1-1.414 0l-.586-.586a1 1 0 0 1 0-1.414l4.586-4.586a1 1 0 0 1 1.176-.176ZM13 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5Z"
            />
            <circle fill={color ?? "currentColor"} fillOpacity="0.5" cx="13" cy="7" r="4" />
        </svg>
    )
}

export const MagnifyingGlassMd = memo(SvgMagnifyingGlassMd)
