import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { BanData } from "@/constants/bans.json";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-solid";
import { type ComponentProps, type ParentProps, splitProps } from "solid-js";

export type LocationListProps = ComponentProps<"div"> &
  ParentProps<{
    class?: string;
    isCollapsed?: boolean;
    setIsCollapsed?: (isCollapsed: boolean) => void;
  }>;

export const LocationListHeader = (props: LocationListProps) => {
  const [local, rest] = splitProps(props, ["class", "children"]);

  return (
    <div class={cn("", local.class)} {...rest}>
      <h1 class="mb-4 font-bold text-2xl">Mask Bans</h1>
      <div class="relative mb-4">
        <SearchIcon class="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
        <Input placeholder="Search Locations" class="pl-10" />
      </div>
    </div>
  );
};

interface LocationListItemProps extends ParentProps {
  class?: string;
  name: keyof BanData;
  ban: BanData[keyof BanData]["laws"][number];
  isSelected?: boolean;
  onClick?: () => void;
}

export const LocationListItem = (props: LocationListItemProps) => {
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
        <span class="font-semibold">{props.name}</span>
        <Badge variant={props.isSelected ? "secondary" : "default"}>
          {props.ban.status}
        </Badge>
      </div>
    </button>
  );
};
