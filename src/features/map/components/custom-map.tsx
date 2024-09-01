import * as maplibre from "maplibre-gl";

import { useMapContext } from "@/features/map/create-map-context";
import { cn } from "@/lib/utils";
import { For, splitProps } from "solid-js";
import { Layer, Marker, default as SolidMapGL, Source } from "solid-map-gl";
import { HudCard } from "./hud-card";
import { CustomMapLayer } from "./map-layer";

import type { ComponentProps } from "solid-js";

import "maplibre-gl/dist/maplibre-gl.css";
import { selectPlaceOfInterest } from "../place-of-interest";

export interface CustomMapProps extends ComponentProps<typeof SolidMapGL> {}

export function CustomMap(props: CustomMapProps) {
  const [, rest] = splitProps(props, ["class", "options"]);

  const { viewport, setViewport, store, ...mapContext } = useMapContext();
  const pois = Object.entries(selectPlaceOfInterest())
    .filter(([_, poi]) => poi.name !== "USA")
    .map(([key, poi]) => ({ ...poi, key }));

  return (
    <SolidMapGL
      class={cn("", props.class)}
      viewport={viewport()}
      onViewportChange={setViewport}
      mapLib={maplibre}
      {...mapContext.props}
      {...rest}
    >
      <Source
        id="counties"
        source={{
          type: "geojson",
          data: "http://localhost:4321/api/counties.geojson",
        }}
      >
        <CustomMapLayer
          poi={pois.filter((poi) => poi.key === "nassau")[0]}
          status="banned"
        />
      </Source>
      <For each={pois}>
        {(poi) => (
          <Marker
            showPopup={false}
            options={{
              color: "text-red-400",
              // element: <MapPinIcon class="size-10 text-red-800" />,
            }}
            lngLat={poi.viewport.center}
            // on:click={(evt: MouseEvent) => {
            //   console.log("CLICKED WOOHOO", evt);
            // }}
          >
            {poi.name}
          </Marker>
        )}
      </For>
      <div class="absolute top-10 right-10">
        <HudCard />
      </div>
    </SolidMapGL>
  );
}

// // TODO: hide the map controls
// onMount(() => {
//   const ctrl = document.querySelector("div.maplibregl-ctrl-bottom-right");
//
//   if (ctrl) {
//     ctrl.setAttribute("style", "display: none");
//     return;
//   }
//   console.log("no ctrl");
// });
