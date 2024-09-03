import { Button } from "@/components/ui/button";
import {
  type PlaceOfInterestKey,
  selectPlaceOfInterest,
} from "@/features/map/place-of-interest";
import { useMapContext } from "@/stores/map";
import { ArrowUpRightIcon } from "lucide-solid";
import { For } from "solid-js";
import { LocationList, LocationListItem } from "./location-list";
import { CustomMap } from "./map";
import { ViewportInfo } from "./viewport-info";

export default function Page() {
  const { state, flyTo } = useMapContext();

  const pois = selectPlaceOfInterest();

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
            <h1 class="font-bold text-2xl">{state.currentLocation}</h1>
          </div>
        </div>

        <LocationList>
          <div class="space-y-4">
            <For each={Object.entries(pois)}>
              {([key, poi]) => (
                <LocationListItem
                  poi={poi}
                  isSelected={state.currentLocation === key}
                  onClick={() => {
                    window.history.replaceState(null, "", `/${key}`);
                    flyTo(key as PlaceOfInterestKey, {
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
