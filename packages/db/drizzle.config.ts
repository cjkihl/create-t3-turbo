import type { Config } from "drizzle-kit";

import { env } from "./env.mjs";

const driver = env.DATABASE_URL.startsWith("postgres") ? "pg" : "mysql2";

export default {
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  schema: `${driver}/schema/*`,
  out: `${driver}/.drizzle`,
  driver,
} satisfies Config;
