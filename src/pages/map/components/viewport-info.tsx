import { cn } from "@/lib/utils";
import { useMapContext } from "@/stores/map";
import { CompassIcon, SearchIcon } from "lucide-solid";
import { type ComponentProps, Show, createMemo, splitProps } from "solid-js";

export type ViewportInfoProps = ComponentProps<"div"> & {};

export const ViewportInfo = (props: ViewportInfoProps) => {
  const [local, rest] = splitProps(props, ["class"]);

  const { viewport } = useMapContext();

  return (
    <div
      class={cn(
        "fixed right-5 bottom-5 z-50 gap-x-2 px-2.5 py-1",
        "rounded-full bg-black text-right font-light font-mono text-white text-xs",
        "animate-out opacity-100 transition-opacity duration-400 hover:opacity-0",
        "grid grid-flow-col",
        local.class,
      )}
      {...rest}
    >
      <Show when={viewport().center}>
        {(center) => {
          const coords = createMemo(() =>
            Object.entries(center()).map(([_, value]) => {
              return Number.parseFloat(value as string).toFixed(2);
            }),
          );
          return (
            <>
              <CompassIcon class="size-4" />
              <span>{`${coords()[0]} ${coords()[1]}`}</span>
            </>
          );
        }}
      </Show>

      <div class="h-4 w-px bg-gray-400" />

      <Show when={viewport().zoom}>
        {(zoom) => (
          <>
            <SearchIcon class="size-4" />
            <span>{Math.trunc(zoom())}</span>
          </>
        )}
      </Show>
    </div>
  );
};
