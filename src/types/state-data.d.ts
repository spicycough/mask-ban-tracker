import type { FeatureCollection, Geometry } from "geojson";

type StateProperties = {
  name: string;
  density: number;
};

type StateData = FeatureCollection<Geometry, StateProperties>;

declare const statedata: StateData;
export default statedata;
export type { StateData };
