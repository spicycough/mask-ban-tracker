import type {
  BackgroundLayerSpecification,
  CircleLayerSpecification,
  FillExtrusionLayerSpecification,
  FillLayerSpecification,
  HeatmapLayerSpecification,
  HillshadeLayerSpecification,
  LayerSpecification,
  LineLayerSpecification,
  RasterLayerSpecification,
  SymbolLayerSpecification,
} from "maplibre-gl";

import * as v from "valibot";

const FilterSpecificationSchema = v.any();

/**
 * One of "fill", "line", "symbol", "circle", "heatmap", "fill-extrusion", "raster",
 * "raster-particle", "hillshade", "model", "background", "sky", "slot", "clip".
 */

const LayerSpecificationType = v.union([
  /* A filled polygon with an optional stroked border. */
  v.literal("fill"),
  /* A stroked line. */
  v.literal("line"),
  /* An icon or a text label. */
  v.literal("symbol"),
  v.literal("circle"),
  v.literal("heatmap"),
  v.literal("fill-extrusion"),
  v.literal("raster"),
  v.literal("raster-particle"),
  v.literal("hillshade"),
  v.literal("model"),
  v.literal("background"),
  v.literal("sky"),
  v.literal("slot"),
  v.literal("clip"),
]);

const PropertyValueSpecificationSchema = v.any();

const DataDrivenPropertyValueSpecificationSchema = v.any();

const FillLayerSpecificationSchema = v.object({
  /* Unique layer name. */
  id: v.string(),
  /* Layer type. */
  type: LayerSpecificationType,
  /* Arbitrary properties useful to track with the layer, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'mapbox:'. */
  metadata: v.optional(v.unknown()),
  /* Name of a source description to be used for this layer. Required for all layer types except background and slot. */
  source: v.string(),
  /* Layer to use from a vector tile source. Required for vector and raster-array sources; prohibited for all other source types, including GeoJSON sources. */
  "source-layer": v.optional(v.string()),
  /* The minimum zoom level for the layer. At zoom levels less than the minzoom, the layer will be hidden. */
  minzoom: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(24))),
  /* The maximum zoom level for the layer. At zoom levels equal to or greater than the maxzoom, the layer will be hidden. */
  maxzoom: v.optional(v.pipe(v.number(), v.minValue(0), v.maxValue(24))),
  filter: v.optional(FilterSpecificationSchema),
  layout: v.object({
    "fill-sort-key": v.optional(v.string()),
    visibility: v.optional(v.string()),
  }),
  paint: v.object({
    "fill-antialias": v.optional(PropertyValueSpecificationSchema), // bool
    "fill-opacity": v.optional(DataDrivenPropertyValueSpecificationSchema), // number
    "fill-color": v.optional(DataDrivenPropertyValueSpecificationSchema), // ColorSpecification
    "fill-outline-color": v.optional(
      DataDrivenPropertyValueSpecificationSchema,
    ), // ColorSpecification
    "fill-translate": v.optional(DataDrivenPropertyValueSpecificationSchema), // [number, number]
    "fill-translate-anchor": v.optional(
      DataDrivenPropertyValueSpecificationSchema,
    ), // "map" | "viewport"
    "fill-pattern": v.optional(DataDrivenPropertyValueSpecificationSchema), // ResolvedImageSpecification;
  }),
}) satisfies v.GenericSchema<FillLayerSpecification>;

// Type guards for specific LayerSpecification
const isFillLayer = (
  layer: LayerSpecification,
): layer is FillLayerSpecification => layer.type === "fill";
const isLineLayer = (
  layer: LayerSpecification,
): layer is LineLayerSpecification => layer.type === "line";
const isSymbolLayer = (
  layer: LayerSpecification,
): layer is SymbolLayerSpecification => layer.type === "symbol";
const isRasterLayer = (
  layer: LayerSpecification,
): layer is RasterLayerSpecification => layer.type === "raster";
const isBackgroundLayer = (
  layer: LayerSpecification,
): layer is BackgroundLayerSpecification => layer.type === "background";
const isCircleLayer = (
  layer: LayerSpecification,
): layer is CircleLayerSpecification => layer.type === "circle";
const isFillExtrusionLayer = (
  layer: LayerSpecification,
): layer is FillExtrusionLayerSpecification => layer.type === "fill-extrusion";
const isHeatmapLayer = (
  layer: LayerSpecification,
): layer is HeatmapLayerSpecification => layer.type === "heatmap";
const isHillshadeLayer = (
  layer: LayerSpecification,
): layer is HillshadeLayerSpecification => layer.type === "hillshade";
