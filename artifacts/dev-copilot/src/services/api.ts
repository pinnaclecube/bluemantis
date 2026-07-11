import type { StackProfile } from '@/components/dc';

export interface DevCopilotTask {
  id: number;
  externalId: string | null;
  source: string;
  type: string;
  title: string;
  description: string | null;
  acceptanceCriteria: string | null;
  priority: string;
  status: string;
  linkedCommit: string | null;
  repositoryId: number | null;
  createdAt: string;
  updatedAt: string;
  assignee?: string | null;
}

export interface Repository {
  id: number;
  name: string;
  provider: string;
  url: string;
  defaultBranch: string;
  stackProfile: StackProfile | null;
  createdAt: string;
}

export interface CodeSuggestion {
  agent: 'claude' | 'openai' | 'copilot' | 'antigravity';
  code: string;
  explanation: string;
  filePath: string;
  language: string;
  score?: number;
  recommendation?: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json() as { error?: string };
      if (body.error) msg = body.error;
    } catch { /* ignore */ }
    throw new ApiError(msg, res.status);
  }
  return res.json() as Promise<T>;
}

export function fetchTasks(): Promise<DevCopilotTask[]> {
  return request<DevCopilotTask[]>('/api/tasks');
}

export function fetchRepositories(): Promise<Repository[]> {
  return request<Repository[]>('/api/repositories');
}

export function connectRepository(data: {
  name: string;
  provider: string;
  url: string;
  defaultBranch: string;
}): Promise<Repository> {
  return request<Repository>('/api/repositories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function redetectStack(repoId: number): Promise<StackProfile> {
  return request<StackProfile>(`/api/repositories/${repoId}/stack`);
}

export function generateSuggestions(taskId: number, refinementPrompt?: string): Promise<CodeSuggestion[]> {
  return request<CodeSuggestion[]>(`/api/tasks/${taskId}/suggestions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(refinementPrompt ? { refinePrompt: refinementPrompt } : {}),
  });
}

export function commitCode(taskId: number, filePath: string, code: string, commitMessage: string): Promise<{ commitHash: string; prUrl: string }> {
  return request<{ commitHash: string; prUrl: string }>(`/api/tasks/${taskId}/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath, code, commitMessage }),
  });
}

export function completeTask(taskId: number, commitHash: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/tasks/${taskId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ commitHash }),
  });
}

/* ---- Projects / PLM hierarchy (Phase 1) ---- */

export type PlmProvider = 'jira' | 'azure-devops';

export interface Project {
  id: number;
  name: string;
  plmProvider: PlmProvider;
  plmProjectKey: string | null;
  plmProjectName: string | null;
  repositoryId: number;
  defaultTarget: 'story' | 'task';
  lastSyncedAt: string | null;
  createdAt: string;
  counts?: { open: number; running: number; review: number };
}

export interface PlmProjectRef {
  key: string;
  name: string;
}

export interface WorkItem {
  id: number;
  externalId: string | null;
  source: string;
  type: string;
  itemType: 'epic' | 'story' | 'task' | 'bug' | 'test_case';
  title: string;
  description: string | null;
  acceptanceCriteria: string | null;
  priority: string;
  status: string;
  linkedCommit: string | null;
  repositoryId: number | null;
  projectId: number | null;
  parentId: number | null;
  plmUrl: string | null;
  plmStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

export function fetchProjects(): Promise<Project[]> {
  return request<Project[]>('/api/projects');
}

export function fetchProject(id: number): Promise<Project> {
  return request<Project>(`/api/projects/${id}`);
}

export function createProject(data: {
  name: string;
  plmProvider: PlmProvider;
  plmProjectKey: string;
  repositoryId: number;
}): Promise<Project> {
  return request<Project>('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function fetchPlmProjects(provider: PlmProvider): Promise<PlmProjectRef[]> {
  return request<PlmProjectRef[]>(`/api/plm/${provider}/projects`);
}

export function fetchProjectWorkItems(projectId: number): Promise<WorkItem[]> {
  return request<WorkItem[]>(`/api/projects/${projectId}/work-items`);
}

export function backfillProjects(): Promise<{ created: number; attached: number; skipped: number }> {
  return request<{ created: number; attached: number; skipped: number }>('/api/projects/backfill', {
    method: 'POST',
  });
}

export interface SyncSummary {
  created: number;
  updated: number;
  unchanged: number;
  conflicts: number;
}

export function syncProject(projectId: number): Promise<SyncSummary> {
  return request<SyncSummary>(`/api/projects/${projectId}/sync`, { method: 'POST' });
}

/* ---- Runs / scheduling (Phase 3) ---- */

export type RunStatus =
  | 'scheduled'
  | 'queued'
  | 'running'
  | 'succeeded'
  | 'failed'
  | 'canceled';

export interface Run {
  id: number;
  userId: string;
  projectId: number;
  workItemId: number;
  status: RunStatus;
  trigger: 'manual' | 'scheduled';
  refinePrompt: string | null;
  autoCommit: boolean;
  scheduledAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  error: string | null;
  prUrl: string | null;
  commitHash: string | null;
  createdAt: string;
}

export interface RunSuggestion {
  id: number;
  runId: number;
  agent: 'claude' | 'openai' | 'copilot' | 'antigravity';
  code: string;
  explanation: string;
  filePath: string;
  language: string;
  score: number | null;
  recommendation: string | null;
  createdAt: string;
}

export interface RunDetail {
  run: Run;
  suggestions: RunSuggestion[];
}

/**
 * Start a run for a work item. Omit `scheduledAt` to run inline (resolves once
 * the pipeline finishes, returning the completed run + suggestions). Pass an ISO
 * UTC `scheduledAt` to schedule it — the response is a `scheduled` run with no
 * suggestions yet.
 */
export function createRun(
  workItemId: number,
  opts: { refinePrompt?: string; autoCommit?: boolean; scheduledAt?: string } = {},
): Promise<RunDetail | Run> {
  return request<RunDetail | Run>(`/api/work-items/${workItemId}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(opts),
  });
}

export function fetchRuns(params: { projectId?: number; status?: RunStatus } = {}): Promise<Run[]> {
  const q = new URLSearchParams();
  if (params.projectId != null) q.set('projectId', String(params.projectId));
  if (params.status) q.set('status', params.status);
  const qs = q.toString();
  return request<Run[]>(`/api/runs${qs ? `?${qs}` : ''}`);
}

export function fetchRun(runId: number): Promise<RunDetail> {
  return request<RunDetail>(`/api/runs/${runId}`);
}

export function cancelRun(runId: number): Promise<Run> {
  return request<Run>(`/api/runs/${runId}/cancel`, { method: 'POST' });
}

export function commitRunSuggestion(
  runId: number,
  suggestionId: number,
  commitMessage?: string,
): Promise<{ commitHash: string; prUrl: string }> {
  return request<{ commitHash: string; prUrl: string }>(`/api/runs/${runId}/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commitMessage ? { suggestionId, commitMessage } : { suggestionId }),
  });
}
