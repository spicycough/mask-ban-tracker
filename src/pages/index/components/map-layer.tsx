import { Layer, Source } from "solid-map-gl";

import useTailwind from "@/hooks/useTailwind";
import { Show, mergeProps, splitProps } from "solid-js";

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

import type { BanStatusType } from "@/api/bans";
import "@/styles/globals.css";

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

const getColor = (status?: BanStatusType): HexColor => {
  let color: HexColor = "#2A4E86";
  switch (status) {
    case "enacted":
      color = "#F18F01";
      break;
    case "proposed":
      color = "#C63E1C";
      break;
    case "repealed":
      color = "#3B202B";
      break;
    default:
      color = "#2A4E86";
      break;
  }
  return color;
};

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
  status: BanStatusType;
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
