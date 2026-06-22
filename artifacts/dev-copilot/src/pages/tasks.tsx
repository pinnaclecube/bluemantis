import { useListTasks, useListRepositories } from "@workspace/api-client-react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Database, CheckSquare, Clock, GitBranch } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { SiGithub, SiJira } from "react-icons/si";
import { Cloud } from "lucide-react";

export default function Tasks() {
  const [searchParams] = useSearch();
  const searchParamsObj = new URLSearchParams(searchParams);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(searchParamsObj.get("status") || "all");
  const [source, setSource] = useState<string>(searchParamsObj.get("source") || "all");
  const [type, setType] = useState<string>(searchParamsObj.get("type") || "all");

  const queryParams = {
    status: status === "all" ? undefined : status,
    source: source === "all" ? undefined : source,
    type: type === "all" ? undefined : type,
  };

  const { data: tasks, isLoading } = useListTasks(queryParams);
  const { data: repos } = useListRepositories();

  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.externalId?.toLowerCase().includes(search.toLowerCase()) ||
    (task.linkedCommit && task.linkedCommit.toLowerCase().includes(search.toLowerCase())),
  );

  const getRepoName = (repoId?: number | null) => {
    if (!repoId) return null;
    return repos?.find((r) => r.id === repoId)?.name || `Repo #${repoId}`;
  };

  const hasFilters = search || status !== "all" || source !== "all" || type !== "all";

  return (
    <div className="flex h-full flex-col gap-3 px-5 py-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Tasks</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">Track work items and link commits</p>
        </div>
        <Button asChild size="sm" className="h-8 gap-1.5" data-testid="button-create-task">
          <Link href="/tasks/new">
            <Plus className="h-4 w-4" />
            New task
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative w-full flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            data-testid="input-search-tasks"
            placeholder="Search by title, ID, or commit…"
            className="h-8 pl-8 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <FilterSelect value={status} onChange={setStatus} testid="select-filter-status" options={[
            ["all", "All status"], ["open", "Open"], ["in-progress", "In progress"], ["review", "Review"], ["done", "Done"], ["blocked", "Blocked"],
          ]} />
          <FilterSelect value={source} onChange={setSource} testid="select-filter-source" options={[
            ["all", "All sources"], ["manual", "Manual"], ["github", "GitHub"], ["jira", "Jira"], ["azure-devops", "Azure DevOps"],
          ]} />
          <FilterSelect value={type} onChange={setType} testid="select-filter-type" options={[
            ["all", "All types"], ["feature", "Feature"], ["bug", "Bug"], ["chore", "Chore"], ["story", "Story"],
          ]} />
        </div>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-md border bg-card">
        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="px-3 py-2.5">
                <Skeleton className="h-3 w-40" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            ))}
          </div>
        ) : !filteredTasks || filteredTasks.length === 0 ? (
          <div className="flex h-[360px] flex-col items-center justify-center gap-3 text-muted-foreground">
            <CheckSquare className="h-9 w-9 opacity-20" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">No tasks found</p>
              <p className="mt-0.5 text-xs">Try adjusting your filters or search query.</p>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" className="h-7 text-xs"
                onClick={() => { setSearch(""); setStatus("all"); setSource("all"); setType("all"); }}>
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredTasks.map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-muted/60"
                data-testid={`task-row-${task.id}`}
              >
                <TaskSourceIcon source={task.source} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 font-mono text-xs text-muted-foreground" data-testid={`task-id-${task.id}`}>
                      {task.externalId || `TASK-${task.id}`}
                    </span>
                    <span className="truncate text-sm font-medium text-foreground" data-testid={`task-title-${task.id}`}>
                      {task.title}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
                    <TaskStatusBadge status={task.status} />
                    <span className="text-muted-foreground capitalize">{task.type}</span>
                    <span className={task.priority === "high" || task.priority === "critical" ? "font-medium text-destructive capitalize" : "text-muted-foreground capitalize"}>
                      {task.priority}
                    </span>
                    {task.repositoryId && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Database className="h-3 w-3" />
                        <span className="max-w-[140px] truncate font-mono">{getRepoName(task.repositoryId)}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {task.linkedCommit ? (
                    <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground" title="Linked commit">
                      <GitBranch className="h-3 w-3" />
                      {task.linkedCommit.substring(0, 7)}
                    </span>
                  ) : (
                    <span className="font-mono text-xs italic text-muted-foreground/50">no commit</span>
                  )}
                  <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(task.updatedAt), "MMM d, yyyy")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  value, onChange, options, testid,
}: { value: string; onChange: (v: string) => void; options: [string, string][]; testid: string }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[136px] text-xs" data-testid={testid}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(([v, label]) => (
          <SelectItem key={v} value={v} className="text-xs">{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TaskSourceIcon({ source }: { source: string }) {
  switch (source) {
    case "github": return <SiGithub className="h-4 w-4 shrink-0 text-muted-foreground" title="GitHub" />;
    case "jira": return <SiJira className="h-4 w-4 shrink-0 text-muted-foreground" title="Jira" />;
    case "azure-devops": return <span title="Azure DevOps"><Cloud className="h-4 w-4 shrink-0 text-muted-foreground" /></span>;
    default: return <span title="Manual"><CheckSquare className="h-4 w-4 shrink-0 text-muted-foreground" /></span>;
  }
}

const STATUS_DOT: Record<string, string> = {
  open: "var(--text-muted)",
  "in-progress": "#4d9cff",
  review: "var(--accent-purple)",
  done: "var(--accent-green)",
  blocked: "var(--accent-red)",
};

export function TaskStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs capitalize" style={{ color: "var(--text-secondary)" }}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STATUS_DOT[status] ?? STATUS_DOT.open }} />
      {status.replace("-", " ")}
    </span>
  );
}
