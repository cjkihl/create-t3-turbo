import { migrate } from "drizzle-orm/mysql2/migrator";

import config from "../drizzle.config";
import { getClient } from "./connections/mysql2";

void (async () => {
  try {
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
