import { drizzle } from "drizzle-orm/mysql2";
import mysql2 from "mysql2";

import { type DbClientOptions } from "../..";

const _client: DbClient | undefined = undefined;

export const getClient = ({ connectionString }: DbClientOptions) => {
  if (!_client) {
    return createDbClient({ connectionString });
  }
  return _client;
};

const createDbClient = ({ connectionString }: DbClientOptions) => {
  const c = mysql2.createConnection(connectionString);
  return drizzle(c);
};

export type DbClient = ReturnType<typeof createDbClient>;

export * from "../schema";
