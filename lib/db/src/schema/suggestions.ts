import { pgTable, serial, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { runsTable } from "./runs";

/**
 * A persisted agent suggestion produced by a run. Mirrors the CodeSuggestion
 * shape (shared/types/codeSuggestion.ts) so runs can be committed from later.
 */
export const suggestionsTable = pgTable(
  "suggestions",
  {
    id: serial("id").primaryKey(),
    runId: integer("run_id")
      .notNull()
      .references(() => runsTable.id, { onDelete: "cascade" }),
    agent: text("agent").$type<"claude" | "openai" | "copilot" | "antigravity">().notNull(),
    code: text("code").notNull(),
    explanation: text("explanation").notNull(),
    filePath: text("file_path").notNull(),
    language: text("language").notNull(),
    score: integer("score"),
    recommendation: text("recommendation"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("suggestions_run_id_idx").on(t.runId)],
);

export const insertSuggestionSchema = createInsertSchema(suggestionsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSuggestion = z.infer<typeof insertSuggestionSchema>;
export type Suggestion = typeof suggestionsTable.$inferSelect;
