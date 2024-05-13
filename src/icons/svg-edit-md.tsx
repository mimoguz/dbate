import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgEditMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M17 7v12H1V3h12l-1 1H2v14h14V8l1-1Zm-6.5.5 2.024 2.024L9.5 10.5l1-3ZM16 2l.5-.5c.552-.552 1.5-.5 2 0s.552 1.448 0 2L18 4l-2-2Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M9 11v6H3v-6h6Zm4.538-2.522L11.5 6.5 15 3l2 2-3.462 3.478Z"
            ></path>
        </svg>
    )
}

export const EditMd = memo(SvgEditMd)
