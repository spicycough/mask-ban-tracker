import type { FeatureCollection, Geometry } from "geojson";

type CountyProperties = {
  STATEFP: string;
  COUNTYFP: string;
  COUNTYNS: string;
  AFFGEOID: string;
  GEOID: string;
  NAME: string;
  LSAD: string;
  ALAND: number;
  AWATER: number;
};

type CountyData = FeatureCollection<Geometry, CountyProperties>;

declare const countydata: CountyData;
export default countydata;
export type { CountyData };
