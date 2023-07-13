import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

import { type DbClientOptions } from "../..";

let _client: DbClient | undefined = undefined;

export const getClient = ({ connectionString }: DbClientOptions) => {
  if (!_client) {
    _client = createDbClient({ connectionString });
  }
  return _client;
};

const createDbClient = ({ connectionString }: DbClientOptions) => {
  const connection = new Pool({
    connectionString,
  });
  return drizzle(connection);
};

export type DbClient = ReturnType<typeof createDbClient>;

export * from "../schema";
