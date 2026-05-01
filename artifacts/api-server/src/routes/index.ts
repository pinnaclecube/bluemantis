import { Router, type IRouter } from "express";
import healthRouter from "./health";
import repositoriesRouter from "./repositories";
import tasksRouter from "./tasks";
import taskActionsRouter from "./taskActions";
import statsRouter from "./stats";
import configRouter from "./config";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

// Health check is public
router.use(healthRouter);
router.get("/health", (_req, res) => res.json({ status: "ok" }));

// All other routes require authentication
router.use(requireAuth);

router.use(repositoriesRouter);
router.use(tasksRouter);
router.use(taskActionsRouter);
router.use(statsRouter);
router.use(configRouter);

export default router;
