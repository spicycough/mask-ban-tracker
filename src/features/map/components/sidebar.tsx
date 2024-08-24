import { Button } from "@/components/ui/button";
import { useMapContext } from "@/features/map/create-map-context";
import { cn } from "@/lib/utils";
import {
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  NavigationIcon,
} from "lucide-solid";
import {
  type ParentProps,
  Show,
  createEffect,
  getOwner,
  runWithOwner,
  splitProps,
} from "solid-js";

export interface SidebarProps extends ParentProps {
  class?: string;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

export const Sidebar = (props: SidebarProps) => {
  const [, rest] = splitProps(props, ["class"]);

  const { viewport, flyTo } = useMapContext();

  return (
    <div
      class={cn(
        "container relative flex flex-col items-center gap-10 py-16 shadow-gray-300 shadow-lg",
        props.class,
      )}
      {...rest}
    >
      <Button
        variant="ghost"
        size="icon"
        class="absolute top-1 right-2"
        onClick={() => props.setIsCollapsed?.(!props.isCollapsed)}
      >
        <Show
          when={props.isCollapsed}
          fallback={<ArrowLeftToLineIcon class="size-4" />}
        >
          <ArrowRightToLineIcon class="size-4" />
        </Show>
      </Button>
      <h1 class="font-semibold text-2xl">Mask Bans</h1>
      <div class="flex w-full flex-col gap-2">
        <span class="flex w-full flex-row items-center justify-between rounded-lg bg-secondary p-2 font-semibold text-lg">
          Nassau County
          <Button
            variant="ghost"
            class="outline-none"
            onClick={() => {
              console.log("Clicked");
              flyTo("nassau", {
                pitch: 225,
                zoom: 11,
              });
            }}
          >
            <NavigationIcon class="size-4 fill-primary" />
          </Button>
        </span>
        <span class="flex w-full flex-row items-center justify-between rounded-lg bg-secondary p-2 font-semibold text-lg">
          Los Angeles County
          <Button
            variant="ghost"
            class="outline-none"
            onClick={() => {
              console.log("Clicked");
              flyTo("nassau", {
                pitch: 225,
              });
            }}
          >
            <NavigationIcon class="size-4 fill-primary" />
          </Button>
        </span>
        <span class="flex w-full flex-row items-center justify-between rounded-lg bg-secondary p-2 font-semibold text-lg">
          North Carolina
          <Button
            variant="ghost"
            class="outline-none"
            onClick={() => {
              console.log("Clicked");
              flyTo("nassau", {
                pitch: 225,
              });
            }}
          >
            <NavigationIcon class="size-4 fill-primary" />
          </Button>
        </span>
      </div>
    </div>
  );
};
