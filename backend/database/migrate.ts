import postgres from "postgres";
import { dbUrl } from "./database";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const migrationClient = postgres(dbUrl, { max: 1 });

(async () => {
  console.log("-----STATRTING MIGRATION-----");

  await migrate(drizzle(migrationClient), {
    migrationsFolder: "./database/migration",
  });

  await migrationClient.end();

  console.log("-----MIGRATION COMPLETED-----");
})();
