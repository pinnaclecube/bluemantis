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

## Database Schema

- **repositories**: id, name, provider, url, defaultBranch, stackProfile (JSONB), createdAt
- **tasks**: id, externalId, source, type, title, description, acceptanceCriteria, priority, status, linkedCommit, repositoryId (FK), createdAt, updatedAt

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

## API Endpoints (key)

- `GET /api/repositories` — list repos
- `GET /api/repositories/:id` — get repo
- `GET /api/repositories/:repoId/stack` — detect+save stack profile (calls gitService → detectStack → DB update)
- `GET/POST/PATCH/DELETE /api/tasks` — task CRUD
- `GET /api/dashboard/stats` — dashboard statistics

## Sidebar Stack Profile

When navigating to `/repositories/:id`, the sidebar automatically shows a **Stack** panel reading from `repo.stackProfile`. The refresh button re-calls `GET /api/repositories/:repoId/stack` to re-detect.

## Environment Variables

See `.env.example` for all required environment variables:
- `DATABASE_URL`
- `AZURE_DEVOPS_ORG`, `AZURE_DEVOPS_PAT`
- `JIRA_DOMAIN`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
- `GITHUB_TOKEN`, `AZURE_REPOS_TOKEN`
- `GIT_PROVIDER` (github | azure-repos)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
