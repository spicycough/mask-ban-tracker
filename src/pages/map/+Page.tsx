import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import statesData from "@/constants/us-states.geojson";
import { useMapContext } from "@/stores/map";
import { ArrowUpRightIcon, SearchIcon } from "lucide-solid";
import { For } from "solid-js";
import { HudCard } from "./components/hud-card";
import { CustomMap } from "./components/map";
import { ResetViewportButton } from "./components/reset-viewport-button";
import { ViewportInfo } from "./components/viewport-info";

export default function Page() {
  const { resetViewport, setCurrentLocation } = useMapContext();

  return (
    <div class="h-screen bg-gray-100 dark:bg-gray-800">
      <CustomMap class="h-full" disableResize>
        <div class="h-full w-1/4 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <h1 class="mb-4 font-bold text-2xl">Mask Bans</h1>
          <div class="relative mb-4">
            <SearchIcon class="absolute top-2.5 left-3 h-4 w-4" />
            <Input placeholder="Search Locations" class="pl-10" />
          </div>

          <Separator />

          <div class="space-y-2 overflow-y-scroll">
            <For each={statesData.features}>
              {(feature) => {
                return (
                  <Card
                    class="aria-selected:bg-blue-300"
                    onClick={() => {
                      setCurrentLocation({
                        type: "state",
                        name: feature.properties?.name,
                      });
                    }}
                  >
                    <CardHeader class="py-4">
                      <span class="flex w-full items-center justify-between">
                        <CardTitle class="text-base">
                          {feature.properties?.name}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          class="size-4 text-gray-300"
                          as={ArrowUpRightIcon}
                        />
                      </span>
                    </CardHeader>
                  </Card>
                );
              }}
            </For>
          </div>
        </div>
        <div class="absolute top-0 right-0 p-10">
          <HudCard />
        </div>
        <ResetViewportButton />
        <ViewportInfo />
      </CustomMap>
    </div>
  );
}
