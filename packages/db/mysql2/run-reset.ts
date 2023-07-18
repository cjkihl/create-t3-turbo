import { sql } from "drizzle-orm";

import config from "../drizzle.config";
import { getClient } from "./connections/mysql2";

void (async () => {
  try {
    console.log("Clearing database...");
    const client = getClient({
      connectionString: config.dbCredentials.connectionString,
    });
    await client.execute(
      sql`DROP SCHEMA IF EXISTS public CASCADE; DROP SCHEMA IF EXISTS drizzle CASCADE; CREATE SCHEMA public;`,
    );

    console.log("Clean complete!");
  } catch (error) {
    console.error("Error reset datase:", error);
  } finally {
    process.exit();
  }
})();
