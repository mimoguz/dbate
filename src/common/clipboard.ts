import React from "react"
import { BitmapImage } from "../drawing"
import { makeAutoObservable } from "mobx"

export interface ClipboardOps {
    copyImage(bmp: BitmapImage): void
    pasteImage(): BitmapImage | undefined
    get hasImage(): boolean
}

export class InternalClipboard implements ClipboardOps {
    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    private image?: BitmapImage

    get hasImage(): boolean {
        return this.image !== undefined
    }

    copyImage(bmp: BitmapImage): void {
        this.image = bmp
    }
    pasteImage(): BitmapImage | undefined {
        return this.image
    }
}

export const ClipboardContext = React.createContext<ClipboardOps>(new InternalClipboard())
