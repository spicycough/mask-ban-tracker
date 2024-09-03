import type { Location } from "@/db/schema";
import {
  type FlowComponent,
  createContext,
  createMemo,
  onMount,
  useContext,
} from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import {
  type Viewport,
  useMapContext as useSolidMapContext,
} from "solid-map-gl";

export type MapState = {
  viewport: Viewport;
  currentLocation: Location | null;
};

const buildMapContext = (initialState?: MapState) => {
  const initialViewport = {
    zoom: 4,
    center: { lat: 37.0902, lon: -95.7129 },
    ...initialState?.viewport,
  };

  const [state, setState] = createStore({
    viewport: initialState?.viewport || {
      zoom: 4,
      center: { lat: 37.0902, lon: -95.7129 },
    },
    currentLocation: null as Location | null,
  });

  const viewport = createMemo(() => {
    return state.viewport;
  });

  const setViewport = (vp: Viewport) => {
    return setState("viewport", vp);
  };

  const flyTo = (vp: Viewport) => {
    return setViewport(vp);
  };

  const resetViewport = () => {
    return flyTo(initialViewport);
  };

  return {
    // Store
    state,
    setState,
    // Viewport
    viewport,
    setViewport,
    // Viewport methods
    flyTo,
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
