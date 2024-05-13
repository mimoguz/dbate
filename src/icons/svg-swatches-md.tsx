import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgSwatchesMd({ width = 20, height = 20, color }: IconProps) {
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
                d="M14.815,6l2.943,5.098l-8.83,5.098l5.887,-10.196Zm-5.815,-3.702l5.098,2.944l-5.098,8.83l-0,-11.774Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                d="M8,2l0,13c-0,1.657 -1.343,3 -3,3c-1.657,-0 -3,-1.343 -3,-3l0,-13l6,0Zm-3,12c-0.552,0 -1,0.448 -1,1c0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1c0,-0.552 -0.448,-1 -1,-1Z"
            ></path>
        </svg>
    )
}

export const SwatchesMd = memo(SvgSwatchesMd)
