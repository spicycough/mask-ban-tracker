import { sql } from "drizzle-orm";
import {
  type SQLiteColumnBuilderBase,
  integer,
  sqliteTable,
} from "drizzle-orm/sqlite-core";

// Helper for creating tables with standard fields
export function createTableWithMetadata<
  T extends Record<string, SQLiteColumnBuilderBase>,
>(name: string, fields: T) {
  return sqliteTable(name, {
    id: integer("id").primaryKey({ autoIncrement: true }),
    ...fields,
    createdAt: integer("created_at", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .notNull()
      .$type<Date>(),
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .default(sql`(strftime('%s', 'now'))`)
      .$onUpdateFn(() => sql`(strftime('%s', 'now'))`)
      .notNull()
      .$type<Date>(),
  });
}

export type Tuple<T extends string = string> = [T, ...T[]];

export const asEnum = (
  shape: Record<string, string>,
): [string, ...string[]] => {
  return Object.values(shape) as [string, ...string[]];
};

// const idField = { id: integer("id").primaryKey({ autoIncrement: true }) };
//
// const timestampFields = {
//   createdAt: integer("created_at", { mode: "timestamp" })
//     .default(sql`(strftime('%s', 'now'))`)
//     .notNull()
//     .$type<Date>(),
//   updatedAt: integer("updated_at", { mode: "timestamp" })
//     .default(sql`(strftime('%s', 'now'))`)
//     .$onUpdateFn(() => sql`(strftime('%s', 'now'))`)
//     .notNull()
//     .$type<Date>(),
// };
//
// export interface CreateTableWithMetadataOptions {
//   /* Include an id field. Default: true */
//   withId?: boolean;
//   /* Include timestamps (createdAt, updatedAt). Default: true */
//   withTimestamps?: boolean;
// }
//
// // Helper for creating tables with standard fields
// export function createTableWithMetadata<
//   TTableName extends string,
//   TColumnsMap extends Record<string, SQLiteColumnBuilderBase>,
// >(
//   name: TTableName,
//   columns: TColumnsMap,
//   extraConfig?: (
//     self: BuildColumns<TTableName, TColumnsMap, "sqlite">,
//   ) => SQLiteTableExtraConfig,
//   options?: CreateTableWithMetadataOptions,
// ): SQLiteTableWithColumns<{
//   name: TTableName;
//   schema: string | undefined;
//   columns: BuildColumns<TTableName, TColumnsMap, "sqlite">;
//   dialect: "sqlite";
// }> {
//   const { withId = true, withTimestamps = true } = options || {};
//
//   let fields = columns;
//   if (withId) {
//     fields = { ...idField, ...fields };
//   }
//   if (withTimestamps) {
//     fields = { ...fields, ...timestampFields };
//   }
//
//   return sqliteTable(name, fields, extraConfig);
// }
//
