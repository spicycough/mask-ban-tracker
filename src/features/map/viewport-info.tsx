import { useMap } from "@/features/map/create-map-context";
import { formatCoords } from "@/features/map/utils";
import { cn } from "@/lib/utils";
import { CompassIcon, SearchIcon } from "lucide-solid";
import "maplibre-gl/dist/maplibre-gl.css";
import { type ComponentProps, Show, splitProps } from "solid-js";

export type ViewportInfoProps = ComponentProps<"div"> & {};

export const ViewportInfo = (props: ViewportInfoProps) => {
  const [, rest] = splitProps(props, ["class"]);

  const { viewport } = useMap();

  return (
    <div
      class={cn(
        "fixed right-5 bottom-5 z-50 gap-x-2 px-2.5 py-1",
        "rounded-full bg-black text-right font-light font-mono text-white text-xs",
        "animate-out opacity-100 transition-opacity duration-400 hover:opacity-0",
        "grid grid-flow-row grid-cols-[1fr_min-content]",
        props.class,
      )}
      {...rest}
    >
      <Show when={viewport().center}>
        {(center) => (
          <>
            <span>{formatCoords(center()).latitude}</span>
            <CompassIcon class="size-4" />
          </>
        )}
      </Show>

      <Show when={viewport().center}>
        {(center) => (
          <>
            <span>{formatCoords(center()).longitude}</span>
            <CompassIcon class="size-4" />
          </>
        )}
      </Show>

      {/* <Show when={props.viewport.center && props.viewport.zoom}> */}
      {/*   <div class="h-4 w-px bg-gray-800" /> */}
      {/* </Show> */}

      <Show when={viewport().zoom}>
        {(zoom) => (
          <>
            <span>{Math.trunc(zoom())}</span>
            <SearchIcon class="size-4" />
          </>
        )}
      </Show>
    </div>
  );
};
