import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://1234:1234@localhost:5432/public",
});

export const db = drizzle(pool);
