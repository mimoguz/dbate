import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgCheckerboardMd({
    width = 20,
    height = 20,
    color,
}: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M7.951,12l-3.975,0l-0,-4l4,0l-0,4l3.951,0l0,-4l-3.951,0l-0,-4l4,0l-0,4l3.951,0l0,4l-3.976,0l0,4l-4,0l0,-4Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M16.927,17l-13.951,0l-0,-14l13.951,-0l0,14Zm-1,-13l-11.951,0l-0,12l11.951,0l0,-12Z"
            ></path>
        </svg>
    )
}

export const CheckerboardMd = memo(SvgCheckerboardMd)
