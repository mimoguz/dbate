import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgEraserMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M4,17l12,-12l0,2.757c-0,0.796 -0.316,1.559 -0.879,2.122l-7.121,7.121l-4,0Zm-0,-2l0,-2.757c0,-0.796 0.316,-1.559 0.879,-2.122l8.845,-8.845c0.382,-0.382 0.955,-0.496 1.453,-0.289c0.498,0.206 0.823,0.692 0.823,1.231l0,0.782l-12,12Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M19,18l0,1l-18,0l0,-1l18,0Zm0,-2l0,1l-9.5,0l1,-1l8.5,0Z"
            ></path>
        </svg>
    )
}

export const EraserMd = memo(SvgEraserMd)
