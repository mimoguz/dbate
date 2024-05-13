import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgBucketMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M3.514,11c0,0 2.5,4.275 2.5,5.6c0,1.325 -1.12,2.4 -2.5,2.4c-1.379,0 -2.5,-1.075 -2.5,-2.4c0,-1.325 2.5,-5.6 2.5,-5.6Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M4,8l7.5,-7.5l6.999,7.5l-14.499,0Z"
            />
            <path
                fill={color ?? "currentColor"}
                d="M19.051,9c0.031,0.14 0.047,0.285 0.047,0.431c-0.001,0.53 -0.212,1.039 -0.588,1.413l-4.169,4.158c-0.781,0.779 -2.046,0.778 -2.827,-0.002l-6,-6l13.537,-0Z"
            ></path>
        </svg>
    )
}

export const BucketMd = memo(SvgBucketMd)
