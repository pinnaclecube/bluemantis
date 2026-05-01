import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, repositoriesTable } from "@workspace/db";
import {
  CreateRepositoryBody,
  UpdateRepositoryBody,
  GetRepositoryParams,
  UpdateRepositoryParams,
  DeleteRepositoryParams,
  DetectRepositoryStackParams,
  DetectRepositoryStackResponse,
  ListRepositoriesResponse,
  GetRepositoryResponse,
  UpdateRepositoryResponse,
} from "@workspace/api-zod";
import { detectStack } from "../stack/detector";
import { fetchFilePaths } from "../adapters/gitService";

const router: IRouter = Router();

router.get("/repositories/:repoId/stack", async (req, res): Promise<void> => {
  const params = DetectRepositoryStackParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [repo] = await db
    .select()
    .from(repositoriesTable)
    .where(eq(repositoriesTable.id, params.data.repoId));

  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }

  req.log.info({ repoId: repo.id, provider: repo.provider }, "Fetching file list for stack detection");
  const filePaths = await fetchFilePaths(repo.provider, repo.url, repo.defaultBranch);

  const stackProfile = await detectStack(filePaths);

  await db
    .update(repositoriesTable)
    .set({ stackProfile })
    .where(eq(repositoriesTable.id, repo.id));

  req.log.info({ repoId: repo.id, stackProfile }, "Stack profile saved");
  res.json(DetectRepositoryStackResponse.parse(stackProfile));
});

router.get("/repositories", async (req, res): Promise<void> => {
  const repos = await db
    .select()
    .from(repositoriesTable)
    .orderBy(repositoriesTable.createdAt);
  res.json(ListRepositoriesResponse.parse(repos));
});

router.post("/repositories", async (req, res): Promise<void> => {
  const parsed = CreateRepositoryBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid request body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [repo] = await db
    .insert(repositoriesTable)
    .values(parsed.data as typeof repositoriesTable.$inferInsert)
    .returning();
  res.status(201).json(GetRepositoryResponse.parse(repo));
});

router.get("/repositories/:id", async (req, res): Promise<void> => {
  const params = GetRepositoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [repo] = await db
    .select()
    .from(repositoriesTable)
    .where(eq(repositoriesTable.id, params.data.id));
  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }
  res.json(GetRepositoryResponse.parse(repo));
});

router.patch("/repositories/:id", async (req, res): Promise<void> => {
  const params = UpdateRepositoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateRepositoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [repo] = await db
    .update(repositoriesTable)
    .set(parsed.data as Partial<typeof repositoriesTable.$inferInsert>)
    .where(eq(repositoriesTable.id, params.data.id))
    .returning();
  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }
  res.json(UpdateRepositoryResponse.parse(repo));
});

router.delete("/repositories/:id", async (req, res): Promise<void> => {
  const params = DeleteRepositoryParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [repo] = await db
    .delete(repositoriesTable)
    .where(eq(repositoriesTable.id, params.data.id))
    .returning();
  if (!repo) {
    res.status(404).json({ error: "Repository not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
