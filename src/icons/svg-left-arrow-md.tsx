import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgLeftArrowMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M11.95,4l-0,12l-5.95,-6.05l5.95,-5.95Z"
            />
        </svg>
    )
}

export const LeftArrowMd = memo(SvgLeftArrowMd)
