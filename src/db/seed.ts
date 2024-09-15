import { seedBansData } from "@/api/bans/seed";
import { seedCountiesData, seedStatesData } from "@/api/geo/seed";
import { createClient } from "@libsql/client";
import { configDotenv } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

configDotenv();

async function seed() {
  const turso = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(turso);

  // Seed states data
  const { rowsAffected: numStates } = await seedStatesData(db);
  console.log(`Seeded ${numStates} states`);

  const { rowsAffected: numFeatures } = await seedCountiesData(db);
  console.log(`Seeded ${numFeatures} counties`);

  const rowsAffected = await seedBansData(db);
  console.log(`Seeded ${rowsAffected} bans`);
}

seed();

// import countiesData from "@/constants/us-counties.geojson";
// import statesData from "@static/us-states-lookup.json";

// const seedCountiesData = async () => {
//   if (!countiesData) {
//     throw new Error("Counties data not found.");
//   }
//   const res = v.safeParse(CountiesSchema, countiesData, { abortEarly: true });
//   if (!res.success) {
//     const flatIssues = v.flatten(res.issues);
//     const message = "Cannot parse GeoJSON";
//
//     console.error(`[ERR] ${message}\n${JSON.stringify(flatIssues, null, 2)}`);
//     throw new Error(message);
//   }
//
//   // Start db transaction
//   // TODO: batch transactions (currently, each feature is inserted individually)
//   return await db.transaction(async (tx) => {
//     const [collection] = await tx
//       .insert(featureCollections)
//       .values({
//         type: res.output.type,
//         name: res.output.name,
//         crsType: res.output.crs.type,
//         crsName: res.output.crs.properties.name,
//       }) // satisfies NewFeature)
//       .returning({ id: featureCollections.id, name: featureCollections.name });
//
//     // If collection was not created, rollback transaction
//     if (!collection) {
//       tx.rollback();
//
//       const message = "Geographic features could not be created.";
//       console.error(`[ERR] ${message}`);
//       throw new Error(message);
//     }
//
//     // Create new features using new collection ID
//     let totalSize = 0;
//     for (const feature of res.output.features) {
//       if (
//         typeof feature.properties === "object" &&
//         !Array.isArray(feature.properties) &&
//         feature.properties !== null
//       ) {
//         const newFeature = {
//           collectionId: collection.id,
//           type: feature.type,
//           geoId: feature.properties.GEOID,
//           name: feature.properties.NAME,
//           stateFp: feature.properties.STATEFP,
//           countyFp: feature.properties.COUNTYFP,
//           lsad: feature.properties.LSAD,
//           countyNs: feature.properties.COUNTYNS,
//           aLand: feature.properties.ALAND,
//           aWater: feature.properties.AWATER,
//           geoType: feature.geometry?.type,
//           geoCoordinates:
//             feature.geometry &&
//             "coordinates" in feature.geometry &&
//             feature.geometry?.coordinates,
//         } satisfies NewFeatureData;
//
//         const { rowsAffected: numFeatures } = await tx
//           .insert(featureData)
//           .values(newFeature);
//         totalSize += numFeatures;
//       }
//     }
//
//     // If features were not created, rollback transaction
//     if (!(totalSize > 0)) {
//       tx.rollback();
//
//       const message = "Geographic features could not be created.";
//       console.error(`[ERR] ${message}`);
//       throw new Error(message);
//     }
//
//     // If transaction was successful, return response
//     return { id: collection.id, name: collection.name, numFeatures: totalSize };
//   });
// };
//
// const StatesSchema = v.pipe(
//   v.record(v.pipe(v.string(), v.length(2)), v.pipe(v.string(), v.length(2))),
//   v.transform((data) => {
//     return Object.entries(data).map(([code, name]) => ({ code, name }));
//   }),
// );
//
// const seedStatesData = async () => {
//   if (!statesData) {
//     throw new Error("States data not found.");
//   }
//   const res = v.safeParse(StatesSchema, statesData, {
//     abortEarly: true,
//   });
//   if (!res.success) {
//     const flatIssues = v.flatten(res.issues);
//     const message = "Cannot parse states data";
//
//     console.error(`[ERR] ${message}\n${JSON.stringify(flatIssues, null, 2)}`);
//     throw new Error(message);
//   }
//
//   const { rowsAffected: numStates } = await db
//     .insert(usStates)
//     .values(res.output);
//   return { numStates };
// };
