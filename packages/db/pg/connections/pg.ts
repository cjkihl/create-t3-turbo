import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { type DbClientOptions } from "../..";

let _client: DbClient | undefined = undefined;

export const getClient = ({ connectionString }: DbClientOptions) => {
  if (!_client) {
    _client = createDbClient({ connectionString });
  }
  return _client;
};

const createDbClient = ({ connectionString }: DbClientOptions) => {
  const connection = new Pool({ connectionString });
  return drizzle(connection);
};

export type DbClient = ReturnType<typeof createDbClient>;

export * from "../schema";
