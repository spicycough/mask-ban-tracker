import { useMapContext } from "@/features/map/create-map-context";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { type ComponentProps, For, onMount, splitProps } from "solid-js";
import {
  Layer,
  Marker,
  default as SolidMapGL,
  Source,
  type Viewport,
} from "solid-map-gl";

interface CustomMapProps extends ComponentProps<typeof SolidMapGL> {}

export function CustomMap(props: CustomMapProps) {
  const [, rest] = splitProps(props, ["class", "options"]);

  const mapContext = useMapContext();

  // TODO: hide the map controls
  onMount(() => {
    const ctrl = document.querySelector("div.maplibregl-ctrl-bottom-right");

    if (ctrl) {
      ctrl.setAttribute("style", "display: none");
      return;
    }
    console.log("no ctrl");
  });

  return (
    <SolidMapGL
      class={cn("h-dvh w-full", props.class)}
      viewport={mapContext.viewport()}
      onViewportChange={(evt: Viewport) => mapContext.setViewport(evt)}
      {...mapContext.props}
      {...rest}
    >
      <Source
        id="counties"
        source={{
          type: "geojson",
          data: "http://localhost:4321/api/counties.geojson",
          // filter: ["all", ["==", "NAME", "Nassau"]],
        }}
      >
        <Layer
          visible
          sourceId="counties"
          style={{
            type: "line",
            paint: {
              color: "#e399ee",
            },
          }}
        />
      </Source>
      <For each={mapContext.store.poi}>
        {(poi) => (
          <Marker
            showPopup={false}
            options={{
              color: "#333FFF",
              // element: <MapPinIcon class="size-10 text-red-800" />,
            }}
            lngLat={poi.coords}
            // on:click={(evt: MouseEvent) => {
            //   console.log("CLICKED WOOHOO", evt);
            // }}
          >
            {poi.name}
          </Marker>
        )}
      </For>
    </SolidMapGL>
  );
}
