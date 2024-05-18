import { ActionGroupItem } from "../../common/components";
import * as i from "../../icons";
import { Bitmap } from "../../schema";
import { transforms } from "../../transforms";

type Item = Pick<ActionGroupItem, "icon" | "accessibleLabel" | "key">

export const editorTransformItems: Array<{ item: Item, transformAction: (bmp: Bitmap) => Bitmap }> = [
    {
        item: {
            icon: <i.FlipHorizontalMd />,
            accessibleLabel: "Flip horizontal",
            key: "flip-horizontal",
        },
        transformAction: transforms.flipHorizontal,
    },
    {
        item: {
            icon: <i.FlipVerticalMd />,
            accessibleLabel: "Flip vertical",
            key: "flip-vertical",
        },
        transformAction: transforms.flipVertical,
    },
    {
        item: {
            icon: <i.RotateClockwiseMd />,
            accessibleLabel: "Rotate clockwise",
            key: "rotate-cw",
        },
        transformAction: transforms.rotateClockwise,
    },
    {
        item: {
            icon: <i.RotateCounterClockwiseMd />,
            accessibleLabel: "Rotate counter-clockwise",
            key: "rotate-ccw",
        },
        transformAction: transforms.rotateCounterClockwise,
    },
    {
        item: {
            icon: <i.InvertMd />,
            accessibleLabel: "Invert colors",
            key: "invert",
        },
        transformAction: transforms.invert,
    },
];

