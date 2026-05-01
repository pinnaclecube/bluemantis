import { Router, type IRouter } from "express";
import healthRouter from "./health";
import repositoriesRouter from "./repositories";
import tasksRouter from "./tasks";
import taskActionsRouter from "./taskActions";
import statsRouter from "./stats";
import configRouter from "./config";
import { requireAuth } from "../middlewares/requireAuth";

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
