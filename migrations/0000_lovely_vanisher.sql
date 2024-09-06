CREATE TABLE IF NOT EXISTS `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `map_tiles` (
	`id` text PRIMARY KEY NOT NULL,
	`external_id` text NOT NULL,
	`version` numeric NOT NULL,
	`name` text NOT NULL,
	`metadata` text NOT NULL,
	`sources` text NOT NULL,
	`sprite` text NOT NULL,
	`glyphs` text NOT NULL,
	`layers` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `geo_feature_data` (
	`geoid` text(5) PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`collection_id` text NOT NULL,
	`county_fp` text(3) NOT NULL,
	`county_ns` text(8) NOT NULL,
	`state_fp` text(2) NOT NULL,
	`lsad` text(2) NOT NULL,
	`aland` numeric NOT NULL,
	`awater` numeric NOT NULL,
	`geo_type` text NOT NULL,
	`geo_coordinates` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`collection_id`) REFERENCES `geo_features`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `geo_features` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`crs_type` text NOT NULL,
	`crs_name` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `us_states` (
	`code` text(2) PRIMARY KEY NOT NULL,
	`name` text(2) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `unq_geoid` ON `geo_feature_data` (`geoid`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `published_date_idx` ON `geo_feature_data` (`geoid`);
