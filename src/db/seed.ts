import { db } from "@/db";
import {
  type NewGeoFeatureData,
  NewGeoFeatureDataSchema,
  geoFeatureData,
  geoFeatures,
} from "@/db/schema";
import {
  GeoJsonFeatureCollectionSchema,
  GeoJsonFeatureSchema,
} from "@/lib/valibot-geojson";
import * as v from "valibot";
import { usStates } from "./schema";

import countiesData from "@static/us-counties.json";
import statesData from "@static/us-states.json";

const CountiesSchema = v.object({
  ...GeoJsonFeatureCollectionSchema.entries,
  name: v.string(),
  crs: v.object({
    type: v.literal("name"),
    properties: v.object({
      name: v.string(),
    }),
  }),
  features: v.array(
    v.object({
      ...GeoJsonFeatureSchema.entries,
      properties: v.object({
        STATEFP: v.pick(NewGeoFeatureDataSchema, ["stateFp"]).entries.stateFp,
        COUNTYFP: v.pick(NewGeoFeatureDataSchema, ["countyFp"]).entries
          .countyFp,
        COUNTYNS: v.pick(NewGeoFeatureDataSchema, ["countyNs"]).entries
          .countyNs,
        GEOID: v.pick(NewGeoFeatureDataSchema, ["geoId"]).entries.geoId,
        NAME: v.pick(NewGeoFeatureDataSchema, ["name"]).entries.name,
        LSAD: v.pick(NewGeoFeatureDataSchema, ["lsad"]).entries.lsad,
        ALAND: v.pick(NewGeoFeatureDataSchema, ["aLand"]).entries.aLand,
        AWATER: v.pick(NewGeoFeatureDataSchema, ["aWater"]).entries.aWater,
      }),
    }),
  ),
});

const seedCountiesData = async () => {
  if (!countiesData) {
    throw new Error("Counties data not found.");
  }
  const res = v.safeParse(CountiesSchema, countiesData, { abortEarly: true });
  if (!res.success) {
    const flatIssues = v.flatten(res.issues);
    const message = "Cannot parse GeoJSON";

    console.error(`[ERR] ${message}\n${JSON.stringify(flatIssues, null, 2)}`);
    throw new Error(message);
  }

  // Start db transaction
  // TODO: batch transactions (currently, each feature is inserted individually)
  return await db.transaction(async (tx) => {
    const [collection] = await tx
      .insert(geoFeatures)
      .values({
        type: res.output.type,
        name: res.output.name,
        crsType: res.output.crs.type,
        crsName: res.output.crs.properties.name,
      }) // satisfies NewGeoFeature)
      .returning({ id: geoFeatures.id, name: geoFeatures.name });

    // If collection was not created, rollback transaction
    if (!collection) {
      tx.rollback();

      const message = "Geographic features could not be created.";
      console.error(`[ERR] ${message}`);
      throw new Error(message);
    }

    // Create new features using new collection ID
    let totalSize = 0;
    for (const feature of res.output.features) {
      if (
        typeof feature.properties === "object" &&
        !Array.isArray(feature.properties) &&
        feature.properties !== null
      ) {
        const newGeoFeature = {
          collectionId: collection.id,
          type: feature.type,
          geoId: feature.properties.GEOID,
          name: feature.properties.NAME,
          stateFp: feature.properties.STATEFP,
          countyFp: feature.properties.COUNTYFP,
          lsad: feature.properties.LSAD,
          countyNs: feature.properties.COUNTYNS,
          aLand: feature.properties.ALAND,
          aWater: feature.properties.AWATER,
          geoType: feature.geometry?.type,
          geoCoordinates:
            feature.geometry &&
            "coordinates" in feature.geometry &&
            feature.geometry?.coordinates,
        } satisfies NewGeoFeatureData;

        const { rowsAffected: numFeatures } = await tx
          .insert(geoFeatureData)
          .values(newGeoFeature);
        totalSize += numFeatures;
      }
    }

    // If features were not created, rollback transaction
    if (!(totalSize > 0)) {
      tx.rollback();

      const message = "Geographic features could not be created.";
      console.error(`[ERR] ${message}`);
      throw new Error(message);
    }

    // If transaction was successful, return response
    return { id: collection.id, name: collection.name, numFeatures: totalSize };
  });
};

const StatesSchema = v.pipe(
  v.record(v.pipe(v.string(), v.length(2)), v.pipe(v.string(), v.length(2))),
  v.transform((data) => {
    return Object.entries(data).map(([code, name]) => ({ code, name }));
  }),
);

const seedStatesData = async () => {
  if (!statesData) {
    throw new Error("States data not found.");
  }
  const res = v.safeParse(StatesSchema, statesData, {
    abortEarly: true,
  });
  if (!res.success) {
    const flatIssues = v.flatten(res.issues);
    const message = "Cannot parse states data";

    console.error(`[ERR] ${message}\n${JSON.stringify(flatIssues, null, 2)}`);
    throw new Error(message);
  }

  const { rowsAffected: numStates } = await db
    .insert(usStates)
    .values(res.output);
  return { numStates };
};

const seed = async () => {
  // Seed states data
  const { numStates } = await seedStatesData();
  console.log(`Seeded ${numStates} states`);

  const { numFeatures } = await seedCountiesData();
  console.log(`Seeded ${numFeatures} counties`);
};

seed();
