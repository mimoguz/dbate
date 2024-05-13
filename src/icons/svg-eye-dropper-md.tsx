import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgEyeDropperMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="m1 18 1 1s1.994-.994 4-3l4-4-2.011-1.989-3.995 3.995C1.994 16.006 1 18 1 18Z"
            />
            <path
                fill={color ?? "currentColor"}
                d="M12.5 10.5a.707.707 0 0 1 .001.999l-.002.002a.707.707 0 0 1-.998 0L8.499 8.499a.707.707 0 0 1 0-.998l.002-.002A.707.707 0 0 1 9.5 7.5l1.174-1.174c.192-.192.307-.448.321-.719L11 5c0-2.208 1.792-4 4-4s4 1.792 4 4-1.792 4-4 4l-.611.007c-.269.016-.524.13-.715.321L12.5 10.5Z"
            />
        </svg>
    )
}

export const EyeDropperMd = memo(SvgEyeDropperMd)

