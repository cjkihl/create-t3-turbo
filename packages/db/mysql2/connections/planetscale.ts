import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import { type DbClientOptions } from "../..";

let _client: DbClient | undefined = undefined;

export const getClient = ({ connectionString }: DbClientOptions) => {
  if (!_client) {
    _client = createDbClient({ connectionString });
  }
  return _client;
};

export const createDbClient = ({ connectionString }: DbClientOptions) => {
  const connection = connect({ url: connectionString });
  return drizzle(connection);
};

export type DbClient = ReturnType<typeof createDbClient>;

export * from "../schema";
