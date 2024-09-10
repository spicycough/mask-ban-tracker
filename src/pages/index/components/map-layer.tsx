import { Layer, Source } from "solid-map-gl";

import useTailwind from "@/hooks/useTailwind";
import { Show, createUniqueId, mergeProps, splitProps } from "solid-js";

import type { StyleSpecification } from "mapbox-gl";
import type {
  BackgroundLayerSpecification,
  CircleLayerSpecification,
  FillExtrusionLayerSpecification,
  FillLayerSpecification,
  HeatmapLayerSpecification,
  HillshadeLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
  RasterLayerSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";
import type { ComponentProps } from "solid-js";

import "@/styles/globals.css";
import type { BanStatus } from "@/db/schema";

export type MapSourceProps = ComponentProps<typeof Source>;

export const MapSource = (props: MapSourceProps) => {
  const [local, rest] = splitProps(props, ["source"]);

  if (!local.source.data) {
    console.warn(
      "Attempting to render a MapSource that has no source.data. This is likely a bug.",
    );
  }

  return (
    <Source
      source={{
        type: "geojson",
        ...local.source,
      }}
      {...rest}
    />
  );
};

type HexColor = `#${string}`;

const getColor = (status?: BanStatus): HexColor => {
  let color: HexColor = "#2A4E86";
  switch (status) {
    case "Active":
      color = "#F18F01";
      break;
    case "Proposed":
      color = "#C63E1C";
      break;
    case "Repealed":
      color = "#3B202B";
      break;
    default:
      color = "#2A4E86";
      break;
  }
  return color;
};

// Type guards for specific LayerSpecification
const isFillLayer = (
  layer: LayerSpecification,
): layer is FillLayerSpecification => layer.type === "fill";
const isLineLayer = (
  layer: LayerSpecification,
): layer is LineLayerSpecification => layer.type === "line";
const isSymbolLayer = (
  layer: LayerSpecification,
): layer is SymbolLayerSpecification => layer.type === "symbol";
const isRasterLayer = (
  layer: LayerSpecification,
): layer is RasterLayerSpecification => layer.type === "raster";
const isBackgroundLayer = (
  layer: LayerSpecification,
): layer is BackgroundLayerSpecification => layer.type === "background";
const isCircleLayer = (
  layer: LayerSpecification,
): layer is CircleLayerSpecification => layer.type === "circle";
const isFillExtrusionLayer = (
  layer: LayerSpecification,
): layer is FillExtrusionLayerSpecification => layer.type === "fill-extrusion";
const isHeatmapLayer = (
  layer: LayerSpecification,
): layer is HeatmapLayerSpecification => layer.type === "heatmap";
const isHillshadeLayer = (
  layer: LayerSpecification,
): layer is HillshadeLayerSpecification => layer.type === "hillshade";

type LayerSpec<
  T extends LayerSpecification["type"] = LayerSpecification["type"],
> = T extends "fill"
  ? FillLayerSpecification
  : T extends "line"
    ? LineLayerSpecification
    : T extends "symbol"
      ? SymbolLayerSpecification
      : T extends "raster"
        ? RasterLayerSpecification
        : T extends "background"
          ? BackgroundLayerSpecification
          : T extends "circle"
            ? CircleLayerSpecification
            : T extends "fill-extrusion"
              ? FillExtrusionLayerSpecification
              : T extends "heatmap"
                ? HeatmapLayerSpecification
                : T extends "hillshade"
                  ? HillshadeLayerSpecification
                  : never;

type LayerType = LayerSpecification["type"];

export type MapLayerProps<T extends LayerType = LayerType> = Omit<
  ComponentProps<typeof Layer>,
  "style"
> & {
  style: Partial<LayerSpec<T>>;
};

export const MapLayer = <T extends LayerType = LayerType>(
  props: MapLayerProps<T>,
) => {
  const [local, rest] = splitProps(props, ["style"]);

  const { colors } = useTailwind();

  return (
    <Layer
      style={
        local.style ?? {
          type: "line",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": colors.neutral[500],
            "line-width": 2,
          },
        }
      }
      {...rest}
    />
  );
};

interface MapFillLayerProps extends ComponentProps<typeof Layer> {
  status: BanStatus;
}

export const MapFillLayer = (props: MapFillLayerProps) => {
  const defaultProps = {
    style: {
      type: "line",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": getColor(),
        "line-width": 2,
      },
    },
  } satisfies ComponentProps<typeof Layer>;

  const [local, rest] = splitProps(mergeProps(defaultProps, props), [
    "filter",
    "sourceId",
    "status",
    "style",
  ]);

  if (local.sourceId === undefined) {
    console.warn(
      "Attempting to render a MapLayer that has no layer.sourceId. This is likely a bug.",
    );
  }

  return (
    <Show when={local.sourceId}>
      <Layer
        visible
        sourceId={local.sourceId}
        filter={["all", local.filter]}
        style={{
          type: "fill",
          paint: {
            color: getColor(local.status),
          },
          ...local.style,
        }}
        {...rest}
      />
    </Show>
  );
};
