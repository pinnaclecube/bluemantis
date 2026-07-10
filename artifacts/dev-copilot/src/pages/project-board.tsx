import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, ExternalLink, Plus } from "lucide-react";
import {
  fetchProject,
  fetchProjectWorkItems,
  syncProject,
  ApiError,
  type Project,
  type WorkItem,
} from "@/services/api";

const COLUMNS: { key: string; label: string; statuses: string[] }[] = [
  { key: "open", label: "Open", statuses: ["open", "blocked"] },
  { key: "in-progress", label: "In progress", statuses: ["in-progress"] },
  { key: "review", label: "Review", statuses: ["review"] },
  { key: "done", label: "Done", statuses: ["done"] },
];

const TYPE_STYLE: Record<string, string> = {
  epic: "text-purple-400 border-purple-400/40",
  story: "text-blue-400 border-blue-400/40",
  task: "text-emerald-400 border-emerald-400/40",
  bug: "text-red-400 border-red-400/40",
  test_case: "text-amber-400 border-amber-400/40",
};

export default function ProjectBoard() {
  const params = useParams<{ projectId: string }>();
  const projectId = Number(params.projectId);
  const { toast } = useToast();

  const [project, setProject] = useState<Project | null>(null);
  const [items, setItems] = useState<WorkItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [epicFilter, setEpicFilter] = useState<number | null>(null);

  const load = useCallback(() => {
    if (!Number.isFinite(projectId)) return;
    setLoading(true);
    setError(null);
    Promise.all([fetchProject(projectId), fetchProjectWorkItems(projectId)])
      .then(([p, it]) => {
        setProject(p);
        setItems(it);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Could not load the project."))
      .finally(() => setLoading(false));
  }, [projectId]);

  useEffect(() => {
    load();
  }, [load]);

  const onSync = useCallback(async () => {
    setSyncing(true);
    try {
      const s = await syncProject(projectId);
      toast({
        title: "Sync complete",
        description: `${s.created} added, ${s.updated} updated, ${s.unchanged} unchanged${s.conflicts ? `, ${s.conflicts} run(s) canceled` : ""}.`,
      });
      const it = await fetchProjectWorkItems(projectId);
      setItems(it);
    } catch (err) {
      toast({
        title: "Sync failed",
        description: err instanceof ApiError ? err.message : "Could not sync from the PLM.",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  }, [projectId, toast]);

  if (loading) {
    return (
      <div className="flex h-full flex-col gap-4 px-5 py-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid flex-1 grid-cols-4 gap-3">
          {COLUMNS.map((c) => (
            <Skeleton key={c.key} className="h-full w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">{error ?? "Project not found."}</p>
        <Link href="/dashboard">
          <Button variant="outline" size="sm">Back to dashboard</Button>
        </Link>
      </div>
    );
  }

  const all = items ?? [];
  const epics = all.filter((it) => it.itemType === "epic");
  const parentOf = new Map(all.map((it) => [it.id, it.parentId]));
  const inEpic = (it: WorkItem, epicId: number): boolean => {
    let cur: number | null | undefined = it.id;
    const seen = new Set<number>();
    while (cur != null && !seen.has(cur)) {
      if (cur === epicId) return true;
      seen.add(cur);
      cur = parentOf.get(cur) ?? null;
    }
    return false;
  };
  const visible = epicFilter == null ? all : all.filter((it) => inEpic(it, epicFilter));

  const pill = (active: boolean) =>
    `rounded-full border px-2.5 py-1 text-xs transition-colors ${
      active ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
    }`;

  return (
    <div className="flex h-full flex-col gap-4 px-5 py-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
            <span className="font-mono">
              {project.plmProvider === "jira" ? "Jira" : "Azure DevOps"}
              {project.plmProjectKey ? ` · ${project.plmProjectKey}` : ""}
            </span>
            <span>·</span>
            <span>{all.length} work items</span>
            {project.lastSyncedAt && (
              <>
                <span>·</span>
                <span>synced {new Date(project.lastSyncedAt).toLocaleString()}</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSync} disabled={syncing}>
            <RefreshCw className={`mr-2 h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync"}
          </Button>
          <Button size="sm" disabled title="Create arrives in a later phase">
            <Plus className="mr-2 h-3.5 w-3.5" />
            New item
          </Button>
        </div>
      </div>

      {/* Epic filter */}
      {epics.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <button className={pill(epicFilter == null)} onClick={() => setEpicFilter(null)}>
            All epics
          </button>
          {epics.map((e) => (
            <button key={e.id} className={pill(epicFilter === e.id)} onClick={() => setEpicFilter(e.id)} title={e.title}>
              {e.title.length > 28 ? `${e.title.slice(0, 28)}…` : e.title}
            </button>
          ))}
        </div>
      )}

      {/* Board */}
      {all.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border text-center">
          <p className="text-sm text-muted-foreground">No work items in this project yet.</p>
          <p className="text-xs text-muted-foreground">
            Click <span className="font-medium">Sync</span> to pull the hierarchy from{" "}
            {project.plmProvider === "jira" ? "Jira" : "Azure DevOps"}.
          </p>
        </div>
      ) : (
        <div className="grid flex-1 grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => {
            const colItems = visible.filter((it) => col.statuses.includes(it.status));
            return (
              <div key={col.key} className="flex min-h-0 flex-col rounded-md border border-border bg-card/40">
                <div className="flex items-center justify-between border-b border-border px-3 py-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{col.label}</span>
                  <span className="text-xs text-muted-foreground">{colItems.length}</span>
                </div>
                <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
                  {colItems.map((it) => (
                    <WorkItemCard key={it.id} item={it} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WorkItemCard({ item }: { item: WorkItem }) {
  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase ${TYPE_STYLE[item.itemType] ?? "text-muted-foreground border-border"}`}>
          {item.itemType.replace("_", " ")}
        </span>
        {item.externalId && (
          <span className="font-mono text-[10px] text-muted-foreground">{item.externalId}</span>
        )}
      </div>
      <p className="mt-2 text-sm leading-snug">{item.title}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{item.plmStatus ?? item.status}</span>
        {item.plmUrl && (
          <a href={item.plmUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
