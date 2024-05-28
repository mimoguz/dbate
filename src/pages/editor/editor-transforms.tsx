import { ActionGroupItem } from "../../common/components";
import { Bitmap } from "../../drawing";
import * as i from "../../icons";
import { transforms } from "../../transforms";

type Item = Omit<ActionGroupItem, "action">

export const editorTransformItems: Array<{ item: Item, transformAction: (bmp: Bitmap) => Bitmap }> = [
    {
        item: {
            icon: <i.FlipHorizontalMd />,
            accessibleLabel: "Flip horizontal",
            key: "flip-horizontal",
            shortcut: { mod: "alt", sKey: "H" },
        },
        transformAction: transforms.flipHorizontal,
    },
    {
        item: {
            icon: <i.FlipVerticalMd />,
            accessibleLabel: "Flip vertical",
            key: "flip-vertical",
            shortcut: { mod: "alt", sKey: "V" },
        },
        transformAction: transforms.flipVertical,
    },
    {
        item: {
            icon: <i.RotateClockwiseMd />,
            accessibleLabel: "Rotate clockwise",
            key: "rotate-cw",
            shortcut: { mod: "alt", sKey: "C" },
        },
        transformAction: transforms.rotateClockwise,
    },
    {
        item: {
            icon: <i.RotateCounterClockwiseMd />,
            accessibleLabel: "Rotate counter-clockwise",
            key: "rotate-ccw",
            shortcut: { mod: "alt", sKey: "W" },
        },
        transformAction: transforms.rotateCounterClockwise,
    },
    {
        item: {
            icon: <i.InvertMd />,
            accessibleLabel: "Invert colors",
            key: "invert",
            shortcut: { mod: "alt", sKey: "I" },
        },
        transformAction: transforms.invert,
    },
];

