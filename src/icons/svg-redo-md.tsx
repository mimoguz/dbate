import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgRedoMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="m16.007 5.945-3.084 3.084L19.951 9V2l-3.234 3.234a7.484 7.484 0 0 0-5.766-2.705c-4.139 0-7.5 3.36-7.5 7.5a7.502 7.502 0 0 0 13.996 3.75l-.866-.5a6.502 6.502 0 0 1-5.63 3.25 6.504 6.504 0 0 1-6.5-6.5c0-3.588 2.913-6.5 6.5-6.5 2.041 0 3.864.942 5.056 2.416Z"
            />
        </svg>
    )
}

export const RedoMd = memo(SvgRedoMd)
