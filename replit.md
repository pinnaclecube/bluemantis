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
- `shared/types/task.ts` — Task-related types

## Database Schema

- **repositories**: id, name, provider, url, defaultBranch, stackProfile (JSONB), createdAt
- **tasks**: id, externalId, source, type, title, description, acceptanceCriteria, priority, status, linkedCommit, repositoryId (FK), createdAt, updatedAt

## Server Structure

- `artifacts/api-server/src/routes/` — Express route handlers (repositories, tasks, stats, health)
- `artifacts/api-server/src/stack/` — Stack detection and prompt templates
- `artifacts/api-server/src/adapters/` — External service adapters (Azure DevOps, Jira, GitHub)

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
