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
import * as v from "valibot";
import {
  type PlaceOfInterestKey,
  selectPlaceOfInterest,
} from "./place-of-interest";

export type MapState = {
  viewport: Viewport;
  currentLocation: PlaceOfInterestKey | null;
};

const ZoomSchema = v.pipe(
  v.number("Must be a number between 0 and 23"),
  v.toMinValue(0),
  v.toMaxValue(23),
);
const LatitudeSchema = v.pipe(
  v.number("Must be a number between -90 and 90"),
  v.minValue(-90),
  v.maxValue(90),
);
const LongitudeSchema = v.pipe(
  v.number("Must be a number between -180 and 180"),
  v.minValue(-180),
  v.maxValue(180),
);

type SimpleViewport = Required<Pick<Viewport, "zoom" | "center">>;

export const makeMapContext = (initialState?: MapState) => {
  return createRoot(() => {
    let mapRef!: HTMLDivElement;

    const defaultViewport = {
      zoom: 4,
      center: { lat: 37.0902, lon: -95.7129 },
    } satisfies SimpleViewport;

    const initialViewport = {
      ...initialState?.viewport,
      ...defaultViewport,
    };

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

    const SearchParamsSchema = v.object({
      zoom: v.optional(ZoomSchema, initialViewport.zoom),
      lat: v.optional(LatitudeSchema, initialViewport.center.lat),
      lon: v.optional(LongitudeSchema, initialViewport.center.lon),
    });

    const parseSearchParams = (
      search: string | URLSearchParams,
      simple?: boolean,
    ): SimpleViewport => {
      const params = new URLSearchParams(search);

      if (simple) {
        const zoom = params.get("zoom") ?? initialViewport.zoom;
        const latitude = params.get("lat") ?? initialViewport.center.lat;
        const longitude = params.get("lon") ?? initialViewport.center.lon;
        return {
          zoom: typeof zoom === "string" ? Number.parseInt(zoom) : zoom,
          latitude:
            typeof latitude === "string"
              ? Number.parseFloat(latitude)
              : latitude,
          longitude:
            typeof longitude === "string"
              ? Number.parseFloat(longitude)
              : longitude,
        };
      }
      const parsed = v.safeParse(SearchParamsSchema, params);
      if (!parsed.success) {
        throw new Error("Invalid search params");
      }
      return {
        zoom: parsed.output.zoom,
        latitude: parsed.output.lat,
        longitude: parsed.output.lon,
      };
    };

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
