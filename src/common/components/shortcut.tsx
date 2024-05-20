export interface Shortcut {
    mod?: "mod" | "alt";
    shift?: boolean;
    sKey: string | number;
}

export const hotkey = ({ mod, shift, sKey }: Shortcut) => `${mod ? `${mod === "mod" ? "ctrl/⌘" : mod}+` : ""}${shift ? "shift+" : ""}${sKey}`;
