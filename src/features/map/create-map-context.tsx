import { cn } from "@/lib/utils";
import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  type ComponentProps,
  For,
  createContext,
  createMemo,
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
  placesOfInterest,
  usePlaceOfInterest,
} from "./constants";

export type MapState = {
  viewport: Viewport;
  poi: PlaceOfInterest[];
};

const createMapStore = () => {
  const usa = usePlaceOfInterest("usa");

  return createStore<MapState>({
    poi: [...placesOfInterest],
    viewport: {
      center: usa.coords,
      zoom: usa.zoom,
    },
  } as const);
};

const makeMapContext = () => {
  let mapRef!: HTMLDivElement;

  const [mapContext] = useSolidMapContext();

  const [store, setStore] = createMapStore();

  const viewport = createMemo(() => store.viewport);
  const setViewport = (viewport: Viewport) => {
    setStore("viewport", viewport);
  };

  return {
    ref: mapRef,
    map: mapContext.map,
    store: store,
    setStore: setStore,
    viewport: viewport,
    setViewport: setViewport,
  };
};

type MapContextType = ReturnType<typeof makeMapContext>;

const MapContext = createContext<MapContextType>();

export interface MapProviderProps extends ComponentProps<typeof SolidMapGL> {}

export const MapProvider = (props: MapProviderProps) => {
  const mapContext = makeMapContext();

  return (
    <MapContext.Provider value={{ ...mapContext }}>
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

export const CustomMapRoot = (props: CustomMapProps) => {
  const [, rest] = splitProps(props, ["class", "options"]);

  const mapContext = makeMapContext();

  return (
    <MapProvider>
      <SolidMapGL
        mapLib={maplibre}
        viewport={mapContext.viewport()}
        onViewportChange={(evt: Viewport) => mapContext.setViewport(evt)}
        ref={mapContext.ref}
        class={cn("h-dvh", props.class)}
        options={{
          style: "http://localhost:4321/api/map.json",
          ...props.options,
        }}
        {...rest}
      >
        {props.children}
      </SolidMapGL>
    </MapProvider>
  );
};

export const CustomMap = (props: CustomMapProps) => {
  const { store } = useMap();

  return (
    <>
      <Source
        source={{
          type: "geojson",
          data: "http://localhost:4321/api/counties.geojson",
          filter: ["all", ["==", "NAME", "Nassau"]],
        }}
      >
        <Layer
          style={{
            type: "fill",
            paint: {
              color: "#999",
              "outline-color": "#000",
            },
          }}
        />
      </Source>
      <For each={store.poi}>
        {(poi) => (
          <Marker
            showPopup={false}
            options={{ color: "#333FFF" }}
            lngLat={poi.coords}
          >
            {poi.name}
          </Marker>
        )}
      </For>
    </>
  );
};
