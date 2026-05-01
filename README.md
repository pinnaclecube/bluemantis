# DevCopilot

AI-powered developer task management assistant. DevCopilot connects to your PLM systems (Jira, Azure DevOps), syncs tasks, generates AI code suggestions via Claude and OpenAI, and automates the branch → commit → PR workflow.

---

## Architecture

```
artifacts/
├── api-server/     Express 5 + Drizzle ORM API  →  /api
└── dev-copilot/    React + Vite frontend          →  /

lib/
├── db/             Drizzle schema + PostgreSQL client
├── api-spec/       OpenAPI spec
├── api-zod/        Generated Zod schemas
└── api-client-react/  Generated React Query hooks
```

The workspace runs as a **pnpm monorepo**. A shared reverse proxy routes `/api` → api-server and `/` → dev-copilot.

---

## Setup (Replit)

1. **Fork / import** this repository into Replit.

2. **Add Replit Secrets** (Settings → Secrets):

   | Secret | Required | Description |
   |--------|----------|-------------|
   | `SESSION_SECRET` | Yes | Random string for session signing |
   | `ANTHROPIC_API_KEY` | Recommended | Claude AI suggestions |
   | `OPENAI_API_KEY` | Recommended | OpenAI GPT-4o suggestions |
   | `GITHUB_TOKEN` | If using GitHub | PAT with `repo` scope |
   | `AZURE_REPOS_TOKEN` | If using Azure Repos | PAT with Code (read/write) |
   | `ADO_ORG` | If using Azure DevOps | Organisation slug |
   | `ADO_TOKEN` | If using Azure DevOps | PAT with Work Items (read/write) |
   | `JIRA_DOMAIN` | If using Jira | e.g. `acme.atlassian.net` |
   | `JIRA_EMAIL` | If using Jira | Account email |
   | `JIRA_TOKEN` | If using Jira | API token from id.atlassian.com |

   `DATABASE_URL` and `PORT` are provided automatically by Replit.

3. **Install dependencies**:
   ```bash
   pnpm install
   ```

4. **Run database migrations** (applies schema to PostgreSQL):
   ```bash
   pnpm db:migrate
   ```

5. **Start the application**:
   Click **Run** in Replit, or:
   ```bash
   pnpm --filter @workspace/api-server run dev &
   pnpm --filter @workspace/dev-copilot run dev
   ```

6. **Connect a repository** — open the app, click **+ Add repository** in the navbar, enter the Git URL, provider, and default branch. DevCopilot will detect the stack automatically.

---

## Local setup

```bash
# Prerequisites: Node 20+, pnpm 9+, PostgreSQL 16+

git clone <repo-url>
cd devcopilot
pnpm install

# Set env vars
export DATABASE_URL="postgresql://user:pass@localhost:5432/devcopilot"
export PORT=8080
export SESSION_SECRET="change-me"
# ... other secrets as needed

pnpm db:migrate
pnpm --filter @workspace/api-server run dev &
pnpm --filter @workspace/dev-copilot run dev
```

Open `http://localhost:8081` (frontend) — the Vite dev server proxies `/api` via the shared reverse proxy.

---

## Supported stack combinations

DevCopilot detects the stack from the repository file tree and generates suggestions in the appropriate language.

### Frontend frameworks

| Framework | Detection signal | Suggestion language |
|-----------|-----------------|---------------------|
| React | `package.json` → react dep | TypeScript / TSX |
| Angular | `angular.json` | TypeScript |
| Vue | `vue.config.js` / `.vue` files | TypeScript / Vue SFC |
| Next.js | `next.config.*` | TypeScript / TSX |
| Svelte | `svelte.config.*` | TypeScript |
| Vanilla JS | `.js`/`.ts` files only | JavaScript / TypeScript |

### Backend frameworks

| Framework | Detection signal | Suggestion language |
|-----------|-----------------|---------------------|
| Express / Node | `package.json` → express | TypeScript |
| .NET / C# | `*.csproj`, `*.sln` | C# |
| Spring Boot | `pom.xml`, `build.gradle` | Java |
| Django / FastAPI | `requirements.txt`, `pyproject.toml` | Python |
| Ruby on Rails | `Gemfile` → rails | Ruby |
| Go | `go.mod` | Go |
| Rust (Actix/Axum) | `Cargo.toml` | Rust |

### Databases

| Database | Notes |
|----------|-------|
| PostgreSQL | Full support — standard SQL/ORM queries generated |
| MySQL / MariaDB | Standard SQL generated |
| SQLite | Standard SQL generated |
| MongoDB | Mongoose/driver patterns generated |
| Redis | Key-value patterns generated |
| SQL Server | T-SQL generated |
| **Oracle** | See [Oracle note](#oracle-database-note) below |

---

## Oracle Database note

DevCopilot does **not** require the Oracle Instant Client or any native binaries.

When a repository's stack includes Oracle (detected via `*.sql` files referencing Oracle syntax, or `cx_Oracle`/`oracledb` in dependencies), DevCopilot:

1. Generates **Oracle-compatible SQL and PL/SQL** in its AI suggestions (stored procedures, sequences, `MERGE` statements, ROWNUM patterns, etc.).
2. Marks the suggestion language as `sql` with an Oracle dialect note.
3. Suggestions are designed to be **pasted directly** into SQL Developer, SQLcl, or any Oracle client — no additional npm packages are needed at runtime.

If you want to run Oracle queries from Node.js, install [`oracledb`](https://www.npmjs.com/package/oracledb) in **thin mode** (no native client required since v6):

```ts
import oracledb from "oracledb";
oracledb.initOracleClient(); // omit this line for thin mode
const conn = await oracledb.getConnection({ connectString: "...", ... });
```

---

## API reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/repositories` | List connected repositories |
| POST | `/api/repositories` | Connect repository (auto-detects stack) |
| GET | `/api/repositories/:id` | Get repository |
| PATCH | `/api/repositories/:id` | Update repository |
| DELETE | `/api/repositories/:id` | Delete repository |
| GET | `/api/repositories/:id/stack` | Re-detect stack profile |
| GET | `/api/tasks` | List tasks (syncs from PLM on each call) |
| POST | `/api/tasks` | Create manual task |
| GET | `/api/tasks/:id` | Get task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/suggestions` | Generate AI code suggestions (rate-limited: 20 req/min) |
| POST | `/api/tasks/:id/commit` | Create branch + commit + open PR |
| POST | `/api/tasks/:id/complete` | Close task in PLM + mark done |
| GET | `/api/dashboard/stats` | Dashboard statistics |

---

## AI suggestion pipeline

```
Task + Acceptance Criteria
        ↓
  Git file context (top 5 relevant files, up to 8 000 chars)
        ↓
  ┌─────────────────────────────────────────────────────┐
  │  Parallel AI calls (Promise.allSettled)             │
  │  ┌──────────┐ ┌────────┐ ┌──────────┐ ┌────────┐  │
  │  │  Claude  │ │ OpenAI │ │AntiGrav. │ │Copilot │  │
  │  └──────────┘ └────────┘ └──────────┘ └────────┘  │
  └─────────────────────────────────────────────────────┘
        ↓
  SynthesisEngine (Claude scores each suggestion)
  Scores: correctness · readability · minimal-diff · convention
        ↓
  Ranked CodeSuggestion[] — top marked "Recommended"
```

If `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` are absent, those agents are skipped and only the mock agents (AntiGravity, MS Copilot) produce output. The pipeline never returns an error due to a single agent failure.

---

## Rate limits

| Endpoint pattern | Limit |
|-----------------|-------|
| `POST /api/tasks/*/suggestions` | 20 requests / minute |
| All other endpoints | No limit applied |

---

## Environment variables

| Variable | Critical | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | ✅ | — | API server port (set by Replit) |
| `DATABASE_URL` | ✅ | — | PostgreSQL connection URL (set by Replit) |
| `SESSION_SECRET` | ⚠️ | — | Session signing secret |
| `ANTHROPIC_API_KEY` | ❌ | — | Claude API key |
| `OPENAI_API_KEY` | ❌ | — | OpenAI API key |
| `GITHUB_TOKEN` | ❌ | — | GitHub PAT |
| `AZURE_REPOS_TOKEN` | ❌ | — | Azure Repos PAT |
| `ADO_ORG` | ❌ | — | Azure DevOps org |
| `ADO_TOKEN` | ❌ | — | Azure DevOps PAT |
| `JIRA_DOMAIN` | ❌ | — | Jira domain |
| `JIRA_EMAIL` | ❌ | — | Jira email |
| `JIRA_TOKEN` | ❌ | — | Jira API token |

✅ = server exits on startup if missing  
⚠️ = server warns on startup if missing  
❌ = optional; related feature degrades gracefully  
