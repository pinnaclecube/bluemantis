import { Router, type IRouter } from "express";
import healthRouter from "./health";
import repositoriesRouter from "./repositories";
import tasksRouter from "./tasks";
import taskActionsRouter from "./taskActions";
import statsRouter from "./stats";
import configRouter from "./config";

const router: IRouter = Router();

router.use(healthRouter);

// GET /health alias (in addition to /healthz)
router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use(repositoriesRouter);
router.use(tasksRouter);
router.use(taskActionsRouter);
router.use(statsRouter);
router.use(configRouter);

export default router;
