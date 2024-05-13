import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgTrashMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M18,5l-16,-0l-0,-0.18c0,-0.477 0.336,-0.887 0.804,-0.981l4.196,-0.839l-0,-1c-0,-0.552 0.448,-1 1,-1l4,-0c0.552,-0 1,0.448 1,1l-0,1l4.196,0.839c0.468,0.094 0.804,0.504 0.804,0.981l0,0.18Zm-6,-2l-0,-1l-4,0l0,1l4,-0Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M3,6l14,-0l-0.858,11.153c-0.08,1.042 -0.949,1.847 -1.994,1.847l-8.296,-0c-1.045,-0 -1.914,-0.805 -1.994,-1.847l-0.858,-11.153Zm3,3l-0,7c0,0.552 0.448,1 1,1c0.552,-0 1,-0.448 1,-1l-0,-7c0,-0.552 -0.448,-1 -1,-1c-0.552,-0 -1,0.448 -1,1Zm6,0l-0,7c-0,0.552 0.448,1 1,1c0.552,0 1,-0.448 1,-1l-0,-7c-0,-0.552 -0.448,-1 -1,-1c-0.552,0 -1,0.448 -1,1Z"
            ></path>
        </svg>
    )
}

export const TrashMd = memo(SvgTrashMd)
