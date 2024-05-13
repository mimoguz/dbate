import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgMagnifyingGlassSm({
    width = 16,
    height = 16,
    color,
}: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M6,9c-0.628,-0.836 -1,-1.875 -1,-3c0,-2.76 2.24,-5 5,-5c2.76,0 5,2.24 5,5c0,2.76 -2.24,5 -5,5c-1.125,0 -2.164,-0.372 -3,-1l-5.5,5.5l-1,-1l5.5,-5.5Zm4,-7c-2.208,0 -4,1.792 -4,4c0,2.208 1.792,4 4,4c2.208,0 4,-1.792 4,-4c0,-2.208 -1.792,-4 -4,-4Z"
            ></path>
            <circle cx="10" cy="6" r="3" fill={color ?? "currentColor"} fillOpacity={0.5} />
        </svg>
    )
}

export const MagnifyingGlassSm = memo(SvgMagnifyingGlassSm)
