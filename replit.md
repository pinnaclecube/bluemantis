# DevCopilot Workspace

## Overview

DevCopilot is an AI-powered developer task management assistant that connects to Azure DevOps, Jira, and GitHub. It helps software teams track tasks linked to code commits across multiple repositories with full stack detection.

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui

## Artifacts

- `artifacts/api-server` — Express 5 REST API (path: `/api`)
- `artifacts/dev-copilot` — React + Vite frontend (path: `/`)

## Shared Libraries

- `lib/api-spec` — OpenAPI spec + codegen config
- `lib/api-client-react` — Generated React Query hooks (from OpenAPI)
- `lib/api-zod` — Generated Zod validation schemas (from OpenAPI)
- `lib/db` — PostgreSQL Drizzle ORM schemas and client

## Shared Types

- `shared/types/stack.ts` — `StackProfile` type
- `shared/types/task.ts` — DB `Task` type, `DevCopilotTask` interface (PLM canonical shape), `PLMAdapter` interface
- `shared/types/codeSuggestion.ts` — `CodeSuggestion` interface (agent, code, explanation, filePath, language, score, recommendation)

## Authentication

Multi-tenant auth via **Clerk** (`@clerk/express` on the backend, `@clerk/react` on the frontend):
- Backend: `clerkMiddleware` + `requireAuth` middleware applied to ALL `/api` routes (including `/api/healthz`)
- Frontend: `ClerkProvider` wraps the entire app; unauthenticated users are redirected to `/sign-in`
- Sidebar shows real user avatar/name from `useUser()`; sign-out via `useClerk().signOut()`
- Secret env vars: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PUBLISHABLE_KEY`

## Database Schema

- **integration_configs**: (user_id, key) composite PK, value, updatedAt — stores per-user API credentials
- **repositories**: id, **user_id** (NOT NULL), name, provider, url, defaultBranch, stackProfile (JSONB), createdAt
- **tasks**: id, **user_id** (NOT NULL), externalId, source, type, title, description, acceptanceCriteria, priority, status, linkedCommit, repositoryId (FK), createdAt, updatedAt

## Server Structure

- `artifacts/api-server/src/routes/` — Express route handlers (repositories, tasks, stats, health)
- `artifacts/api-server/src/stack/detector.ts` — Stack detection logic; exports `StackProfile` type inline
- `artifacts/api-server/src/stack/prompts.ts` — AI prompt builder per framework stack
- `artifacts/api-server/src/adapters/gitService.ts` — Fetches repo file trees from GitHub or Azure Repos
- `artifacts/api-server/src/adapters/azureDevOpsAdapter.ts` — PLM adapter: WIQL fetch, HTML-strip, PAT auth, closeTask via PATCH
- `artifacts/api-server/src/adapters/jiraAdapter.ts` — PLM adapter: JQL sprint fetch, ADF→text parsing, AC field discovery, transition-based close
- `artifacts/api-server/src/services/plmService.ts` — Merges & deduplicates tasks from both PLM adapters with per-adapter error isolation
- `artifacts/api-server/src/services/gitService.ts` — Git integration service; GitHub via @octokit/rest, Azure Repos via REST; auto-detects stack on first connect
- `artifacts/api-server/src/services/aiService.ts` — AI orchestration: AIOrchestrator (Claude + OpenAI + mocks in parallel) and SynthesisEngine (Claude scoring + ranking)

## API Endpoints

- `GET /api/health` / `GET /api/healthz` — health check
- `GET /api/repositories` — list repos
- `POST /api/repositories` — create repo; auto-runs GitService stack detection on first connect
- `GET /api/repositories/:id` — get repo
- `PATCH /api/repositories/:id` — update repo
- `DELETE /api/repositories/:id` — delete repo
- `GET /api/repositories/:repoId/stack` — re-detect + save stack profile
- `GET /api/tasks` — list tasks, syncs new tasks from PLM adapters before returning
- `POST /api/tasks` — create task manually
- `GET /api/tasks/:id` / `PATCH /api/tasks/:id` / `DELETE /api/tasks/:id` — task CRUD
- `POST /api/tasks/:taskId/suggestions` — fetch file context → AI suggestions → ranked CodeSuggestion[]
- `POST /api/tasks/:taskId/commit` — create branch + commit + open PR, update task to "review"
- `POST /api/tasks/:taskId/complete` — close in PLM + mark task "done"
- `GET /api/dashboard/stats` — dashboard statistics

## Error Handling

Global error middleware in `app.ts` catches all unhandled errors and returns `{ error: message }` with appropriate HTTP status. Express 5 async errors propagate automatically.

React `ErrorBoundary` component (`artifacts/dev-copilot/src/components/ErrorBoundary.tsx`) wraps the entire app — shows a styled fallback with "Try again" (resets state) and "Go home" buttons. Shows full stack trace in dev mode only.

## Rate Limiting

`express-rate-limit` applied to `POST /api/tasks/:taskId/suggestions` only (expensive AI calls):
- **20 requests per minute** per IP
- Returns HTTP 429 with `{ error: "Too many suggestion requests…" }` when exceeded
- Logs a warning via pino on each violation

## Environment Validation

`artifacts/api-server/src/lib/env.ts` validates all known env vars at startup:
- **Critical** (`PORT`, `DATABASE_URL`): server exits with `logger.fatal` if missing
- **Optional** (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, git/PLM tokens): logs info-level warning listing which are absent; related features degrade gracefully

## Sidebar Stack Profile

When navigating to `/repositories/:id`, the sidebar automatically shows a **Stack** panel reading from `repo.stackProfile`. The refresh button re-calls `GET /api/repositories/:repoId/stack` to re-detect.

## Frontend Pages

- `/` → `TasksPage` — task list with PLM source/type/priority badges, "Generate code" button
- `/workspace/:taskId` → `WorkspacePage` — 3-column: task details + checklist, code suggestions (react-syntax-highlighter), action panel (commit + complete + workflow stepper)
- `/dashboard`, `/repositories/*`, `/tasks/*` — legacy views still accessible via sidebar

## Environment Variables

| Variable | Critical | Description |
|----------|----------|-------------|
| `PORT` | ✅ | API server port (set by Replit) |
| `DATABASE_URL` | ✅ | PostgreSQL connection URL (set by Replit) |
| `SESSION_SECRET` | ⚠️ | Session signing secret |
| `ANTHROPIC_API_KEY` | ❌ | Claude API key |
| `OPENAI_API_KEY` | ❌ | OpenAI API key |
| `GITHUB_TOKEN` | ❌ | GitHub PAT |
| `AZURE_REPOS_TOKEN` | ❌ | Azure Repos PAT |
| `ADO_ORG` + `ADO_TOKEN` | ❌ | Azure DevOps PLM sync |
| `JIRA_DOMAIN` + `JIRA_EMAIL` + `JIRA_TOKEN` | ❌ | Jira PLM sync |

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm run db:migrate` — apply DB schema via Drizzle Kit push
- `pnpm run db:studio` — open Drizzle Studio UI
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
