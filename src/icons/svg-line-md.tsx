import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgLineMd({ width = 20, height = 20, color }: IconProps) {
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
                d="M3.5,14c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.38,-0 -2.5,-1.12 -2.5,-2.5c-0,-1.38 1.12,-2.5 2.5,-2.5Zm0,2c-0.276,-0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5c0.276,0 0.5,-0.224 0.5,-0.5c-0,-0.276 -0.224,-0.5 -0.5,-0.5Zm13,-15c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.38,0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.12,-2.5 2.5,-2.5Zm0,2c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5c0.276,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                d="M5.494,13.506l1,1l8.023,-8.023l-1,-1l-8.023,8.023Z"
            />
        </svg>
    )
}

export const LineMd = memo(SvgLineMd)
