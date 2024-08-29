import { Button } from "@/components/ui/button";
import { MapContext, makeMapContext } from "@/features/map/create-map-context";
import {
  ArrowUpRightIcon,
  ClockIcon,
  FileTextIcon,
  GridIcon,
  PackageIcon,
  SettingsIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-solid";
import type { MapOptions as MapProps } from "mapbox-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { type ComponentProps, createSignal } from "solid-js";
import { CustomMap, Sidebar, ViewportInfo } from "./components";

export interface MapPageProps extends ComponentProps<"div"> {
  class?: string;
  mapProps?: MapProps;
}

export const MapPage = () => {
  const mapContext = makeMapContext();

  const [isCollapsed, setIsCollapsed] = createSignal(false);

  return (
    <MapContext.Provider value={mapContext}>
      <div class="flex h-screen w-full bg-gray-100 dark:bg-gray-800">
        <SideNavbar />
        <div class="flex flex-1">
          <Sidebar />

          <div class="flex-1 space-y-4 p-4">
            <div class="flex items-center justify-end">
              <Button variant="outline" class="text-gray-500">
                <ArrowUpRightIcon class="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>

            <CustomMap class="flex h-1/2 items-center justify-center rounded-lg border border-border bg-gray-200 text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300" />

            <div class="flex-1 space-y-4 p-4">
              <h1 class="font-bold text-2xl">
                {mapContext.store.currentLocation}
              </h1>
            </div>
          </div>
        </div>
        <ViewportInfo />
      </div>
    </MapContext.Provider>
  );
};

export const SideNavbar = () => {
  return (
    <div class="flex w-16 flex-col items-center space-y-4 border-r bg-white py-4">
      <ArrowUpRightIcon class="h-6 w-6 text-blue-600" />
      <GridIcon class="h-6 w-6 text-gray-400" />
      <PackageIcon class="h-6 w-6 text-gray-400" />
      <TruckIcon class="h-6 w-6 text-gray-400" />
      <UsersIcon class="h-6 w-6 text-gray-400" />
      <FileTextIcon class="h-6 w-6 text-gray-400" />
      <ClockIcon class="h-6 w-6 text-gray-400" />
      <SettingsIcon class="mt-auto h-6 w-6 text-gray-400" />
    </div>
  );
};
