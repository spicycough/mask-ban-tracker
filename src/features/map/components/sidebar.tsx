import { Button } from "@/components/ui/button";
import { useMapContext } from "@/features/map/create-map-context";
import { cn } from "@/lib/utils";
import { ArrowLeftToLineIcon, ArrowRightToLineIcon } from "lucide-solid";
import { type ParentProps, Show, createEffect, splitProps } from "solid-js";

export interface SidebarProps extends ParentProps {
  class?: string;
  isCollapsed?: boolean;
  setIsCollapsed?: (isCollapsed: boolean) => void;
}

export const Sidebar = (props: SidebarProps) => {
  const [, rest] = splitProps(props, ["class"]);

  const map = useMapContext();

  createEffect(() => {
    if (map.viewport().inTransit) {
      console.log("in transit");
    }
  });

  return (
    <div
      class={cn(
        "container flex flex-col items-center gap-10 py-16",
        props.class,
      )}
      {...rest}
    >
      <Button
        variant="outline"
        size="icon"
        class="absolute top-1 right-1"
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
      <div class="grid">
        <Button
          variant="outline"
          onClick={() => {
            console.log("Clicked");
            map.flyTo("nassau", {
              pitch: 225,
            });
          }}
        >
          Nassau County
        </Button>
        <Show when={!map.viewport().inTransit}>
          <p>We've landed in Nassau</p>
        </Show>
      </div>
    </div>
  );
};
