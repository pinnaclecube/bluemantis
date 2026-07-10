import { Router, type IRouter } from "express";
import { eq, and, type SQL } from "drizzle-orm";
import { db, tasksTable, repositoriesTable } from "@workspace/db";
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
const router: IRouter = Router();

// ---------------------------------------------------------------------------
// GET /tasks — list the user's tasks (scoped). PLM hierarchy sync now happens
// per-project via POST /api/projects/:id/sync (Phase 2), not on every GET.
// ---------------------------------------------------------------------------

router.get("/tasks", async (req, res): Promise<void> => {
  const parsed = ListTasksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { repositoryId, status, source, type } = parsed.data;
  const userId = req.userId;

  const conditions: SQL[] = [eq(tasksTable.userId, userId)];
  if (repositoryId != null) conditions.push(eq(tasksTable.repositoryId, repositoryId));
  if (status != null) conditions.push(eq(tasksTable.status, status));
  if (source != null) conditions.push(eq(tasksTable.source, source));
  if (type != null) conditions.push(eq(tasksTable.type, type));

  const tasks = await db
    .select()
    .from(tasksTable)
    .where(and(...conditions))
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
  if (parsed.data.repositoryId != null) {
    const [repo] = await db
      .select({ id: repositoriesTable.id })
      .from(repositoriesTable)
      .where(and(eq(repositoriesTable.id, parsed.data.repositoryId), eq(repositoriesTable.userId, req.userId)));
    if (!repo) {
      res.status(403).json({ error: "Repository access denied" });
      return;
    }
  }
  const [task] = await db
    .insert(tasksTable)
    .values({ ...parsed.data, userId: req.userId })
    .returning();
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
    .where(and(eq(tasksTable.id, params.data.id), eq(tasksTable.userId, req.userId)));
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
  if (parsed.data.repositoryId != null) {
    const [repo] = await db
      .select({ id: repositoriesTable.id })
      .from(repositoriesTable)
      .where(and(eq(repositoriesTable.id, parsed.data.repositoryId), eq(repositoriesTable.userId, req.userId)));
    if (!repo) {
      res.status(403).json({ error: "Repository access denied" });
      return;
    }
  }
  const [task] = await db
    .update(tasksTable)
    .set(parsed.data)
    .where(and(eq(tasksTable.id, params.data.id), eq(tasksTable.userId, req.userId)))
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
    .where(and(eq(tasksTable.id, params.data.id), eq(tasksTable.userId, req.userId)))
    .returning();
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
