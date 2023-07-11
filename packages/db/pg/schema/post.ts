import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("name", { length: 255 }).notNull(),
  content: varchar("name", { length: 255 }).notNull(),
});
