import type { ComponentProps } from "solid-js";
import { Layer } from "solid-map-gl";
import { BanStatus, type PlaceOfInterest } from "../constants";

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
  return (
    <Layer
      visible
      sourceId={props.poi.layer.sourceId ?? undefined}
      filter={["all", props.poi.layer.filter]}
      style={{
        type: "fill",
        paint: {
          color: getColor(props.status),
        },
      }}
    />
  );
};
