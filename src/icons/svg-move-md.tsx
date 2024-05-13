import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgMoveMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M9,11l-4,0l0,3l-4,-4.049l4,-3.951l0,3l4,0l0,-4l-3,0l3.951,-4l4.049,4l-3,0l0,4l4,0l0,-3l4,3.951l-4,4.049l0,-3l-4,0l0,4l3,0l-4.049,4l-3.951,-4l3,0l0,-4Z"
            ></path>
        </svg>
    )
}

export const MoveMd = memo(SvgMoveMd)
