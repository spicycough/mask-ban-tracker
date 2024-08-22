import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerLabel,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { CompassIcon, MoreHorizontalIcon, SearchIcon } from "lucide-solid";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  type ComponentProps,
  For,
  Show,
  createSignal,
  onMount,
  splitProps,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import MapGL, { Marker, type Viewport } from "solid-map-gl";

type Coordinates =
  | { lng: number; lat: number }
  | { lon: number; lat: number }
  | [number, number];

const getLatLon = (coords: Coordinates) => {
  let lat: number;
  let lon: number;
  if (Array.isArray(coords)) {
    [lat, lon] = coords;
  } else if ("lng" in coords) {
    [lat, lon] = [coords.lat, coords.lng];
  } else {
    [lat, lon] = [coords.lat, coords.lon];
  }
  return [lat, lon];
};

const formatCoords = (coords: Coordinates) => {
  const [latitude, longitude] = getLatLon(coords);

  return {
    lat: latitude < 0 ? `${Math.abs(latitude)}°S` : `${latitude}°N`,
    lon: longitude < 0 ? `${Math.abs(longitude)}°W` : `${longitude}°E`,
  };
};

const placesOfInterest = [
  {
    key: "usa",
    name: "USA",
    coords: { lat: "37.0902", lon: "-95.7129" },
    zoom: 4,
  },
  {
    key: "nassau",
    name: "Nassau County",
    coords: { lat: "40.73", lon: "-73.59" },
    zoom: 10,
  },
] as const;

type PlaceOfInterest = (typeof placesOfInterest)[number];
type PlaceOfInterestKey = PlaceOfInterest["key"];

type MapState = {
  viewport: Viewport;
  poi: PlaceOfInterest[];
};

export type MapProps = ComponentProps<"div">;

export const ExampleMap = (props: MapProps) => {
  const [, rest] = splitProps(props, ["class"]);

  const [map, setMap] = createStore<MapState>({
    poi: [...placesOfInterest],
    viewport: {
      center: placesOfInterest.find((poi) => poi.key === "usa")?.coords,
      zoom: placesOfInterest.find((poi) => poi.key === "usa")?.zoom ?? 6,
    },
  } as const);

  const goToPOI = (key: PlaceOfInterestKey) => {
    const poi = map.poi.find((poi) => poi.key === key);
    setMap(
      "viewport",
      produce((vp) => {
        vp.center = poi?.coords;
      }),
    );
  };

  onMount(() => {
    goToPOI("usa");
  });

  const viewport = () => {
    return map.viewport;
  };
  const setViewport = (viewport: Viewport) => {
    setMap("viewport", viewport);
  };

  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div class={cn("", props.class)} {...rest}>
      <Drawer open={isOpen()} onOpenChange={setIsOpen}>
        <DrawerTrigger>
          <MoreHorizontalIcon class="size-6" />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerLabel>Are you sure absolutely sure?</DrawerLabel>
            <DrawerDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
      <MapGL
        mapLib={maplibre}
        options={{ style: "http://localhost:4321/api/map.json" }}
        viewport={viewport()}
        onViewportChange={(evt: Viewport) => setViewport(evt)}
      >
        <For each={map.poi}>
          {(poi) => (
            <Marker
              showPopup={false}
              options={{ color: "#333FFF" }}
              lngLat={poi.coords}
              onOpen={() => setIsOpen(true)}
              onClose={() => setIsOpen(false)}
            >
              {poi.name}
            </Marker>
          )}
        </For>
      </MapGL>
      <ViewportInfo viewport={viewport()} />
    </div>
  );
};

type ViewportInfoProps = ComponentProps<"div"> & {
  viewport: Viewport;
};

const ViewportInfo = (props: ViewportInfoProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <div
      class={cn(
        "fixed right-5 bottom-5 z-50 gap-x-2 px-2.5 py-1",
        "rounded-full bg-black text-right font-light font-mono text-white text-xs",
        "animate-out opacity-100 transition-opacity duration-400 hover:opacity-0",
        "grid grid-flow-row grid-cols-[1fr_min-content]",
        props.class,
      )}
      {...rest}
    >
      <Show when={props.viewport.center}>
        {(center) => (
          <>
            <span>{formatCoords(center()).lat}</span>
            <CompassIcon class="size-4" />
          </>
        )}
      </Show>

      <Show when={props.viewport.center}>
        {(center) => (
          <>
            <span>{formatCoords(center()).lon}</span>
            <CompassIcon class="size-4" />
          </>
        )}
      </Show>

      {/* <Show when={props.viewport.center && props.viewport.zoom}> */}
      {/*   <div class="h-4 w-px bg-gray-800" /> */}
      {/* </Show> */}

      <Show when={props.viewport.zoom}>
        {(zoom) => (
          <>
            <span>{zoom()}</span>
            <SearchIcon class="size-4" />
          </>
        )}
      </Show>
    </div>
  );
};
