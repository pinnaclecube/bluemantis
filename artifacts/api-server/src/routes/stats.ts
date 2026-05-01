import { Router, type IRouter } from "express";
import { sql, eq } from "drizzle-orm";
import { db, tasksTable, repositoriesTable } from "@workspace/db";
import {
  GetDashboardStatsResponse,
  GetTasksByStatusResponse,
  GetTasksBySourceResponse,
  GetRecentActivityResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/dashboard", async (req, res): Promise<void> => {
  const userId = req.userId;

  const [repoCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(repositoriesTable)
    .where(eq(repositoriesTable.userId, userId));

  const [taskStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      open: sql<number>`count(*) filter (where status = 'open')::int`,
      inProgress: sql<number>`count(*) filter (where status = 'in-progress')::int`,
      completed: sql<number>`count(*) filter (where status = 'done')::int`,
      linkedCommits: sql<number>`count(*) filter (where linked_commit is not null)::int`,
    })
    .from(tasksTable)
    .where(eq(tasksTable.userId, userId));

  res.json(
    GetDashboardStatsResponse.parse({
      totalRepositories: repoCount?.count ?? 0,
      totalTasks: taskStats?.total ?? 0,
      openTasks: taskStats?.open ?? 0,
      inProgressTasks: taskStats?.inProgress ?? 0,
      completedTasks: taskStats?.completed ?? 0,
      linkedCommits: taskStats?.linkedCommits ?? 0,
    }),
  );
});

router.get("/stats/tasks-by-status", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      status: tasksTable.status,
      count: sql<number>`count(*)::int`,
    })
    .from(tasksTable)
    .where(eq(tasksTable.userId, req.userId))
    .groupBy(tasksTable.status);

  res.json(GetTasksByStatusResponse.parse(rows));
});

router.get("/stats/tasks-by-source", async (req, res): Promise<void> => {
  const rows = await db
    .select({
      source: tasksTable.source,
      count: sql<number>`count(*)::int`,
    })
    .from(tasksTable)
    .where(eq(tasksTable.userId, req.userId))
    .groupBy(tasksTable.source);

  res.json(GetTasksBySourceResponse.parse(rows));
});

router.get("/stats/recent-activity", async (req, res): Promise<void> => {
  const tasks = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.userId, req.userId))
    .orderBy(sql`${tasksTable.updatedAt} desc`)
    .limit(10);

  res.json(GetRecentActivityResponse.parse(tasks));
});

export default router;
