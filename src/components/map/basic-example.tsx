import { CustomMap, MapProvider } from "@/features/map/create-map-context";
import { ViewportInfo } from "@/features/map/viewport-info";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { type ComponentProps, createSignal, splitProps } from "solid-js";
import { Sidebar } from "./sidebar";

export interface MapProps extends ComponentProps<"div"> {}

export const ExampleMap = (props: MapProps) => {
  const [, rest] = splitProps(props, ["class"]);

  const [isCollapsed, setIsCollapsed] = createSignal(false);

  return (
    <div class="flex flex-row">
      <MapProvider>
        <Sidebar
          isCollapsed={isCollapsed()}
          setIsCollapsed={setIsCollapsed}
          class={cn(
            "z-10 bg-background",
            isCollapsed() ? "w-[200px]" : "w-[396px]",
          )}
        />
        <CustomMap />
        <ViewportInfo />
      </MapProvider>
    </div>
  );
};
