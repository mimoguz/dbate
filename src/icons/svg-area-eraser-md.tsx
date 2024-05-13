import { memo } from "react"
import { IconProps } from "./svg-props"

export function SvgAreaEraserMd({ width = 20, height = 20, color }: IconProps) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill={color ?? "currentColor"}
                d="M12,9.509l0,-1.695c0,-0.53 0.211,-1.039 0.586,-1.414l5.275,-5.261c0.191,-0.191 0.478,-0.248 0.727,-0.145c0.249,0.103 0.412,0.347 0.412,0.616l-0,0.89l-7,7.009Zm7,-6.009l-0,1.614c0,0.531 -0.211,1.039 -0.586,1.414l-5.275,5.262c-0.191,0.191 -0.478,0.248 -0.727,0.145c-0.25,-0.104 -0.412,-0.347 -0.412,-0.617l0,-0.832l7,-6.986Z"
            ></path>
            <path
                fill={color ?? "currentColor"}
                fillOpacity="0.5"
                d="M13,13c0,0.355 -0.031,0.704 -0.09,1.042l-0.985,-0.173c0.049,-0.282 0.075,-0.573 0.075,-0.869l1,0Zm-11.91,1.042c-0.059,-0.338 -0.09,-0.687 -0.09,-1.042c0,-0.355 0.031,-0.704 0.09,-1.042l0.985,0.173c-0.049,0.282 -0.075,0.573 -0.075,0.869c0,0.296 0.026,0.587 0.075,0.869l-0.985,0.173Zm1.314,-4.898l0.766,0.643c-0.372,0.443 -0.668,0.95 -0.87,1.503l-0.939,-0.342c0.242,-0.664 0.597,-1.273 1.043,-1.804Zm2.544,-1.783l0.342,0.939c-0.553,0.202 -1.06,0.498 -1.503,0.87l-0.643,-0.766c0.531,-0.446 1.14,-0.801 1.804,-1.043Zm3.094,-0.271l-0.173,0.985c-0.282,-0.049 -0.573,-0.075 -0.869,-0.075c-0.296,0 -0.587,0.026 -0.869,0.075l-0.173,-0.985c0.338,-0.059 0.687,-0.09 1.042,-0.09c0.355,0 0.704,0.031 1.042,0.09Zm2.814,1.314l-0.643,0.766c-0.443,-0.372 -0.95,-0.668 -1.503,-0.87l0.342,-0.939c0.664,0.242 1.273,0.597 1.804,1.043Zm0.74,8.452l-0.766,-0.643c0.372,-0.443 0.668,-0.95 0.87,-1.503l0.939,0.342c-0.242,0.664 -0.597,1.273 -1.043,1.804Zm-2.544,1.783l-0.342,-0.939c0.553,-0.202 1.06,-0.498 1.503,-0.87l0.643,0.766c-0.531,0.446 -1.14,0.801 -1.804,1.043Zm-3.094,0.271l0.173,-0.985c0.282,0.049 0.573,0.075 0.869,0.075c0.296,0 0.587,-0.026 0.869,-0.075l0.173,0.985c-0.338,0.059 -0.687,0.09 -1.042,0.09c-0.355,-0 -0.704,-0.031 -1.042,-0.09Zm-2.814,-1.314l0.643,-0.766c0.443,0.372 0.95,0.668 1.503,0.87l-0.342,0.939c-0.664,-0.242 -1.273,-0.597 -1.804,-1.043Zm-1.783,-2.544l0.939,-0.342c0.202,0.553 0.498,1.06 0.87,1.503l-0.766,0.643c-0.446,-0.531 -0.801,-1.14 -1.043,-1.804Z"
            ></path>
        </svg>
    )
}

export const AreaEraserMd = memo(SvgAreaEraserMd)