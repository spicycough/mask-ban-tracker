import { selectPlaceOfInterest } from "@/features/map/place-of-interest";
import { cn } from "@/lib/utils";
import { useMapContext } from "@/stores/map";
import * as maplibre from "maplibre-gl";
import { splitProps } from "solid-js";
import { default as SolidMapGL, Source } from "solid-map-gl";
import { useData } from "vike-solid/useData";
import { MapLayer } from "./map-layer";

import type { ComponentProps } from "solid-js";
import type { Data } from "./+data";

import "maplibre-gl/dist/maplibre-gl.css";

export interface CustomMapProps extends ComponentProps<typeof SolidMapGL> {}

export function CustomMap(props: CustomMapProps) {
  const [local, rest] = splitProps(props, ["class", "children", "options"]);

  const { viewport, setViewport } = useMapContext();
  const data = useData<Data>();

  const locations = selectPlaceOfInterest("nassau");

  return (
    <SolidMapGL
      class={cn("", props.class)}
      viewport={viewport()}
      onViewportChange={setViewport}
      transitionType="flyTo"
      mapLib={maplibre}
      options={{
        style: data.tiles,
      }}
      {...rest}
    >
      <Source
        id="counties"
        source={{
          type: "geojson",
          data: data.counties,
        }}
      >
        <MapLayer status="banned" {...locations.layer} />
      </Source>
      {local.children}
    </SolidMapGL>
  );
}
