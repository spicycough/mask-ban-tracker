import banData from "@/constants/bans.json";
import useTailwind from "@/hooks/useTailwind";
import { cn } from "@/lib/utils";
import { useMapContext } from "@/stores/map";
import { createMemo, splitProps } from "solid-js";
import { default as SolidMapGL } from "solid-map-gl";
import { match } from "ts-pattern";
import { MapLayer, MapSource } from "./map-layer";

import * as maplibre from "maplibre-gl";

import type { ComponentProps } from "solid-js";

import countiesData from "@/constants/us-counties.geojson";
import statesData from "@/constants/us-states.geojson";

import "maplibre-gl/dist/maplibre-gl.css";

export interface CustomMapProps extends ComponentProps<typeof SolidMapGL> {}

export function CustomMap(props: CustomMapProps) {
  const [local, rest] = splitProps(props, ["class", "children", "options"]);

  const { viewport, setViewport } = useMapContext();

  const { colors } = useTailwind();

  const stateLayerFilter = createMemo(() => {
    const activeBans: string[][] = [];
    const proposedBans: string[][] = [];
    const repealedBans: string[][] = [];

    const toFilter = (state: string) => {
      return ["==", "name", state];
    };

    for (const [state, data] of Object.entries(banData)) {
      for (const law of data.laws) {
        match(law)
          .with({ status: "Active" }, () => {
            activeBans.push(toFilter(state));
          })
          .with({ status: "Proposed" }, () => {
            proposedBans.push(toFilter(state));
          })
          .with({ status: "Repealed" }, () => {
            repealedBans.push(toFilter(state));
          })
          .otherwise(() => null);
      }
    }

    return {
      activeBans: ["any", ...activeBans],
      proposedBans: ["any", ...proposedBans],
      repealedBans: ["any", ...repealedBans],
    };
  });

  return (
    <SolidMapGL
      class={cn("", props.class)}
      viewport={viewport()}
      onViewportChange={setViewport}
      transitionType="flyTo"
      mapLib={maplibre}
      options={{
        style: "/api/map/tiles",
      }}
      {...rest}
    >
      <MapSource id="counties" source={{ data: countiesData }}>
        <MapLayer
          sourceId="counties"
          filter={["==", "NAME", "Nassau"]}
          style={{
            type: "fill",
            paint: {
              "fill-color": colors.red[300],
            },
          }}
        />
        <MapLayer
          sourceId="counties"
          filter={["==", "NAME", "Nassau"]}
          style={{
            type: "line",
            paint: {
              "line-color": colors.red[700],
            },
          }}
        />
      </MapSource>
      <MapSource id="states" source={{ data: statesData }}>
        <MapLayer
          sourceId="states"
          filter={stateLayerFilter().activeBans}
          style={{
            type: "fill",
            paint: {
              "fill-color": colors.red[300],
            },
          }}
          beforeType="line"
        />
        <MapLayer
          sourceId="states"
          filter={stateLayerFilter().activeBans}
          style={{
            type: "line",
            paint: {
              "line-color": colors.red[700],
            },
          }}
        />
        <MapLayer
          sourceId="states"
          filter={stateLayerFilter().proposedBans}
          style={{
            type: "fill",
            paint: {
              "fill-color": colors.orange[300],
            },
          }}
          beforeType="line"
        />
        <MapLayer
          sourceId="states"
          filter={stateLayerFilter().proposedBans}
          style={{
            type: "line",
            paint: {
              "line-color": colors.orange[700],
            },
          }}
        />
        <MapLayer
          sourceId="states"
          style={{
            type: "line",
            paint: {
              "line-color": colors.neutral[700],
            },
          }}
          beforeType="line"
        />
      </MapSource>
      {local.children}
    </SolidMapGL>
  );
}
