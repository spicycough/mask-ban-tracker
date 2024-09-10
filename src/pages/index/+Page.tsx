import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useMapContext } from "@/stores/map";
import { ArrowUpRightIcon } from "lucide-solid";
import { For, onMount } from "solid-js";
import { LocationList } from "./components/location-list";
import { CustomMap } from "./components/map";
import { ViewportInfo } from "./components/viewport-info";

import statesData from "@/constants/us-states.geojson";

export default function Page() {
  const { map, flyTo, resetViewport, currentLocation, setCurrentLocation } =
    useMapContext();

  onMount(() => {
    resetViewport();
  });

  return (
    <div class="flex h-screen w-full bg-gray-100 dark:bg-gray-800">
      <div class="flex flex-1">
        <div class="flex-1 space-y-4 p-4">
          <div class="flex items-center justify-between">
            <h1 class="font-bold text-2xl">{currentLocation()?.name}</h1>
            <Button variant="outline" class="text-gray-500">
              <ArrowUpRightIcon class="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <CustomMap class="flex h-1/2 items-center justify-center rounded-lg border border-border bg-gray-200 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" />

          {/* <div class="flex-1 space-y-4 bg-blue-400 p-4"> */}
          {/*   <h1 class="font-bold text-2xl">View locations</h1> */}
          {/*   <LocationDataTable data={() => data} /> */}
          {/* </div> */}
        </div>

        <LocationList>
          <div class="space-y-2">
            <For each={statesData.features}>
              {(feature) => {
                // const center = turfCenterOfMass(feature);
                // const bbox = feature.bbox?.at(0);
                return (
                  <Card
                    class="aria-selected:bg-blue-300"
                    onClick={() => {
                      setCurrentLocation({
                        kind: "state",
                        name: feature.properties?.name,
                      });
                      // flyTo({
                      //   pitch: 225,
                      //   center: center.geometry.coordinates,
                      // });
                    }}
                  >
                    <CardHeader class="py-3">
                      <span class="flex w-full items-center justify-between">
                        <CardTitle>{feature.properties?.name}</CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="text-gray-500"
                        >
                          <ArrowUpRightIcon class="h-4 w-4" />
                        </Button>
                      </span>
                    </CardHeader>
                  </Card>
                );
              }}
            </For>
          </div>
        </LocationList>
      </div>
      <ViewportInfo />
    </div>
  );
}
