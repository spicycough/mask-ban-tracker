CREATE TABLE `ban_penalties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ban_id` integer,
	`text` text,
	`classification` text,
	`jail_min` real,
	`jail_max` real,
	`fine_min` real,
	`fine_max` real,
	`link` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`ban_id`) REFERENCES `bans`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ban_regions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`note_id` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`note_id`) REFERENCES `references`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `ban_statuses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`status` text NOT NULL,
	`proposed_date` text,
	`enacted_date` text,
	`effective_date` text,
	`repealed_date` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `bans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`region_id` integer,
	`status_id` integer,
	`condition` text NOT NULL,
	`is_existing` integer NOT NULL,
	`proposed_by` text,
	`details_id` integer,
	`note_id` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`region_id`) REFERENCES `ban_regions`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`status_id`) REFERENCES `ban_statuses`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`details_id`) REFERENCES `references`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`note_id`) REFERENCES `references`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `references` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`note` text NOT NULL,
	`link` text
);
--> statement-breakpoint
CREATE TABLE `geo_feature_collections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `geo_features` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`feature_collection_id` integer,
	`name` text NOT NULL,
	`properties` text NOT NULL,
	`geometry` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`feature_collection_id`) REFERENCES `geo_feature_collections`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `map_tiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`external_id` text NOT NULL,
	`version` numeric NOT NULL,
	`name` text NOT NULL,
	`glyphs` text NOT NULL,
	`sprite` text NOT NULL,
	`metadata` text NOT NULL,
	`sources` text NOT NULL,
	`layers` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
