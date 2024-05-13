import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgRectangleMd({ width = 20, height = 20, color }: IconProps) {
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
                d="M3.451,14c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.379,-0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.121,-2.5 2.5,-2.5Zm0,2c-0.276,-0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5c0.276,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5Zm13,-15c1.38,0 2.5,1.12 2.5,2.5c0,1.38 -1.12,2.5 -2.5,2.5c-1.379,0 -2.5,-1.12 -2.5,-2.5c0,-1.38 1.121,-2.5 2.5,-2.5Zm0,2c-0.276,0 -0.5,0.224 -0.5,0.5c0,0.276 0.224,0.5 0.5,0.5c0.276,0 0.5,-0.224 0.5,-0.5c0,-0.276 -0.224,-0.5 -0.5,-0.5Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                d="M3.951,4l0,9l-1,0l0,-10l10,0l0,1l-9,0Zm13,3l0,10l-10,0l0,-1l9,0l0,-9l1,0Z"
            ></path>
        </svg>
    )
}

export const RectangleMd = memo(SvgRectangleMd)
