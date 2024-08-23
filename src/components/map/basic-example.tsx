import { CustomMap, CustomMapRoot } from "@/features/map/create-map-context";
import { ViewportInfo } from "@/features/map/viewport-info";
import "maplibre-gl/dist/maplibre-gl.css";
import { type ComponentProps, splitProps } from "solid-js";
import { Sidebar } from "./sidebar";

export interface MapProps extends ComponentProps<"div"> {}

export const ExampleMap = (props: MapProps) => {
  const [, rest] = splitProps(props, ["class"]);

  return (
    <>
      <Sidebar>
        <CustomMapRoot>
          <CustomMap />
          <ViewportInfo />
        </CustomMapRoot>
      </Sidebar>
    </>
  );
};
