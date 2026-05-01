import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const integrationConfigsTable = pgTable(
  "integration_configs",
  {
    userId: text("user_id").notNull(),
    key: text("key").notNull(),
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.userId, t.key] })],
);

export type IntegrationConfig = typeof integrationConfigsTable.$inferSelect;
