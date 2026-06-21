import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import repositoriesRouter from "./repositories.js";
import tasksRouter from "./tasks.js";
import taskActionsRouter from "./taskActions.js";
import statsRouter from "./stats.js";
import configRouter from "./config.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router: IRouter = Router();

// All routes require authentication (including health checks)
router.use(requireAuth);

router.use(healthRouter);
router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use(repositoriesRouter);
router.use(tasksRouter);
router.use(taskActionsRouter);
router.use(statsRouter);
router.use(configRouter);

export default router;
