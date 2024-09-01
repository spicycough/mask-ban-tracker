import { type ComponentProps, Show, splitProps } from "solid-js";
import { Layer } from "solid-map-gl";
import { BanStatus, type PlaceOfInterest } from "../place-of-interest";

interface BannedLayerProps extends ComponentProps<typeof Layer> {
  status: BanStatus;
  poi: PlaceOfInterest;
}

type HexColor = `#${string}`;

const getColor = (status: BanStatus): HexColor => {
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
  }
  return color;
};

export const CustomMapLayer = (props: BannedLayerProps) => {
  const [local, rest] = splitProps(props, ["status", "poi", "style"]);

  if (local.poi.layer.sourceId === undefined) {
    console.warn(
      "Attempting to render a CustomMapLayer with a poi that has no layer.sourceId",
    );
  }

  return (
    <Show when={local.poi.layer.sourceId}>
      {(sourceId) => (
        <Layer
          visible
          sourceId={sourceId()}
          filter={["all", local.poi.layer.filter]}
          style={{
            type: "fill",
            paint: {
              color: getColor(local.status),
            },
            ...local.style,
          }}
          {...rest}
        />
      )}
    </Show>
  );
};
