import "maplibre-gl/dist/maplibre-gl.css";
import {
  createContext,
  createMemo,
  createRoot,
  onMount,
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
  selectPlaceOfInterest,
} from "./constants";

export type MapState = {
  viewport: Viewport;
  currentLocation: PlaceOfInterestKey | null;
};

export const makeMapContext = (initialState?: MapState) => {
  return createRoot(() => {
    let mapRef!: HTMLDivElement;

    const initialViewport =
      initialState?.viewport ||
      ({
        center: { lat: 37.0902, lon: -95.7129 },
        zoom: 4,
      } satisfies Viewport);

    const [store, setStore] = createStore<MapState>({
      viewport: initialState?.viewport || initialViewport,
      currentLocation: null,
      ...initialState,
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

    const resetViewport = () => {
      setViewport(initialViewport);
    };

    const flyTo = (key: PlaceOfInterestKey, options?: Viewport) => {
      const poi = selectPlaceOfInterest(key);
      if (!poi) {
        throw new Error(`Couldn't find ${key}`);
      }

      setViewport({ ...poi.viewport, ...options });

      setTimeout(() => {
        setStore("currentLocation", key);
      }, 250);
    };

    onMount(() => {
      const [solidMapContext] = useSolidMapContext();
      setStore(reconcile(solidMapContext.map));
      resetViewport();
    });

    return {
      ref: mapRef,
      store: store,
      setStore: setStore,
      viewport: viewport,
      setViewport: setViewport,
      flyTo: flyTo,
      resetViewport: resetViewport,
      props: {
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
