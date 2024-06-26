import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgGearMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M3.168,8.472l-1.731,-1.387c0.377,-1.103 0.966,-2.123 1.732,-3.001l2.055,0.8c0.752,-0.702 1.659,-1.241 2.665,-1.559l0.33,-2.157c1.144,-0.224 2.321,-0.224 3.465,0l0.325,2.125c1.033,0.31 1.966,0.851 2.739,1.565l1.985,-0.774c0.767,0.878 1.355,1.898 1.733,3.001l-1.649,1.321c0.12,0.512 0.183,1.046 0.183,1.594c0,0.548 -0.063,1.082 -0.183,1.594l1.649,1.321c-0.378,1.103 -0.966,2.123 -1.733,3.001l-1.985,-0.774c-0.773,0.714 -1.706,1.255 -2.739,1.565l-0.325,2.125c-1.144,0.224 -2.321,0.224 -3.465,-0l-0.33,-2.157c-1.006,-0.318 -1.913,-0.857 -2.665,-1.559l-2.055,0.8c-0.766,-0.878 -1.355,-1.898 -1.732,-3.001l1.731,-1.387c-0.11,-0.492 -0.168,-1.003 -0.168,-1.528c0,-0.525 0.058,-1.036 0.168,-1.528Zm6.783,-3.472c-2.759,-0 -5,2.24 -5,5c0,2.76 2.241,5 5,5c2.76,-0 5,-2.24 5,-5c0,-2.76 -2.24,-5 -5,-5Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M9.951,6c2.208,-0 4,1.792 4,4c0,2.208 -1.792,4 -4,4c-2.207,-0 -4,-1.792 -4,-4c0,-2.208 1.793,-4 4,-4Zm0,2c-1.103,0 -2,0.896 -2,2c0,1.104 0.897,2 2,2c1.104,-0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2Z"
            ></path>
        </svg>
    )
}

export const GearMd = memo(SvgGearMd)
