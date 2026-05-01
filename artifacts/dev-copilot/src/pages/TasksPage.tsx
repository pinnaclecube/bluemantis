import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

interface Task {
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
}

function priorityLabel(p: string): string {
  switch (p) {
    case "critical": return "P1";
    case "high":     return "P2";
    case "medium":   return "P3";
    case "low":      return "P4";
    default:         return p.toUpperCase();
  }
}

function priorityClass(p: string): string {
  switch (p) {
    case "critical": return "bg-red-500/15 text-red-400 border-red-500/30";
    case "high":     return "bg-orange-500/15 text-orange-400 border-orange-500/30";
    case "medium":   return "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";
    case "low":      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    default:         return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

function typeLabel(t: string): string {
  switch (t) {
    case "feature": return "Feature";
    case "story":   return "Story";
    case "chore":   return "Task";
    case "bug":     return "Bug";
    default:        return t.charAt(0).toUpperCase() + t.slice(1);
  }
}

function typeClass(t: string): string {
  switch (t) {
    case "feature": return "bg-violet-500/15 text-violet-400 border-violet-500/30";
    case "story":   return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
    case "chore":   return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    case "bug":     return "bg-red-500/15 text-red-400 border-red-500/30";
    default:        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
}

function SourceBadge({ source }: { source: string }) {
  const cfg: Record<string, { label: string; cls: string }> = {
    "azure-devops": { label: "Azure DevOps", cls: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
    jira:           { label: "Jira",          cls: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
    github:         { label: "GitHub",         cls: "bg-slate-500/10 text-slate-300 border-slate-500/20" },
    manual:         { label: "Manual",         cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
  };
  const { label, cls } = cfg[source] ?? { label: source, cls: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-semibold uppercase tracking-wider ${cls}`}>
      {label}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function TaskCard({ task, onGenerateCode }: { task: Task; onGenerateCode: (id: number) => Promise<void> }) {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await onGenerateCode(task.id);
    } finally {
      setGenerating(false);
    }
  };

  const description = task.description ?? "";
  const truncated = description.length > 160 ? description.slice(0, 157) + "…" : description;

  return (
    <div
      data-testid={`task-card-${task.id}`}
      className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3 hover:border-primary/30 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <SourceBadge source={task.source} />
            <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-semibold uppercase tracking-wider ${typeClass(task.type)}`}>
              {typeLabel(task.type)}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-bold ${priorityClass(task.priority)}`}>
              {priorityLabel(task.priority)}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug" data-testid={`task-title-${task.id}`}>
            {task.title}
          </h3>
        </div>

        <button
          data-testid={`btn-generate-${task.id}`}
          onClick={handleGenerate}
          disabled={generating}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {generating ? (
            <>
              <span className="h-3 w-3 rounded-full border border-primary-foreground border-t-transparent animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate code
            </>
          )}
        </button>
      </div>

      {truncated && (
        <p className="text-xs text-muted-foreground leading-relaxed font-mono">{truncated}</p>
      )}

      <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60 pt-1 border-t border-border">
        <span>{task.externalId ?? `TASK-${task.id}`}</span>
        <span>·</span>
        <span className="capitalize">{task.status.replace("-", " ")}</span>
        {task.linkedCommit && (
          <>
            <span>·</span>
            <span className="font-mono">{task.linkedCommit.slice(0, 7)}</span>
          </>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [, navigate] = useLocation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTasks();
  }, [fetchTasks]);

  const handleGenerateCode = useCallback(async (taskId: number) => {
    const res = await fetch(`/api/tasks/${taskId}/suggestions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
    }
    navigate(`/workspace/${taskId}`);
  }, [navigate]);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm font-mono mt-0.5">Synced from your PLM &amp; Git integrations</p>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
      </div>

      {loading && <Spinner />}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-sm">Failed to load tasks</p>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </div>
          <button
            data-testid="btn-retry"
            onClick={() => void fetchTasks()}
            className="px-4 py-2 rounded-md text-xs font-mono font-semibold border border-border hover:bg-muted transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
          <svg className="h-12 w-12 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="font-mono text-sm text-muted-foreground">No tasks yet. Connect a PLM integration to sync tasks.</p>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onGenerateCode={handleGenerateCode} />
          ))}
        </div>
      )}
    </div>
  );
}
