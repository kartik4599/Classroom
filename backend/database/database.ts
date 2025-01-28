import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const dbUrl = "postgresql://postgres:root@localhost:5432/classroom";

const client = postgres(dbUrl);

export default drizzle(client, { schema });
