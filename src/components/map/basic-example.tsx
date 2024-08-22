import * as maplibre from "maplibre-gl";
import { type Component, createSignal } from "solid-js";
import MapGL, { Camera, type Viewport } from "solid-map-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Styles = {
  BASIC: "basic",
  DARK: "dark",
  LIGHT: "light",
  OUTDOORS: "outdoors",
  STREET: "street",
  SAT: "sat",
  SAT_STREET: "sat_street",
  NAV_DAY: "nav_day",
  NAV_NIGHT: "nav_night",
  DEMO: "https://demotiles.maplibre.org/style.json",
} as const;

type Style = (typeof Styles)[keyof typeof Styles];

export const ExampleMap: Component = () => {
  const [viewport, setViewport] = createSignal({
    center: [-122.45, 37.78],
    zoom: 11,
  } as Viewport);

  const [style, setStyle] = createSignal<Style>(Styles.DEMO);

  return (
    <MapGL
      mapLib={maplibre}
      options={{ style: style() }}
      viewport={viewport()}
      onViewportChange={(evt: Viewport) => setViewport(evt)}
    />
  );
};
