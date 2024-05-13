import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgPencilMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M2.5,14.5l3,3l-4.5,1.5l1.5,-4.5Zm12,-12l1.083,-1.083c0.376,-0.376 0.885,-0.586 1.416,-0.586c0.531,0.001 1.04,0.213 1.415,0.589l0.171,0.172c0.779,0.781 0.778,2.045 -0.002,2.825l-1.083,1.083l-3,-3Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M3.5,13.5l3,3l10,-10l-3,-3l-10,10Z"
            />
        </svg>
    )
}

export const PencilMd = memo(SvgPencilMd)
