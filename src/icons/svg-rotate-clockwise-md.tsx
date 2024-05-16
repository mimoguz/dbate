import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgRotateClockwiseMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M7 18V2H2v16h5Zm3.672-14.328L13 6V1H8l1.965 1.965A4.98 4.98 0 0 0 8.5 6.5c0 2.76 2.24 5 5 5s5-2.24 5-5A5 5 0 0 0 16 2.17l-.433-.25-.5.866.433.25a3.998 3.998 0 0 1-2 7.464 4.001 4.001 0 0 1-2.828-6.828Z"
            />
            <path fill={color ?? "currentColor"} fillOpacity="0.5" d="M8 13h10v5H8z" />
        </svg>
    )
}

export const RotateClockwiseMd = memo(SvgRotateClockwiseMd)
