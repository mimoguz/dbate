export const copyToClipboard = async (json: string): Promise<void> => {
    await navigator.clipboard.writeText(json)
}

export const pasteFromClipboard = async (): Promise<string> => {
    return await navigator.clipboard.readText()
}
