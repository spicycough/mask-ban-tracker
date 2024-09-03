import { Button } from "@/components/ui/button";
import type { Location } from "@/db/schema";
import { hc } from "@/lib/hono";
import { useMapContext } from "@/stores/map";
import { createQuery } from "@tanstack/solid-query";
import type { InferRequestType, InferResponseType } from "hono";
import { ArrowUpRightIcon } from "lucide-solid";
import { For } from "solid-js";
import { LocationList, LocationListItem } from "./location-list";
import { CustomMap } from "./map";
import { ViewportInfo } from "./viewport-info";

export default function Page() {
  const { state, flyTo } = useMapContext();

  const $get = hc.map.locations.$get;
  const { data } = createQuery(() => ({
    queryKey: ["locations"],
    queryFn: async () => {
      const locations = await hc.map.locations.$get();
      if (!locations.ok) {
        const { status, statusText } = locations;
        throw new Error(`${status} ${statusText}`);
      }
      return (await locations.json()) as Location[];
    },
  }));

  return (
    <div class="flex h-screen w-full bg-gray-100 dark:bg-gray-800">
      <div class="flex flex-1">
        <div class="flex-1 space-y-4 p-4">
          <div class="flex items-center justify-end">
            <Button variant="outline" class="text-gray-500">
              <ArrowUpRightIcon class="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>

          <CustomMap class="flex h-1/2 items-center justify-center rounded-lg border border-border bg-gray-200 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" />

          <div class="flex-1 space-y-4 p-4">
            <h1 class="font-bold text-2xl">{state.currentLocation?.name}</h1>
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
                    window.history.replaceState(null, "", `/${key}`);
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
  );
}
