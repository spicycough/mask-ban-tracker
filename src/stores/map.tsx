import type { BanRegion } from "@/api/bans";
import { bbox as turfBbox } from "@turf/bbox";
import {
  type FlowComponent,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  onMount,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  type Viewport,
  useMapContext as useSolidMapContext,
} from "solid-map-gl";

import countiesData from "@/constants/us-counties.geojson";
import statesData from "@/constants/us-states.geojson";

export type MapState = {
  viewport: Viewport;
  canResetViewport: boolean;
  isResettingViewport: boolean;
};

type CurrentLocation = Pick<BanRegion, "type" | "name">;

type LocationData = {
  type: BanRegion["type"];
  name: string;
};

const findFeature = (props: LocationData) => {
  switch (props.type) {
    case "county":
      return countiesData.features.find(
        (feature) => feature.properties.NAME === props.name,
      );
    case "state":
      return statesData.features.find(
        (feature) => feature.properties.name === props.name,
      );
  }
};

const buildMapContext = (initialState?: MapState) => {
  const initialViewport = {
    zoom: 4,
    center: { lat: 37.0902, lon: -95.7129 },
    ...initialState?.viewport,
  };

  const [state, setState] = createStore<MapState>({
    viewport: initialState?.viewport || {
      zoom: 4,
      center: { lat: 37.0902, lon: -95.7129 },
    },
    canResetViewport: false,
    isResettingViewport: false,
  });

  const [currentLocation, setCurrentLocation] =
    createSignal<CurrentLocation | null>(null);

  const viewport = createMemo(() => {
    return state.viewport;
  });

  const setViewport = (vp: Viewport) => {
    return setState(
      produce((state) => {
        state.viewport = {
          ...state.viewport,
          ...vp,
        };
      }),
    );
  };

  const resetViewport = () => {
    if (currentLocation()) {
      setCurrentLocation(null);
    }
    return setViewport(initialViewport);
  };

  const [isResettingViewport, setIsResettingViewport] = [
    () => state.isResettingViewport,
    (value: boolean) => setState("isResettingViewport", value),
  ];

  const [canResetViewport, setCanResetViewport] = [
    () => state.canResetViewport,
    (value: boolean) => setState("canResetViewport", value),
  ];

  const [ctx] = useSolidMapContext();

  createEffect(
    on(
      () => currentLocation(),
      (location) => {
        console.log("Changing map to", location);
        if (!ctx.map) {
          return null;
        }
        if (!location) {
          resetViewport();
          return;
        }
        const feature = findFeature({
          type: location.type,
          name: location.name,
        });

        if (!feature) {
          console.warn(`Could not find ${location.type} ${location.name}`);
          return location;
        }
        ctx.map.fitBounds(turfBbox(feature), { padding: 60, pitch: 225 });
        return location;
      },
    ),
    currentLocation(), // initial value
  );

  return {
    map: ctx.map,
    // Store
    state,
    setState,
    // Viewport
    viewport,
    setViewport,
    resetViewport,
    isResettingViewport,
    setIsResettingViewport,
    canResetViewport,
    setCanResetViewport,
    // Current location
    currentLocation,
    setCurrentLocation,
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
    context.resetViewport();
  });

  return (
    <MapContext.Provider value={context}>{props.children}</MapContext.Provider>
  );
};
