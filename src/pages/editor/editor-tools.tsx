import { ToolGroupItem } from "../../common/components";
import * as i from "../../icons";
import { ColorPickerTool, MoveTool, Tool, boundedTools, floodTools, freehandTools } from "../../tools";
import { NoopTool } from "../../tools/noop-tool";

type Item = Omit<ToolGroupItem<number>, "value">

const editorToolItems: Array<{ item: Item, factory: () => Tool }> = [
    {
        item: {
            icon: <i.LineMd />,
            accessibleLabel: "Draw line",
            shortcut: ["L"],
            key: "line",
        },
        factory: boundedTools.line,
    },
    {
        item: {
            icon: <i.RectangleMd />,
            accessibleLabel: "Draw rectangle",
            shortcut: ["R"],
            key: "rectangle",
        },
        factory: boundedTools.rectangle,
    },
    {
        item: {
            icon: <i.EllipseMd />,
            accessibleLabel: "Draw ellipse",
            shortcut: ["E"],
            key: "ellipse",
        },
        factory: boundedTools.ellipse,
    },
    {
        item: {
            icon: <i.PencilMd />,
            accessibleLabel: "Pencil",
            shortcut: ["P"],
            key: "pencil",
        },
        factory: freehandTools.pencil,
    },
    {
        item: {
            icon: <i.MarkerHorizontalMd />,
            accessibleLabel: "Horizontal marker",
            shortcut: ["H"],
            key: "marker-horizontal",
        },
        factory: freehandTools.markerPenHorizontal,
    },
    {
        item: {
            icon: <i.MarkerVerticalMd />,
            accessibleLabel: "Vertical marker",
            shortcut: ["V"],
            key: "marker-vertical",
        },
        factory: freehandTools.markerPenVertical,
    },
    {
        item: {
            icon: <i.BucketMd />,
            accessibleLabel: "Flood fill",
            shortcut: ["F"],
            key: "flood-fill",
        },
        factory: floodTools.bucket,
    },
    {
        item: {
            icon: <i.EyeDropperMd />,
            accessibleLabel: "Color picker",
            shortcut: ["C"],
            key: "color-picker",
        },
        factory: () => new ColorPickerTool(),
    },
    {
        item: {
            icon: <i.EraserMd />,
            accessibleLabel: "Eraser",
            shortcut: ["X"],
            key: "eraser",
        },
        factory: freehandTools.eraser,
    },
    {
        item: {
            icon: <i.AreaEraserMd />,
            accessibleLabel: "Area eraser",
            shortcut: ["A"],
            key: "flood-erase",
        },
        factory: floodTools.eraser,
    },
    {
        item: {
            icon: <i.MoveMd />,
            accessibleLabel: "Move",
            shortcut: ["M"],
            key: "move",
        },
        factory: () => new MoveTool(),
    },
];

export const editorTools: Array<ToolGroupItem<number>> = editorToolItems.map((tool, index) => ({
    ...tool.item,
    value: index,
}));

export const createTool = (index: number): Tool => (editorToolItems.at(index)?.factory ?? (() => new NoopTool()))();
