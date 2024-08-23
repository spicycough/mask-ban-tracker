import { MapContext, makeMapContext } from "@/features/map/create-map-context";
import { cn } from "@/lib/utils";
import "maplibre-gl/dist/maplibre-gl.css";
import { type ComponentProps, createSignal } from "solid-js";
import { CustomMap, Sidebar, ViewportInfo } from "./components";
import type { MapProps } from "./types";

export interface MapPageProps extends ComponentProps<"div"> {
  class?: string;
  mapProps: MapProps;
}

export const MapPage = () => {
  const mapContext = makeMapContext();

  const [isCollapsed, setIsCollapsed] = createSignal(false);

  return (
    <MapContext.Provider value={{ ...mapContext }}>
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
    </MapContext.Provider>
  );
};
