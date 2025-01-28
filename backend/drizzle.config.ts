import { defineConfig } from "drizzle-kit";
import { dbUrl } from "./database/database";

export default defineConfig({
  out: "./database/migration",
  schema: "./database/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: dbUrl,
  },
  verbose: true,
  strict: true,
});
