import { validateEnv } from "./lib/env";

// Validate environment before importing anything else that might throw
validateEnv();

import app from "./app";
import { logger } from "./lib/logger";

const port = Number(process.env["PORT"]);

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});
