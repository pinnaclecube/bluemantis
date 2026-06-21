// Vercel serverless function entry.
//
// This is intentionally a plain .js file that re-exports the esbuild-bundled
// handler (dist/serverless.mjs, produced by build.mjs from src/serverless.ts).
//
// Why a JS shim instead of pointing @vercel/node at the TS source:
// @vercel/node runs its own TypeScript compile/typecheck on .ts entrypoints
// with stricter, different module/@types resolution than our tsconfig — which
// fails to resolve @types/express through the pnpm-isolated store and breaks
// the Express types. By shipping already-built JS, @vercel/node bundles plain
// JavaScript (esbuild, no typecheck) and never resolves TS types. Type safety
// is still enforced separately via `pnpm --filter @workspace/api-server typecheck`.
//
// The bundle is built before this builder runs via the `installCommand` in the
// root vercel.json (pnpm install && build the api-server).
export { default } from "../dist/serverless.mjs";
