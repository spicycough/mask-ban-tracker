import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./index";

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "./migrations",
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

main();
