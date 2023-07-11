// Choose driver here TODO edge environments don't support dynamic imports yet
//export * from "./pg/connections/postgres";
// export * from "./pg/connections/neon";
// export * from "./mysql2/connections/mysql2";
export * from "./mysql2/connections/planetscale";

export interface DbClientOptions {
  connectionString: string;
}
