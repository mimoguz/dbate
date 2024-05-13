import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgPlusMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M9,11l-5,0l0,-2l5,0l-0,-5l2,0l0,5l5,0l0,2l-5,0l0,5l-2,0l-0,-5Z"
            />
        </svg>
    )
}

export const PlusMd = memo(SvgPlusMd)
