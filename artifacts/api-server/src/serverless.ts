import app from "./app";

// Vercel serverless entry point.
//
// An Express app is itself a (req, res) request handler, so Vercel's
// @vercel/node runtime can invoke this default export directly.
//
// Local development still uses src/index.ts, which runs validateEnv() and
// app.listen(). We deliberately do NOT call validateEnv() here: it calls
// process.exit(1) on missing critical vars, which is wrong for a serverless
// function. Required env (DATABASE_URL, Clerk keys, ...) is provided via the
// Vercel project environment variables instead.
export default app;
