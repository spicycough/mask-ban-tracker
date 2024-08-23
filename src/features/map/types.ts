import type { ComponentProps } from "solid-js";
import type MapGL from "solid-map-gl";

// From mapbox
export type LatLngLike =
  | { lng: number; lat: number }
  | { lon: number; lat: number }
  | [number, number];

export type MapProps = ComponentProps<typeof MapGL>;
