import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { eq } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { FeatureCollection, Polygon } from "geojson";
import { featureCollections, features } from "./schema";
import type { CountyProperties, StateProperties } from "./validators";

export async function seedCountiesData(db: LibSQLDatabase) {
  const filepath = resolve("./public/static/us-counties.geojson");
  const data = readFileSync(filepath, "utf-8");
  const countiesData = JSON.parse(data) as FeatureCollection<
    Polygon,
    CountyProperties
  >;

  if (!countiesData) {
    throw new Error("Counties data not found.");
  }
  return await db.transaction(async (tx) => {
    // Delete all records from the feature collection
    const { rowsAffected: deletedCount } = await tx
      .delete(featureCollections)
      .where(eq(featureCollections.name, "US Counties"));
    console.log(`Deleted ${deletedCount} counties.`);

    const [{ id: featureCollectionId }] = await tx
      .insert(featureCollections)
      .values({
        type: "FeatureCollection",
        name: "US Counties",
      })
      .returning({ id: featureCollections.id });

    const countyRecords = [];
    for (const county of countiesData.features) {
      countyRecords.push({
        type: "Feature",
        featureCollectionId: featureCollectionId,
        name: county.properties.NAME,
        properties: county.properties,
        geometry: county.geometry,
      });
    }
    const resultSet = await tx.insert(features).values(countyRecords);
    if (resultSet.rowsAffected !== countyRecords.length) {
      throw new Error("Failed to insert counties.");
    }

    console.log(`Inserted ${resultSet.rowsAffected} counties.`);
    return resultSet;
  });
}

export async function seedStatesData(db: LibSQLDatabase) {
  const filepath = resolve("./public/static/us-states.geojson");
  const data = readFileSync(filepath, "utf-8");
  const statesData = JSON.parse(data) as FeatureCollection<
    Polygon,
    StateProperties
  >;

  if (!statesData) {
    throw new Error("States data not found.");
  }

  return await db.transaction(async (tx) => {
    const { rowsAffected: deletedCount } = await tx
      .delete(featureCollections)
      .where(eq(featureCollections.name, "US States"));
    console.log(`Deleted ${deletedCount} states.`);

    const [{ id: featureCollectionId }] = await tx
      .insert(featureCollections)
      .values({
        type: "FeatureCollection",
        name: "US States",
      })
      .returning({ id: featureCollections.id });

    const stateRecords = [];
    for (const state of statesData.features) {
      stateRecords.push({
        type: "Feature",
        featureCollectionId: featureCollectionId,
        name: state.properties.name,
        properties: state.properties,
        geometry: state.geometry,
      });
    }
    const resultSet = await tx.insert(features).values(stateRecords);
    if (resultSet.rowsAffected !== stateRecords.length) {
      throw new Error("Failed to insert counties.");
    }

    console.log(`Inserted ${resultSet.rowsAffected} counties.`);
    return resultSet;
  });
}
