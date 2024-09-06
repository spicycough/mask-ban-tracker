import { cn } from "@/lib/utils";
import { useMapContext } from "@/stores/map";
import { hydrate, useQueryClient } from "@tanstack/solid-query";
import * as maplibre from "maplibre-gl";
import { splitProps } from "solid-js";
import { Layer, default as SolidMapGL, Source } from "solid-map-gl";
import { useData } from "vike-solid/useData";

import type { Location } from "@/db/schema";
import type { ComponentProps } from "solid-js";
import type { Data } from "../+data";

import "maplibre-gl/dist/maplibre-gl.css";

export interface CustomMapProps extends ComponentProps<typeof SolidMapGL> {
  locations: Location[];
}

export function CustomMap(props: CustomMapProps) {
  const [local, rest] = splitProps(props, [
    "class",
    "children",
    "locations",
    "options",
  ]);

  const { viewport, setViewport } = useMapContext();

  const data = useData<Data>();

  const queryClient = useQueryClient();

  hydrate(queryClient, data.dehydratedState);

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
      <Source
        id="counties"
        source={{
          type: "geojson",
          data: "/static/us-counties.json",
        }}
      >
        <Layer
          sourceId="counties"
          style={{
            type: "line",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#F88",
              "line-width": 2,
            },
          }}
        />
      </Source>
      {local.children}
    </SolidMapGL>
  );
}
