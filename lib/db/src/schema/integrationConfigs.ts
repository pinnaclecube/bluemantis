import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const integrationConfigsTable = pgTable("integration_configs", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type IntegrationConfig = typeof integrationConfigsTable.$inferSelect;
