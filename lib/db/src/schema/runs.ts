import { pgTable, serial, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { projectsTable } from "./projects";
import { tasksTable } from "./tasks";

export type RunStatus =
  | "scheduled"
  | "queued"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled";

/**
 * A durable execution of the agent pipeline against a work item. Every run
 * (manual or scheduled) is a row here so background/scheduled runs have somewhere
 * to persist results (there is no HTTP response to return to).
 */
export const runsTable = pgTable(
  "runs",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    projectId: integer("project_id")
      .notNull()
      .references(() => projectsTable.id, { onDelete: "cascade" }),
    workItemId: integer("work_item_id")
      .notNull()
      .references(() => tasksTable.id, { onDelete: "cascade" }),
    status: text("status").$type<RunStatus>().notNull(),
    trigger: text("trigger").$type<"manual" | "scheduled">().notNull(),
    refinePrompt: text("refine_prompt"),
    autoCommit: boolean("auto_commit").notNull().default(false),
    scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    error: text("error"),
    prUrl: text("pr_url"),
    commitHash: text("commit_hash"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("runs_user_id_idx").on(t.userId),
    // Dispatcher query: scheduled runs that are due, ordered by time.
    index("runs_status_scheduled_idx").on(t.status, t.scheduledAt),
  ],
);

export const insertRunSchema = createInsertSchema(runsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertRun = z.infer<typeof insertRunSchema>;
export type Run = typeof runsTable.$inferSelect;
