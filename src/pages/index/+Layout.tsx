import HorizontalSidebar from "@/components/layouts/horizontal-sidebar";
import VerticalLayout from "@/components/layouts/vertical-layout";
import { MapProvider } from "@/stores/map";
import type { FlowProps } from "solid-js";

export default function Layout(props: FlowProps) {
  return (
    <MapProvider>
      <VerticalLayout>{props.children}</VerticalLayout>
    </MapProvider>
  );
}
