import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMapContext } from "@/features/map/create-map-context";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-solid";
import { For, type ParentProps, splitProps } from "solid-js";
import {
  type PlaceOfInterest,
  type PlaceOfInterestKey,
  selectPlaceOfInterest,
} from "../constants";

export interface SidebarProps extends ParentProps {
  class?: string;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

export const Sidebar = (props: SidebarProps) => {
  const [, rest] = splitProps(props, ["class"]);

  const { flyTo, store } = useMapContext();
  const pois = selectPlaceOfInterest();

  return (
    <div class="w-1/3 overflow-auto border-r bg-white p-4 dark:bg-gray-700">
      <h1 class="mb-4 font-bold text-2xl">Mask Bans</h1>
      <div class="relative mb-4">
        <SearchIcon class="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
        <Input placeholder="Search Locations" class="pl-10" />
      </div>
      <div class="space-y-4">
        <For each={Object.entries(pois)}>
          {([key, poi]) => (
            <SidebarEntry
              poi={poi}
              isSelected={store.currentLocation === key}
              onClick={() => {
                flyTo(key as PlaceOfInterestKey, {
                  pitch: 225,
                  zoom: 11,
                });
              }}
            />
          )}
        </For>
      </div>
    </div>
  );
};

interface SidebarEntryProps extends ParentProps {
  class?: string;
  poi: PlaceOfInterest;
  isSelected?: boolean;
  onClick?: () => void;
}

export const SidebarEntry = (props: SidebarEntryProps) => {
  return (
    <button
      type="button"
      class={cn("w-full rounded-lg p-4", {
        "border-2 border-muted": !props.isSelected,
        "bg-gray-300 text-muted ring ring-sky-700": props.isSelected,
      })}
      onClick={props.onClick}
    >
      <div class="mb-2 flex items-center justify-between">
        <span class="font-semibold">{props.poi.name}</span>
        <Badge variant={props.isSelected ? "secondary" : "default"}>
          {props.poi.meta.banStatus}
        </Badge>
      </div>
      <div class="space-y-2">
        <div class="flex items-center">
          <div class="mr-2 h-2 w-2 rounded-full bg-current" />
          <span class="text-sm">{props.poi.meta.banStatus}</span>
        </div>
        <div class="flex items-center">
          <div class="mr-2 h-2 w-2 rounded-full bg-current" />
          <span class="text-sm">{props.poi.meta.banStatus}</span>
        </div>
      </div>
    </button>
  );
};
