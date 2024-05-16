import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgRotateCounterClockwiseMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M7 2v16H2V2h5Zm3.672 14.328L13 14v5H8l1.965-1.965A4.98 4.98 0 0 1 8.5 13.5c0-2.76 2.24-5 5-5s5 2.24 5 5a5 5 0 0 1-2.5 4.33l-.433.25-.5-.866.433-.25a3.998 3.998 0 0 0-2-7.464 4.001 4.001 0 0 0-2.828 6.828Z"
            />
            <path fill={color ?? "currentColor"} fillOpacity="0.5" d="M8 2h10v5H8z" />
        </svg>
    )
}

export const RotateCounterClockwiseMd = memo(SvgRotateCounterClockwiseMd)
