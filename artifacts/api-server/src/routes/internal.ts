import { Router, type IRouter, type Request, type Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { executeRun } from "../services/runService.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

// How many due runs one dispatch tick claims. Kept small so a single serverless
// invocation stays well under its time budget; the cron fires every 5 min and
// drains the backlog across ticks.
const DISPATCH_BATCH = 2;
// A running row older than this is considered stuck (its serverless invocation
// died before it could record success/failure) and is swept to failed.
const STUCK_MINUTES = 20;

/**
 * Constant-time-ish bearer check against CRON_SECRET. Vercel Cron sends
 * `Authorization: Bearer <CRON_SECRET>` when the secret is configured. When no
 * secret is set the endpoint is refused outright (never left open).
 */
function authorized(header: string | undefined): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  if (!header) return false;
  const expected = `Bearer ${secret}`;
  if (header.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= header.charCodeAt(i) ^ expected.charCodeAt(i);
  return diff === 0;
}

/**
 * Cron-only dispatcher (spec §5.4). Not behind requireAuth — mounted before it
 * and guarded by CRON_SECRET. Two jobs each tick:
 *   1. Sweep stuck `running` rows (>20 min) to `failed`.
 *   2. Claim up to DISPATCH_BATCH due `scheduled` rows with FOR UPDATE SKIP
 *      LOCKED so concurrent ticks never grab the same run, flip them to
 *      `queued`, and execute each inline.
 */
async function dispatchHandler(req: Request, res: Response): Promise<void> {
  if (!authorized(req.header("authorization"))) {
    res.sendStatus(401);
    return;
  }

  // 1. Stuck-run sweep.
  const swept = await db.execute(
    sql`UPDATE runs SET status = 'failed', finished_at = now(),
          error = 'Run timed out (no result recorded within ${sql.raw(String(STUCK_MINUTES))} minutes).'
        WHERE status = 'running'
          AND started_at < now() - interval '${sql.raw(String(STUCK_MINUTES))} minutes'
        RETURNING id`,
  );
  const sweptCount = swept.rows.length;

  // 2. Atomically claim due scheduled runs.
  const claimed = await db.execute(
    sql`UPDATE runs SET status = 'queued'
        WHERE id IN (
          SELECT id FROM runs
          WHERE status = 'scheduled' AND scheduled_at <= now()
          ORDER BY scheduled_at
          LIMIT ${sql.raw(String(DISPATCH_BATCH))}
          FOR UPDATE SKIP LOCKED
        )
        RETURNING id`,
  );
  const ids = claimed.rows.map((r) => Number((r as { id: number }).id));

  if (sweptCount > 0 || ids.length > 0) {
    logger.info({ swept: sweptCount, claimed: ids }, "dispatch-runs tick");
  }

  // Execute claimed runs sequentially — each executeRun never throws (it records
  // failure on the row), so one bad run can't abort the batch.
  for (const id of ids) {
    await executeRun(id);
  }

  res.json({ swept: sweptCount, dispatched: ids.length });
}

// Vercel Cron invokes the path with a GET; POST is accepted too for manual
// triggering. Both still require the CRON_SECRET bearer (checked in-handler).
router.get("/internal/dispatch-runs", dispatchHandler);
router.post("/internal/dispatch-runs", dispatchHandler);

export default router;
