const copyToClipboard = async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text)
}

const pasteFromClipboard = async (): Promise<string> => {
    return await navigator.clipboard.readText()
}

export const clipboard = {
    copy: copyToClipboard,
    paste: pasteFromClipboard
} as const
