import { MapProvider } from "@/stores/map";
import type { FlowProps } from "solid-js";

export default function Layout(props: FlowProps) {
  return <MapProvider>{props.children}</MapProvider>;
}
