import type { Location } from "@/api/bans";
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

import countiesData from "../constants/us-counties.geojson";
import statesData from "../constants/us-states.geojson";

import type { CountyData } from "@/types/county-data";
import type { StateData } from "@/types/state-data";
import type { Feature } from "geojson";

// import type { CountyData } from "@/constants/us-counties.geojson";
// import type { StateData } from "@/constants/us-states.geojson";

export type MapState = {
  viewport: Viewport;
  canResetViewport: boolean;
  isResettingViewport: boolean;
};

type CurrentLocation = Pick<Location, "kind" | "name">;

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
        const findFeature = <TData extends CountyData | StateData>(
          data: TData,
          key: TData extends CountyData
            ? keyof CountyData["features"][number]["properties"]
            : keyof StateData["features"][number]["properties"],
          value: string,
        ) =>
          data.features.find((feature) => {
            return feature.properties[key] === value;
          });

        let feature: Feature | undefined;
        if (location.kind === "county") {
          feature = findFeature(countiesData, "NAME", location.name);
        }
        if (location.kind === "state") {
          feature = findFeature(statesData, "name", location.name);
        }

        if (!feature) {
          console.warn(`Could not find ${location.kind} ${location.name}`);
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

// const toViewport = (location: Location): Viewport | null => {
//   if (location.kind === "county") {
//     const feature: Feature | undefined = countiesData.features.find(
//       (feat) => feat.properties.NAME === location.name,
//     );
//
//     if (!feature) {
//       return null;
//     }
//
//     const center = turfCenterOfMass(feature);
//     const ratio = turfArea(feature) / turfArea(countiesData);
//
//     const viewport: Viewport = {
//       zoom: 20 * ratio,
//       center,
//     };
//
//     return viewport;
//   }
//   if (location.kind === "state") {
//     const feature: Feature | undefined = statesData.features.find(
//       (feat) => feat.properties.name === location.name,
//     );
//
//     if (!feature) {
//       return null;
//     }
//
//     const center = turfCenterOfMass(feature);
//     const ratio = turfArea(feature) / turfArea(statesData);
//
//     const viewport: Viewport = {
//       zoom: 20 * ratio,
//       center: center.geometry.coordinates,
//     };
//
//     return viewport;
//   }
//
//   return null;
// };
//
// createEffect(
//   on(
//     () => currentLocation(),
//     (location) => {
//       if (!location) {
//         resetViewport();
//         return;
//       }
//       const viewport = toViewport(location);
//       if (!viewport) {
//         return;
//       }
//       flyTo(viewport);
//     },
//   ),
// );
