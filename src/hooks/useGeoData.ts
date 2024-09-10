import { center as getCenter } from "@turf/center";
import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from "geojson";

type EnhancedFeature<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
> = Omit<Feature<G, P>, "geometry"> & {
  geometry: Feature<G, P>["geometry"] & {
    center: number[];
  };
};

type EnhancedFeatureCollection<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
> = Omit<FeatureCollection<G, P>, "features"> & {
  features: EnhancedFeature<G, P>[];
};

function addCenter(feature: Feature): EnhancedFeature {
  return {
    ...feature,
    geometry: {
      ...feature.geometry,
      center: getCenter(feature).geometry.coordinates,
    },
  };
}

function createGeoData<
  G extends Geometry | null = Geometry,
  P = GeoJsonProperties,
>(collection: FeatureCollection<G, P>): EnhancedFeatureCollection<G, P> {
  const enhancedCollection = {
    ...collection,
    features: collection.features.map(addCenter),
  };
  return enhancedCollection;
}
