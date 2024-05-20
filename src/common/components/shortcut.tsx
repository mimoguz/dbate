export interface Shortcut {
    mod?: "mod" | "alt";
    shift?: boolean;
    sKey: string | number;
}

export const hotkey = ({ mod, shift, sKey }: Shortcut) => `${mod ? `${mod}+` : ""}${shift ? "shift+" : ""}${sKey}`;
