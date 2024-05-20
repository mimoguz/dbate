import { ActionGroupItem } from "../../common/components";
import * as i from "../../icons";
import { Bitmap } from "../../schema";
import { transforms } from "../../transforms";

type Item = Omit<ActionGroupItem, "action">

export const editorTransformItems: Array<{ item: Item, transformAction: (bmp: Bitmap) => Bitmap }> = [
    {
        item: {
            icon: <i.FlipHorizontalMd />,
            accessibleLabel: "Flip horizontal",
            key: "flip-horizontal",
            shortcut: ["alt", "H"],
        },
        transformAction: transforms.flipHorizontal,
    },
    {
        item: {
            icon: <i.FlipVerticalMd />,
            accessibleLabel: "Flip vertical",
            key: "flip-vertical",
            shortcut: ["alt", "V"],
        },
        transformAction: transforms.flipVertical,
    },
    {
        item: {
            icon: <i.RotateClockwiseMd />,
            accessibleLabel: "Rotate clockwise",
            key: "rotate-cw",
            shortcut: ["alt", "C"],
        },
        transformAction: transforms.rotateClockwise,
    },
    {
        item: {
            icon: <i.RotateCounterClockwiseMd />,
            accessibleLabel: "Rotate counter-clockwise",
            key: "rotate-ccw",
            shortcut: ["alt", "W"],
        },
        transformAction: transforms.rotateCounterClockwise,
    },
    {
        item: {
            icon: <i.InvertMd />,
            accessibleLabel: "Invert colors",
            key: "invert",
            shortcut: ["alt", "I"],
        },
        transformAction: transforms.invert,
    },
];

