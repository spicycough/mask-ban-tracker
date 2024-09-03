import { hc } from "@/lib/hono";
import {
  type FlowComponent,
  createContext,
  createMemo,
  onMount,
  useContext,
} from "solid-js";
import { createStore, produce, reconcile } from "solid-js/store";
import {
  type Viewport,
  useMapContext as useSolidMapContext,
} from "solid-map-gl";

export type MapState = {
  viewport: Viewport;
  currentLocation: LocationKey | null;
};

const buildMapContext = (initialState?: MapState) => {
  let ref!: HTMLDivElement;

  const defaultViewport = {
    zoom: 4,
    center: { lat: 37.0902, lon: -95.7129 },
  };

  const initialViewport = {
    ...initialState?.viewport,
    ...defaultViewport,
  };

  const [state, setState] = createStore({
    viewport: initialState?.viewport || {
      zoom: 4,
      center: { lat: 37.0902, lon: -95.7129 },
    },
    currentLocation: null as LocationKey | null,
  });

  const viewport = createMemo(() => state.viewport);

  const setViewport = (vp: Viewport) => {
    setState(
      produce((map) => {
        map.viewport = {
          ...map.viewport,
          ...vp,
        };
      }),
    );
  };

  const resetViewport = () => {
    return setViewport(initialViewport);
  };

  const flyViewport = (key: LocationKey, options?: Viewport) => {
    const location = hc.map.locations[":id"].$get(key);
    if (!location) {
      throw new Error(`Couldn't find ${key}`);
    }

    setViewport({ ...location.viewport, ...options });
    setTimeout(() => setState("currentLocation", key), 250);
  };

  return {
    ref,
    // Store
    state,
    setState,
    // Viewport
    viewport,
    setViewport,
    // Viewport methods
    resetViewport,
  };
};

type MapContextValue = ReturnType<typeof buildMapContext>;

export const MapContext = createContext<MapContextValue>();

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMapContext must be used within a MapContext.Provider");
  }

  return context;
};

export const MapProvider: FlowComponent = (props) => {
  const context = buildMapContext();

  onMount(() => {
    const [solidMapContext] = useSolidMapContext();

    context.setState(reconcile(solidMapContext.map));
    context.resetViewport();
  });

  return (
    <MapContext.Provider value={context}>{props.children}</MapContext.Provider>
  );
};
