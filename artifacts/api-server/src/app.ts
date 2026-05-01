import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// Clerk proxy must be mounted BEFORE body parsers (streams raw bytes)
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve publishable key from request host so same server can serve multiple
// Clerk custom domains. Falls back to CLERK_PUBLISHABLE_KEY env var.
app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

// ---------------------------------------------------------------------------
// Rate limiting — AI suggestion routes are expensive; cap at 20 req/min
// ---------------------------------------------------------------------------
const suggestionsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many suggestion requests — please wait a moment before retrying" },
  handler(req, res, _next, options) {
    logger.warn({ ip: req.ip, url: req.url }, "Rate limit exceeded on suggestions endpoint");
    res.status(options.statusCode).json(options.message);
  },
});

app.use("/api/tasks/:taskId/suggestions", suggestionsLimiter);

app.use("/api", router);

// ---------------------------------------------------------------------------
// Error handler — must be last and have 4 params for Express to recognise it
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Internal server error";
  const status =
    typeof (err as { status?: number }).status === "number"
      ? (err as { status: number }).status
      : 500;

  if (status >= 500) {
    logger.error({ err, method: req.method, url: req.url }, "Unhandled error");
  } else {
    logger.warn({ err, method: req.method, url: req.url }, "Request error");
  }

  res.status(status).json({ error: message });
});

export default app;
