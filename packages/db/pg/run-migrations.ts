import { migrate } from "drizzle-orm/postgres-js/migrator";

import config from "../drizzle.config";
import { getClient } from "./connections/postgres";

void (async () => {
  try {
    console.log("Running migrations...");
    const client = getClient({
      connectionString: config.dbCredentials.connectionString,
    });
    await migrate(client, { migrationsFolder: config.out });
    console.log("Migrations complete!");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    process.exit();
  }
})();
