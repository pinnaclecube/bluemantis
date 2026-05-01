import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, tasksTable } from "@workspace/db";
import {
  CreateTaskBody,
  UpdateTaskBody,
  GetTaskParams,
  UpdateTaskParams,
  DeleteTaskParams,
  ListTasksQueryParams,
  ListTasksResponse,
  GetTaskResponse,
  UpdateTaskResponse,
} from "@workspace/api-zod";
import { plmService } from "../services/plmService";
import type { DevCopilotTask } from "../../../../shared/types/task";

const router: IRouter = Router();

// ---------------------------------------------------------------------------
// PLM task → DB row mapping
// ---------------------------------------------------------------------------

const PLM_TYPE_MAP: Record<string, string> = {
  epic: "feature",
  feature: "feature",
  story: "story",
  task: "chore",
  bug: "bug",
};

const PLM_PRIORITY_MAP: Record<number, string> = {
  1: "critical",
  2: "high",
  3: "medium",
  4: "low",
};

function plmTaskToInsert(task: DevCopilotTask): typeof tasksTable.$inferInsert {
  return {
    externalId: task.id,
    source: task.source,
    type: PLM_TYPE_MAP[task.type] ?? "chore",
    title: task.title,
    description: task.description || null,
    acceptanceCriteria:
      task.acceptanceCriteria.length > 0 ? task.acceptanceCriteria.join("\n") : null,
    priority: PLM_PRIORITY_MAP[task.priority] ?? "medium",
    status: "open",
  };
}

// ---------------------------------------------------------------------------
// GET /tasks — sync from PLM then return DB tasks
// ---------------------------------------------------------------------------

router.get("/tasks", async (req, res): Promise<void> => {
  const parsed = ListTasksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { repositoryId, status, source, type } = parsed.data;

  // PLM sync: fetch, find new tasks, batch-insert
  try {
    const plmTasks = await plmService.fetchAllTasks();

    if (plmTasks.length > 0) {
      const existing = await db
        .select({ externalId: tasksTable.externalId, source: tasksTable.source })
        .from(tasksTable);

      const existingSet = new Set(
        existing
          .filter((r) => r.externalId)
          .map((r) => `${r.source}:${r.externalId}`),
      );

      const newTasks = plmTasks
        .filter((t) => !existingSet.has(`${t.source}:${t.id}`))
        .map(plmTaskToInsert);

      if (newTasks.length > 0) {
        await db.insert(tasksTable).values(newTasks);
        req.log.info({ count: newTasks.length }, "PLM tasks synced to DB");
      }
    }
  } catch (err) {
    req.log.warn({ err }, "PLM sync failed — returning DB tasks only");
  }

  const conditions: SQL[] = [];
  if (repositoryId != null) conditions.push(eq(tasksTable.repositoryId, repositoryId));
  if (status != null) conditions.push(eq(tasksTable.status, status));
  if (source != null) conditions.push(eq(tasksTable.source, source));
  if (type != null) conditions.push(eq(tasksTable.type, type));

  const tasks = await db
    .select()
    .from(tasksTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(tasksTable.createdAt);
  res.json(ListTasksResponse.parse(tasks));
});

router.post("/tasks", async (req, res): Promise<void> => {
  const parsed = CreateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid request body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [task] = await db.insert(tasksTable).values(parsed.data).returning();
  res.status(201).json(GetTaskResponse.parse(task));
});

router.get("/tasks/:id", async (req, res): Promise<void> => {
  const params = GetTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [task] = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.id, params.data.id));
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(GetTaskResponse.parse(task));
});

router.patch("/tasks/:id", async (req, res): Promise<void> => {
  const params = UpdateTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateTaskBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [task] = await db
    .update(tasksTable)
    .set(parsed.data)
    .where(eq(tasksTable.id, params.data.id))
    .returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.json(UpdateTaskResponse.parse(task));
});

router.delete("/tasks/:id", async (req, res): Promise<void> => {
  const params = DeleteTaskParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [task] = await db
    .delete(tasksTable)
    .where(eq(tasksTable.id, params.data.id))
    .returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
