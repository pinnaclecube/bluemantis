import { validateEnv } from "./lib/env";

// Validate environment before importing anything else that might throw
validateEnv();

import app from "./app";
import { logger } from "./lib/logger";
import { loadConfigsFromDb } from "./services/configService";

const port = Number(process.env["PORT"]);

// Load integration credentials stored in DB into process.env so all
// adapters pick them up without modification, then start listening.
loadConfigsFromDb()
  .catch((err) => {
    logger.warn({ err }, "DB config load failed — starting without persisted configs");
  })
  .finally(() => {
    app.listen(port, (err) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }
      logger.info({ port }, "Server listening");
    });
  });
