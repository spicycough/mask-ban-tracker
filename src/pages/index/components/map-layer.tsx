import { type ComponentProps, Show, mergeProps, splitProps } from "solid-js";
import { Layer, type Viewport } from "solid-map-gl";

export const BanStatus = {
  BANNED: "banned",
  INTROED: "introed",
  UNKNOWN: "unknown",
  FLOATED: "floated",
} as const;

export type BanStatus = (typeof BanStatus)[keyof typeof BanStatus];

export interface Location {
  name: string;
  layer: ComponentProps<typeof Layer>;
  viewport: Viewport;
  meta: {
    banStatus: BanStatus;
  };
}

type HexColor = `#${string}`;

const getColor = (status?: BanStatus): HexColor => {
  let color: HexColor = "#2A4E86";
  switch (status) {
    case BanStatus.FLOATED:
      color = "#F18F01";
      break;
    case BanStatus.INTROED:
      color = "#C63E1C";
      break;
    case BanStatus.BANNED:
      color = "#3B202B";
      break;
    case BanStatus.UNKNOWN:
      color = "#2A4E86";
      break;
    default:
      color = "#2A4E86";
  }
  return color;
};

interface BannedLayerProps extends ComponentProps<typeof Layer> {
  status: BanStatus;
}

type LayerProps = ComponentProps<typeof Layer>;

export const MapLayer = (props: BannedLayerProps) => {
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
  } satisfies LayerProps;

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
