import { cn } from "@/lib/utils";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MapPinIcon, PinIcon } from "lucide-solid";
import {
  type ComponentProps,
  For,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  splitProps,
  useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import {
  Layer,
  Marker,
  default as SolidMapGL,
  Source,
  type Viewport,
  useMapContext as useSolidMapContext,
} from "solid-map-gl";
import {
  type PlaceOfInterest,
  type PlaceOfInterestKey,
  placesOfInterest,
  usePlaceOfInterest,
} from "./constants";

export type MapState = {
  viewport: Viewport;
  poi: PlaceOfInterest[];
  currentLocation: PlaceOfInterestKey | null;
};

const createMapStore = () => {
  const usa = usePlaceOfInterest("usa");

  return createStore<MapState>({
    poi: [...placesOfInterest],
    viewport: {
      center: usa.coords,
      zoom: usa.zoom,
    } as Viewport,
    currentLocation: null,
  } as const);
};

const makeMapContext = () => {
  let mapRef!: HTMLDivElement;

  const [mapContext] = useSolidMapContext();

  const [store, setStore] = createMapStore();

  // const viewport = createMemo(() => store.viewport);
  // const setViewport = (vp: Viewport) => {
  //   setStore("viewport", vp);
  // };

  const usa = usePlaceOfInterest("usa");
  const [viewport, setViewport] = createSignal<Viewport>({
    center: usa.coords,
    zoom: usa.zoom,
  });

  // const currentLocation = createMemo(() => store.currentLocation);
  // const setCurrentLocation = (placeOfInterest: PlaceOfInterestKey) => {
  //   setStore("currentLocation", placeOfInterest);
  // };

  // createEffect(
  //   on(currentLocation, (location) => {
  //     if (location === null) {
  //       resetViewport();
  //     }
  //     if (location !== null) {
  //       flyTo(location);
  //     }
  //   }),
  // );

  const resetViewport = () => {
    const usa = usePlaceOfInterest("usa");
    setViewport(usa);
  };

  const flyTo = (placeOfInterest: PlaceOfInterestKey, options?: Viewport) => {
    const poi = usePlaceOfInterest(placeOfInterest);
    if (!poi) {
      throw new Error(`Couldn't find ${placeOfInterest}`);
    }
    console.log(`Flying to ${JSON.stringify(poi)}`);
    const where = {
      center: poi.coords,
      zoom: poi.zoom,
      ...options,
    };
    setViewport(where);
  };

  return {
    ref: mapRef,
    map: mapContext.map,
    store: store,
    setStore: setStore,
    viewport: viewport,
    setViewport: setViewport,
    // currentLocation: currentLocation,
    // setCurrentLocation: setCurrentLocation,
    flyTo: flyTo,
  };
};

type MapContextType = ReturnType<typeof makeMapContext>;

const MapContext = createContext<MapContextType>();

export interface MapProviderProps extends ComponentProps<typeof SolidMapGL> {}

export const MapProvider = (props: MapProviderProps) => {
  const mapContext = makeMapContext();

  return (
    <MapContext.Provider value={mapContext}>
      {props.children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const map = useContext(MapContext);
  if (map === undefined) {
    throw new Error("useMap must be used within a MapContext.Provider");
  }
  return map;
};

interface CustomMapProps extends ComponentProps<typeof SolidMapGL> {}

export const CustomMap = (props: CustomMapProps) => {
  const [, rest] = splitProps(props, ["class", "options"]);

  const customMap = useMap();

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
      mapLib={maplibre}
      viewport={customMap.viewport()}
      onViewportChange={(viewport: Viewport) => {
        console.log("setting viewport", JSON.stringify(viewport));
        customMap.setViewport(viewport);
      }}
      ref={customMap.ref}
      transitionType="flyTo"
      class={cn("h-dvh w-full", props.class)}
      options={{
        style: "http://localhost:4321/api/map.json",
        ...props.options,
      }}
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
      <For each={customMap.store.poi}>
        {(poi) => (
          <Marker
            showPopup={false}
            options={{
              color: "#333FFF",
              // element: <MapPinIcon class="size-10 text-red-800" />,
            }}
            lngLat={poi.coords}
            on:click={(evt: MouseEvent) => {
              console.log("CLICKED WOOHOO", evt);
            }}
          >
            {poi.name}
          </Marker>
        )}
      </For>
    </SolidMapGL>
  );
};
