import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgInvertMd({ width = 20, height = 20, color }: IconProps) {
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
                d="M1,18l1,1l17,-17l-1,-1l-17,17Z"
            />
            <path
                fill={color ?? "currentColor"}
                d="M3.046,13.954c-0.666,-1.166 -1.046,-2.516 -1.046,-3.954c0,-4.415 3.585,-8 8,-8c1.438,-0 2.788,0.38 3.954,1.046l-10.908,10.908Zm13.152,-7.209l0.736,-0.736c0.678,1.175 1.066,2.538 1.066,3.991c-0,4.415 -3.585,8 -8,8c-1.453,0 -2.816,-0.388 -3.991,-1.066l0.736,-0.736c0.973,0.512 2.08,0.802 3.255,0.802c3.863,0 7,-3.137 7,-7c-0,-1.175 -0.29,-2.282 -0.802,-3.255Z"
            ></path>
        </svg>
    )
}

export const InvertMd = memo(SvgInvertMd)
