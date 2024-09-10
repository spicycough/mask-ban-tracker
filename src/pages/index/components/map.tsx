import useTailwind from "@/hooks/useTailwind";
import { cn } from "@/lib/utils";
import { useMapContext } from "@/stores/map";
import { splitProps } from "solid-js";
import { default as SolidMapGL } from "solid-map-gl";
import { MapLayer, MapSource } from "./states-layer";

import * as maplibre from "maplibre-gl";

import type { ComponentProps } from "solid-js";

import countiesData from "@/constants/us-counties.geojson";
import statesData from "@/constants/us-states.geojson";

import "maplibre-gl/dist/maplibre-gl.css";

export interface CustomMapProps extends ComponentProps<typeof SolidMapGL> {}

export function CustomMap(props: CustomMapProps) {
  const [local, rest] = splitProps(props, ["class", "children", "options"]);

  const { viewport, setViewport } = useMapContext();

  const { colors } = useTailwind();

  return (
    <SolidMapGL
      class={cn("", props.class)}
      viewport={viewport()}
      onViewportChange={setViewport}
      transitionType="flyTo"
      mapLib={maplibre}
      options={{
        style: "/api/map/tiles",
      }}
      {...rest}
    >
      <MapSource id="counties" source={{ data: countiesData }}>
        <MapLayer
          sourceId="counties"
          filter={["==", "NAME", "Nassau"]}
          style={{
            type: "fill",
            paint: {
              "fill-color": colors.blue[300],
            },
          }}
          beforeType="line"
        />
      </MapSource>
      <MapSource id="states" source={{ data: statesData }}>
        <MapLayer
          sourceId="states"
          style={{
            type: "line",
            paint: {
              "line-color": colors.gray[700],
            },
          }}
          beforeType="line"
        />
      </MapSource>
      {local.children}
    </SolidMapGL>
  );
}
