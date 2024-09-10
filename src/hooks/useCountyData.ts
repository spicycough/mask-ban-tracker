import countyData from "@/constants/us-counties.geojson";
import type { CountyData } from "@/constants/us-counties.geojson";
// import { hc } from "@/lib/hono";
import { createQuery } from "@tanstack/solid-query";
import { center as getCenter } from "@turf/center";

import type { FeatureCollection } from "geojson";

// const _getCountyDataFromServer = async () => {
//   const resp = await hc.map.counties.$get();
//   if (!resp.ok) {
//     const { status, statusText } = resp;
//     throw new Error(`${status} ${statusText}`);
//   }
//
//   const data = await resp.json();
//   return data as typeof countyData;
// };

const addCenterToCountyData = (data: CountyData) => {
  data.features.map((feature) => {
    const centerCoords = getCenter(feature);

    const geojson = {
      ...feature.geometry,
      center: centerCoords,
    };

    return {
      ...feature,
    };
  });
};

const getCountyData = async () => {
  const data = addCenterToCountyData(countyData);
  return data;
};

const query = {
  queryKey: ["map", "counties"],
  queryFn: getCountyData,
};

export const useCountyData = () => {
  return createQuery(() => query);
};
