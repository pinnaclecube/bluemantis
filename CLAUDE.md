# Blue Mantis — Project Knowledge for AI Assistants

## What this project is

Blue Mantis is an **AI-powered developer task management assistant**. It connects to Azure DevOps, Jira, and GitHub, syncs open work items, and uses multiple AI agents (Claude + OpenAI) to generate, debate, and rank code suggestions. One click creates a branch, commits the chosen code, opens a PR, and closes the source ticket.

The workspace has two user-facing products sharing one backend:
- **Marketing site** (`artifacts/blue-mantis`) — public, at path `/`
- **App** (`artifacts/dev-copilot`) — authenticated, at path `/app`
- **API** (`artifacts/api-server`) — Express REST server, at path `/api`

---

## Monorepo layout

```
artifacts/
  api-server/       Express 5 REST API (path: /api)
  blue-mantis/      React + Vite marketing site (path: /)
  dev-copilot/      React + Vite app (path: /app)
  mockup-sandbox/   Isolated component preview server (path: /__mockup)
lib/
  api-spec/         OpenAPI spec + Orval codegen config
  api-client-react/ Generated React Query hooks
  api-zod/          Generated Zod validation schemas
  db/               Drizzle ORM schema + PostgreSQL client
shared/
  types/
    task.ts         Task, DevCopilotTask, PLMAdapter types
    codeSuggestion.ts  CodeSuggestion interface
    stack.ts        StackProfile type
scripts/            Utility scripts (@workspace/scripts)
```

### Path routing (shared reverse proxy)
Traffic is routed by path prefix — no direct port access needed:
- `/api/*` → api-server
- `/app/*` → dev-copilot
- `/*` → blue-mantis
- `/__mockup/*` → mockup-sandbox

**Always use `localhost:80/<path>` for curl/testing, never hit ports directly.**
In application code use relative URLs or `import.meta.env.BASE_URL` — the proxy handles everything.

---

## Tech stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 24 |
| Package manager | pnpm workspaces |
| Language | TypeScript 5.9 (strict) |
| API framework | Express 5 |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod (`zod/v4`) + `drizzle-zod` |
| API contract | OpenAPI 3.1 → Orval codegen |
| Frontend | React + Vite + TailwindCSS + shadcn/ui |
| Auth | Clerk (Replit-managed) |
| Build | esbuild (CJS bundle for API) |

---

## Authentication

**Replit-managed Clerk** — do not touch `dashboard.clerk.com` directly.

- Backend: `@clerk/express` — `clerkMiddleware` in `app.ts`, `requireAuth` middleware on **all** `/api` routes (sets `req.userId`)
- Frontend: `@clerk/react` — `ClerkProvider` wraps the whole app; unauthenticated users are redirected to `/app/sign-in`
- Social providers: Google (always on), GitHub (must be enabled in Auth pane → Configure → SSO providers)
- GitHub OAuth auto-sync: `POST /api/auth/github-sync` — reads the Clerk-held GitHub OAuth token and upserts it as `GITHUB_TOKEN` in `integration_configs`. Called automatically from the frontend `useGitHubSync` hook on every new session.

### Secret env vars
```
CLERK_SECRET_KEY
CLERK_PUBLISHABLE_KEY
VITE_CLERK_PUBLISHABLE_KEY
```

---

## Database schema

Three tables, all in `lib/db/src/schema/`:

### `repositories`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| user_id | text NOT NULL | Clerk user ID — all queries must filter by this |
| name | text | |
| provider | text | `github` or `azure-repos` |
| url | text | |
| default_branch | text | default `main` |
| stack_profile | jsonb | `StackProfile` object |
| created_at | timestamptz | |

### `tasks`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| user_id | text NOT NULL | Clerk user ID |
| external_id | text | PLM system ID |
| source | text | `jira`, `azure-devops`, `manual` |
| type | text | `feature`, `bug`, `chore`, `story` |
| title | text | |
| description | text | |
| acceptance_criteria | text | newline-separated |
| priority | text | `low`, `medium`, `high`, `critical` |
| status | text | `open`, `in-progress`, `review`, `done`, `blocked` |
| linked_commit | text | SHA after commit action |
| repository_id | int FK → repositories | |
| created_at / updated_at | timestamptz | |

### `integration_configs`
| Column | Type | Notes |
|---|---|---|
| user_id | text | } composite PK |
| key | text | } |
| value | text | Stored in plaintext — never log |
| updated_at | timestamptz | auto-updates on write |

**All DB operations must be scoped to `userId`.** There is no shared/global data.

---

## Config keys (integration_configs)

Defined in `artifacts/api-server/src/services/configService.ts`:
```
ANTHROPIC_API_KEY
OPENAI_API_KEY
GOOGLE_GEMINI_API_KEY
GITHUB_COPILOT_TOKEN
GITHUB_TOKEN
AZURE_REPOS_ORG
AZURE_REPOS_TOKEN
AZURE_DEVOPS_ORG
AZURE_DEVOPS_PROJECT
AZURE_DEVOPS_PAT
JIRA_DOMAIN
JIRA_EMAIL
JIRA_API_TOKEN
```

To add a new config key: add it to the `CONFIG_KEYS` array and regenerate codegen if it's exposed via API. The Zod schema for `PUT /api/config` is auto-built from `CONFIG_KEYS`.

---

## API endpoints

All routes require `requireAuth` middleware. `req.userId` is always available inside handlers.

### Health
- `GET /api/healthz` — basic liveness check

### Repositories
- `GET /api/repositories` — list repos for current user
- `POST /api/repositories` — create repo; triggers stack detection automatically
- `GET /api/repositories/:id` — get single repo
- `PATCH /api/repositories/:id` — update repo
- `DELETE /api/repositories/:id` — delete repo
- `GET /api/repositories/:repoId/stack` — re-detect + save stack profile

### Tasks
- `GET /api/tasks` — list tasks; syncs new tasks from PLM before returning
- `POST /api/tasks` — create manual task
- `GET /api/tasks/:id`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Task actions
- `POST /api/tasks/:taskId/suggestions` — AI code suggestions (rate-limited: 20 req/min)
- `POST /api/tasks/:taskId/commit` — create branch + commit + open PR
- `POST /api/tasks/:taskId/complete` — close in PLM + mark task done

### Config
- `GET /api/config` — all config keys with masked values
- `PUT /api/config` / `PATCH /api/config` — save one or more keys
- `DELETE /api/config/:key` — clear a single key
- `POST /api/config/test/:integration` — live connection test
- `POST /api/auth/github-sync` — pull GitHub OAuth token from Clerk + save as `GITHUB_TOKEN`

### Stats
- `GET /api/dashboard/stats` — dashboard statistics

---

## Server architecture

### File structure
```
artifacts/api-server/src/
  app.ts                  Express app setup (middleware, routes, error handler)
  index.ts                Server entry point (env validation + listen)
  lib/
    env.ts                Startup env validation (fatal vs graceful-degraded)
    logger.ts             pino singleton
  middlewares/
    requireAuth.ts        Clerk auth gate; sets req.userId
    clerkProxyMiddleware.ts  Proxies Clerk FAPI requests
  routes/
    index.ts              Mounts all routers; applies requireAuth to everything
    health.ts
    repositories.ts
    tasks.ts
    taskActions.ts
    stats.ts
    config.ts             Config CRUD + /auth/github-sync
  services/
    configService.ts      DB-backed per-user credential store
    gitService.ts         GitHub (Octokit) + Azure Repos operations
    aiService.ts          AIOrchestrator + SynthesisEngine (Claude + OpenAI)
    plmService.ts         Merges Azure DevOps + Jira with error isolation
  adapters/
    gitService.ts         Low-level file-tree fetcher (GitHub + Azure Repos)
    azureDevOpsAdapter.ts WIQL fetch, PAT auth, closeTask via PATCH
    jiraAdapter.ts        JQL sprint fetch, ADF→text, transition-based close
  stack/
    detector.ts           File-path-based stack detection → StackProfile
    prompts.ts            AI prompt builder per framework stack
```

### Logging
**Never use `console.log` in server code.** Use:
- `req.log.info(...)` / `req.log.warn(...)` inside route handlers
- `logger.info(...)` from `lib/logger` everywhere else

### Error handling
Express 5 propagates async errors automatically — no try/catch needed for unhandled throws. The global error handler in `app.ts` returns `{ error: message }` with an appropriate status. Use explicit try/catch only when you need to handle errors gracefully (e.g., return a non-500).

### Rate limiting
Only on `POST /api/tasks/:taskId/suggestions` — 20 req/min per IP. Configured in `app.ts`.

---

## AI code suggestion pipeline

`POST /api/tasks/:taskId/suggestions`:
1. Load task + repo from DB (user-scoped)
2. Fetch task-relevant file paths from Git using keyword extraction + stack-aware extension filtering
3. Fetch content of up to 10 most relevant files
4. `AIOrchestrator` runs Claude + OpenAI in parallel with stack-specific prompts from `stack/prompts.ts`
5. `SynthesisEngine` (Claude) scores and ranks the suggestions
6. Returns `CodeSuggestion[]` sorted by score

`CodeSuggestion` shape:
```typescript
{
  agent: 'claude' | 'openai' | 'copilot' | 'antigravity';
  code: string;
  explanation: string;
  filePath: string;
  language: string;
  score?: number;
  recommendation?: string;
}
```

---

## Commit + PR pipeline

`POST /api/tasks/:taskId/commit` (body: `{ filePath, code, commitMessage }`):
1. Load task + repo
2. Get default branch SHA
3. Create a new branch (`bm/<keyword-slug>`)
4. Commit the file change
5. Open a PR with task title + description
6. Update task status to `review`, store commit hash in `linked_commit`

`POST /api/tasks/:taskId/complete` (body: `{ commitHash }`):
1. Close the task in the PLM system (Azure DevOps PATCH / Jira transition)
2. Update task status to `done`

---

## Stack detection

`detectStack(filePaths: string[]): StackProfile` — infers the user's repo tech stack from file paths alone (no file content). Fields: `frontend`, `backend`, `database`, `language`, `testFramework`, `packageManager`.

Used to:
- Build AI prompts tailored to the user's stack
- Filter relevant files for context (only fetch files with matching extensions)
- Display the Stack panel in the sidebar on the repo detail page

---

## Frontend — dev-copilot (`/app`)

### Key pages
| Route | File | Purpose |
|---|---|---|
| `/app/` | → redirects to `/app/tasks` | |
| `/app/tasks` | `TasksPage.tsx` | Task list with PLM badges + "Generate code" |
| `/app/workspace/:taskId` | `WorkspacePage.tsx` | 3-column: task details, code suggestions, action panel |
| `/app/settings` | `SettingsPage.tsx` | Per-user integration credentials |
| `/app/repositories` | `repositories.tsx` | Repository list |
| `/app/repositories/:id` | `repository-detail.tsx` | Detail + stack panel |
| `/app/dashboard` | `dashboard.tsx` | Stats overview |
| `/app/sign-in` | (Clerk component) | Auth page |
| `/app/sign-up` | (Clerk component) | Auth page |

### Design tokens (`src/styles/tokens.css`)
```css
--bg-app:         #0D0F12
--bg-surface:     #161A1F
--bg-raised:      #1E2329
--border:         #2A2F38
--border-bright:  #3D4450
--text-primary:   #E8EAF0
--text-secondary: #8B92A5
--text-muted:     #555E70
--accent-blue:    #4D9CFF
--accent-purple:  #8B7CF8
--accent-green:   #3DD68C
--accent-amber:   #F5A623
--accent-red:     #F06565
--font-sans:      'Inter', sans-serif
--font-mono:      'JetBrains Mono', monospace
```

Clerk sign-in card: `colorPrimary: #7c6ff7` (purple), `colorBackground: #1a2538` (navy card on `#0D0F12` page).

### Context providers
- `ConfigContext` — loads `GET /api/config` on sign-in; exposes `configMap`, `refreshConfig`, `isAzureConnected`, `isJiraConnected`
- `RepoContext` — tracks the currently selected repository for workspace views

### API client
Direct `fetch` calls in `src/services/api.ts`. No Axios. URLs are relative (`/api/...`) — the proxy handles routing.

---

## Frontend — blue-mantis marketing site (`/`)

### Design tokens (`src/index.css`)
```css
--bg-app:         #0C1E2E   (dark navy)
--bg-surface:     #0E2841
--bg-raised:      #143552
--border:         #1A3D58
--border-bright:  #2A5478
--text-primary:   #F2F2F2
--text-secondary: #B0C4D8
--text-muted:     #607D93
--accent-blue:    #4D94D8
--accent-teal:    #02B8A0
--accent-green:   #A2F0C5
--accent-amber:   #F2F995
--accent-purple:  #8B7CF8
--font-sans:      'Bricolage Grotesque', sans-serif
--font-serif:     'Fraunces', serif
```

### Launch state — routing + the `LAUNCHED` switch
The marketing site currently ships in **pre-launch (waitlist) mode**. Routing lives in `src/App.tsx`, gated by a single flag:

```ts
const LAUNCHED = false; // flip to true at launch
```

| Route | `LAUNCHED = false` (now) | `LAUNCHED = true` (launch) |
|---|---|---|
| `/` | Waitlist / coming-soon page (`HomePage.tsx`) | Full marketing landing page (`LandingPage.tsx`) |
| `/preview` | Full landing page (for review) | Full landing page |
| `/waitlist` | Waitlist page | Waitlist page |
| `/security` | `SecurityPage.tsx` | `SecurityPage.tsx` |

- `HomePage.tsx` = waitlist page (countdown + `POST /api/waitlist`), the live homepage today.
- `LandingPage.tsx` = the full marketing site, assembled from the section components below. It is **prepped but not active** — flip `LAUNCHED`, commit, and redeploy (Replit autoscale, via the Deploy pane) to go live.

### Page sections (in order) — `LandingPage.tsx`
`Navbar` → `HeroSection` → `StatsBar` → `HowItWorks` → `ProductSection` → `ProofSection` → `ROICalculator` → `IntegrationsSection` → `PricingSection` → `Footer`
(`CTASection.tsx` exists but is intentionally excluded from the assembly.)

### Marketing claims — keep them defensible
Landing-page copy must avoid **fabricated metrics / traction** (e.g. exact close rates, NPS, "$X ARR", "N beta teams", LOIs). Use product-fact / directional framing instead (number of agents, one-click flow, integrations). Earlier drafts had invented figures; these were softened for launch — do not reintroduce hard numbers unless they're real and sourced.

### Pre-launch to-do (not blocking, tracked here)
- Real **Privacy policy** and **Terms of service** pages — currently hidden from nav/footer, not stubbed.
- Confirm `sales@getbluemantis.com` is a monitored inbox (used across footer/pricing CTAs).

### CTA routing
All "Start free" / "Sign up" buttons route to `/app/sign-up`. "Sign in" routes to `/app/sign-in`.
Pricing/contact CTAs open `mailto:sales@getbluemantis.com`.

### Scroll reveal
`useScrollReveal` hook uses `react-intersection-observer` — elements start at `opacity: 0` until they enter the viewport. **Do not apply this to the HeroSection** (hero is always in view and will appear blank in screenshots).

---

## OpenAPI + codegen

Contract-first workflow:
1. Edit `lib/api-spec/openapi.yaml`
2. Run `pnpm --filter @workspace/api-spec run codegen`
3. Generated output:
   - `lib/api-client-react/` — React Query hooks
   - `lib/api-zod/` — Zod request/response schemas

**Always use generated Zod schemas for input validation in route handlers**, and generated React Query hooks on the frontend. Do not write these by hand.

After changing the spec, run `pnpm run typecheck:libs` to rebuild lib declarations before checking artifact packages.

---

## Key commands

```bash
pnpm run typecheck           # Full typecheck (libs + all artifacts)
pnpm run typecheck:libs      # Build composite libs only (run after editing lib/*)
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/dev-copilot run typecheck
pnpm --filter @workspace/blue-mantis run typecheck
pnpm run db:migrate          # Apply DB schema via Drizzle Kit push
pnpm run db:studio           # Open Drizzle Studio UI
pnpm --filter @workspace/api-spec run codegen   # Regenerate API hooks + Zod schemas
```

---

## Environment variables

| Variable | Critical | Description |
|---|---|---|
| `PORT` | ✅ | API server port (set by Replit per workflow) |
| `DATABASE_URL` | ✅ | PostgreSQL connection URL |
| `SESSION_SECRET` | ⚠️ | Session signing secret |
| `CLERK_SECRET_KEY` | ✅ | Clerk backend key |
| `CLERK_PUBLISHABLE_KEY` | ✅ | Clerk backend publishable key |
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk frontend key |
| `ANTHROPIC_API_KEY` | ❌ | Claude — stored per-user in DB, not as env var |
| `OPENAI_API_KEY` | ❌ | OpenAI — stored per-user in DB |
| `GITHUB_TOKEN` | ❌ | GitHub PAT — stored per-user in DB |
| `AZURE_REPOS_TOKEN` | ❌ | Azure Repos — stored per-user in DB |
| `ADO_ORG` + `ADO_TOKEN` | ❌ | Azure DevOps PLM (legacy server-wide; prefer per-user DB) |
| `JIRA_DOMAIN/EMAIL/TOKEN` | ❌ | Jira PLM (legacy server-wide; prefer per-user DB) |

AI + Git + PLM credentials are **per-user** in `integration_configs`, not server env vars. The env vars are fallbacks only.

---

## Common pitfalls

- **Never use `console.log` on the server.** Use `req.log` or `logger`.
- **Always import from `zod/v4`**, not `zod`. The project pins v4 syntax.
- **Never hardcode `/api/` in frontend code** — use relative URLs like `/api/config`. The shared proxy routes by path.
- **Do not add Vite proxy configs** — the Replit shared proxy handles cross-artifact routing.
- **Do not run `pnpm dev` at the workspace root** — use `restart_workflow` to restart individual artifacts.
- **Verify with `typecheck`, not `build`** — `build` needs `PORT` and `BASE_PATH` env vars that only exist inside workflows.
- **All DB queries must filter by `userId`** — there is no global data. Forgetting this leaks data across tenants.
- **`useScrollReveal` makes elements invisible until the IntersectionObserver fires** — never apply it to above-the-fold content like HeroSection.
- **After editing `lib/*` packages**, run `pnpm run typecheck:libs` before checking leaf artifact packages — stale lib declarations cause false TS errors in artifacts.
- **GitHub login requires Auth pane configuration** — enabling GitHub as a social provider is a one-time step in Replit's Auth pane (Configure → SSO providers → GitHub). The `useGitHubSync` hook in `App.tsx` then auto-saves the token on sign-in.
