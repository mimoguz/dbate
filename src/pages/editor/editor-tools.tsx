import { Text } from "@mantine/core";
import { ToolGroupItem } from "../../common/components";
import * as i from "../../icons";
import { ColorPickerTool, MoveTool, Tool, boundedTools, floodTools, freehandTools } from "../../tools";
import { NoopTool } from "../../tools/noop-tool";

type Item = Pick<ToolGroupItem<number>, "icon" | "accessibleLabel" | "key">

const editorToolItems: Array<{ item: Item, factory: () => Tool }> = [
    {
        item: {
            icon: <i.LineMd />,
            accessibleLabel: "Draw line",
            key: "line",
        },
        factory: boundedTools.line,
    },
    {
        item: {
            icon: <i.RectangleMd />,
            accessibleLabel: "Draw rectangle",
            key: "rectangle",
        },
        factory: boundedTools.rectangle,
    },
    {
        item: {
            icon: <i.EllipseMd />,
            accessibleLabel: "Draw ellipse",
            key: "ellipse",
        },
        factory: boundedTools.ellipse,
    },
    {
        item: {
            icon: <i.PencilMd />,
            accessibleLabel: "Pencil",
            key: "pencil",
        },
        factory: freehandTools.pencil,
    },
    {
        item: {
            icon: <i.MarkerHorizontalMd />,
            accessibleLabel: "Horizontal marker",
            key: "marker-horizontal",
        },
        factory: freehandTools.markerPenHorizontal,
    },
    {
        item: {
            icon: <i.MarkerVerticalMd />,
            accessibleLabel: "Vertical marker",
            key: "marker-vertical",
        },
        factory: freehandTools.markerPenVertical,
    },
    {
        item: {
            icon: <i.BucketMd />,
            accessibleLabel: "Flood fill",
            key: "flood-fill",
        },
        factory: floodTools.bucket,
    },
    {
        item: {
            icon: <i.EyeDropperMd />,
            accessibleLabel: "Color picker",
            key: "color-picker",
        },
        factory: () => new ColorPickerTool(),
    },
    {
        item: {
            icon: <i.EraserMd />,
            accessibleLabel: "Eraser",
            key: "eraser",
        },
        factory: freehandTools.eraser,
    },
    {
        item: {
            icon: <i.AreaEraserMd />,
            accessibleLabel: "Area eraser",
            key: "flood-erase",
        },
        factory: floodTools.eraser,
    },
    {
        item: {
            icon: <i.MoveMd />,
            accessibleLabel: "Move",
            key: "move",
        },
        factory: () => new MoveTool(),
    },
];

export const editorTools: Array<ToolGroupItem<number>> = editorToolItems.map((tool, index) => ({
    ...tool.item,
    value: index,
    tooltip: <Text>{tool.item.accessibleLabel}</Text>,
}));

export const createTool = (index: number): Tool => (editorToolItems.at(index)?.factory ?? (() => new NoopTool()))();
