import * as maplibre from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  createContext,
  createEffect,
  createMemo,
  createRoot,
  on,
  useContext,
} from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import {
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
  map: ReturnType<typeof useSolidMapContext>[0]["map"];
  currentLocation: PlaceOfInterestKey | null;
  initialLocation: PlaceOfInterest;
};

export const makeMapContext = (initalState?: MapState) => {
  return createRoot(() => {
    let mapRef!: HTMLDivElement;

    const [solidMapContext] = useSolidMapContext();

    const usa = usePlaceOfInterest("usa");

    const [store, setStore] = createStore<MapState>({
      poi: [...placesOfInterest],
      viewport: {
        center: usa.coords,
        zoom: usa.zoom,
      } as Viewport,
      map: solidMapContext.map,
      currentLocation: null,
      initialLocation: usa,
      ...initalState,
    } as const);

    const viewport = createMemo(() => store.viewport);

    const setViewport = (vp: Viewport) => {
      setStore(
        produce((map) => {
          map.viewport = {
            ...map.viewport,
            ...vp,
          };
        }),
      );
    };

    const flyTo = (placeOfInterest: PlaceOfInterestKey, options?: Viewport) => {
      const poi = usePlaceOfInterest(placeOfInterest);
      if (!poi) {
        throw new Error(`Couldn't find ${placeOfInterest}`);
      }
      setViewport({ center: poi.coords, zoom: poi.zoom, ...options });
    };

    return {
      store: store,
      setStore: setStore,
      viewport: viewport,
      setViewport: setViewport,
      flyTo: flyTo,
      // reset: () => setViewport(store.initialLocation),
      props: {
        ref: mapRef,
        map: solidMapContext.map,
        maplibre: maplibre,
        transitionType: "flyTo",
        options: {
          style: "http://localhost:4321/api/map.json",
        },
      },
    };
  });
};

export const MapContext = createContext<ReturnType<typeof makeMapContext>>();

export const useMapContext = () => {
  const map = useContext(MapContext);
  if (map === undefined) {
    throw new Error("useMap must be used within a MapContext.Provider");
  }

  return map;
};
