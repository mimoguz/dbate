import React from "react"
import { Bitmap } from "../drawing"

export interface ClipboardOps {
    copyImage(bmp: Bitmap): void
    pasteImage(): Bitmap | undefined
    get hasImage(): boolean
}

export class InternalClipboard implements ClipboardOps {

    private image?: Bitmap

    get hasImage(): boolean {
        return this.image !== undefined
    }

    copyImage(bmp: Bitmap): void {
        this.image = bmp
    }
    pasteImage(): Bitmap | undefined {
        return this.image
    }
}

export const ClipboardContext = React.createContext<ClipboardOps>(new InternalClipboard())
