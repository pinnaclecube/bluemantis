import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import repositoriesRouter from "./repositories.js";
import tasksRouter from "./tasks.js";
import taskActionsRouter from "./taskActions.js";
import statsRouter from "./stats.js";
import configRouter from "./config.js";
import waitlistRouter from "./waitlist.js";
import contactRouter from "./contact.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

// Public routes (no auth) — must be mounted BEFORE requireAuth.
router.use(waitlistRouter);
router.use(contactRouter);

// All routes below require authentication (including health checks)
router.use(requireAuth);

router.use(healthRouter);
router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use(repositoriesRouter);
router.use(tasksRouter);
router.use(taskActionsRouter);
router.use(statsRouter);
router.use(configRouter);

export default router;
