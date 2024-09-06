import { relations } from "drizzle-orm/relations";
import { geoFeatures, geoFeatureData } from "./schema";

export const geoFeatureDataRelations = relations(geoFeatureData, ({one}) => ({
	geoFeature: one(geoFeatures, {
		fields: [geoFeatureData.collectionId],
		references: [geoFeatures.id]
	}),
}));

export const geoFeaturesRelations = relations(geoFeatures, ({many}) => ({
	geoFeatureData: many(geoFeatureData),
}));