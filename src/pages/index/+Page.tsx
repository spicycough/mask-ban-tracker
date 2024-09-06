import { Button } from "@/components/ui/button";
import { hc } from "@/lib/hono";
import { QueryBoundary } from "@/lib/vike-solid-query";
import { useMapContext } from "@/stores/map";
import { createQuery } from "@tanstack/solid-query";
import { ArrowUpRightIcon } from "lucide-solid";
import { For } from "solid-js";
import { LocationList, LocationListItem } from "./components/location-list";
import { CustomMap } from "./components/map";
import { ViewportInfo } from "./components/viewport-info";

import type { Location } from "@/db/schema";
import { LocationDataTable } from "./components/location-data-table";

// This type is used to define the shape of our data.
// You can use a Zod or Validbot schema here if you want.

export default function Page() {
  const { state, flyTo } = useMapContext();

  const query = createQuery(() => ({
    queryKey: ["map", "locations"],
    queryFn: getLocations,
  }));

  return (
    <QueryBoundary
      query={query}
      loadingFallback={<div class="">Loading...</div>}
    >
      {(data) => (
        <div class="flex h-screen w-full bg-gray-100 dark:bg-gray-800">
          <div class="flex flex-1">
            <div class="flex-1 space-y-4 p-4">
              <div class="flex items-center justify-end">
                <Button variant="outline" class="text-gray-500">
                  <ArrowUpRightIcon class="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              {/*
              <CustomMap
                locations={data}
                class="flex h-1/2 items-center justify-center rounded-lg border border-border bg-gray-200 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
                  */}

              <div class="flex-1 space-y-4 bg-blue-400 p-4">
                <h1 class="font-bold text-2xl">View locations</h1>
                <LocationDataTable data={() => data} />
              </div>
            </div>

            <LocationList>
              <div class="space-y-4">
                <For each={data}>
                  {(location) => (
                    <LocationListItem
                      location={location}
                      isSelected={state.currentLocation?.id === location.id}
                      onClick={() => {
                        window.history.replaceState(
                          null,
                          "",
                          `/${location.id}`,
                        );
                        flyTo({
                          pitch: 225,
                          zoom: 11,
                        });
                      }}
                    />
                  )}
                </For>
              </div>
            </LocationList>
          </div>
          <ViewportInfo />
        </div>
      )}
    </QueryBoundary>
  );
}

const getLocations = async () => {
  const locations = await hc.map.locations.$get();
  if (!locations.ok) {
    const { status, statusText } = locations;
    throw new Error(`${status} ${statusText}`);
  }
  return (await locations.json()) as Location[];
};
