import { mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";

export const posts = mysqlTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("name", { length: 255 }).notNull(),
  content: varchar("name", { length: 255 }).notNull(),
});
