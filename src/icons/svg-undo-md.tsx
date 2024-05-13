import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgUndoMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M4.945,5.916l3.084,3.084l-7.029,-0.029l0,-7l3.234,3.235c1.376,-1.653 3.449,-2.706 5.766,-2.706c4.139,0 7.5,3.361 7.5,7.5c0,4.139 -3.361,7.5 -7.5,7.5c-2.774,0 -5.198,-1.509 -6.495,-3.75l0.866,-0.5c1.124,1.942 3.225,3.25 5.629,3.25c3.587,-0 6.5,-2.913 6.5,-6.5c0,-3.587 -2.913,-6.5 -6.5,-6.5c-2.041,-0 -3.863,0.943 -5.055,2.416Z"
            ></path>
        </svg>
    )
}

export const UndoMd = memo(SvgUndoMd)
