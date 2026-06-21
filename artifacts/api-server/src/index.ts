import { validateEnv } from "./lib/env.js";

validateEnv();

import app from "./app.js";
import { logger } from "./lib/logger.js";

const port = Number(process.env["PORT"]);

app.listen(port, (err: Error | undefined) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});
