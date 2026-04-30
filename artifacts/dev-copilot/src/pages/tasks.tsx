import { useListTasks, useListRepositories, getListTasksQueryKey } from "@workspace/api-client-react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Filter, Database, CheckSquare, Clock, GitBranch } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SiGithub, SiJira } from "react-icons/si";
import { Cloud } from "lucide-react";

export default function Tasks() {
  const [searchParams] = useSearch();
  const searchParamsObj = new URLSearchParams(searchParams);
  
  const initialStatus = searchParamsObj.get("status") || "all";
  const initialSource = searchParamsObj.get("source") || "all";
  const initialType = searchParamsObj.get("type") || "all";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(initialStatus);
  const [source, setSource] = useState<string>(initialSource);
  const [type, setType] = useState<string>(initialType);

  const queryParams = {
    status: status === "all" ? undefined : status,
    source: source === "all" ? undefined : source,
    type: type === "all" ? undefined : type,
  };

  const { data: tasks, isLoading } = useListTasks(queryParams);
  const { data: repos } = useListRepositories();

  const filteredTasks = tasks?.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) || 
    task.externalId?.toLowerCase().includes(search.toLowerCase()) ||
    (task.linkedCommit && task.linkedCommit.toLowerCase().includes(search.toLowerCase()))
  );

  const getRepoName = (repoId?: number | null) => {
    if (!repoId) return null;
    return repos?.find(r => r.id === repoId)?.name || `Repo #${repoId}`;
  };

  return (
    <div className="flex flex-col gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1 font-mono text-sm">Task tracker and commit linker</p>
        </div>
        <Button asChild data-testid="button-create-task" className="font-mono uppercase tracking-wider text-xs">
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-card p-4 rounded-md border">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            data-testid="input-search-tasks"
            placeholder="Search by title, ID, or commit..."
            className="pl-9 font-mono text-sm bg-background border-muted"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
          
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] font-mono text-xs h-9" data-testid="select-filter-status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-[140px] font-mono text-xs h-9" data-testid="select-filter-source">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="github">GitHub</SelectItem>
              <SelectItem value="jira">Jira</SelectItem>
              <SelectItem value="azure-devops">Azure DevOps</SelectItem>
            </SelectContent>
          </Select>

          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[140px] font-mono text-xs h-9" data-testid="select-filter-type">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="chore">Chore</SelectItem>
              <SelectItem value="story">Story</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 border rounded-md bg-card">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : !filteredTasks || filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground space-y-4">
            <CheckSquare className="h-12 w-12 opacity-20" />
            <div className="text-center">
              <p className="font-mono text-sm uppercase tracking-wider font-bold">No tasks found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
            </div>
            {(search || status !== "all" || source !== "all" || type !== "all") && (
              <Button 
                variant="link" 
                onClick={() => { setSearch(""); setStatus("all"); setSource("all"); setType("all"); }} 
                className="font-mono text-xs uppercase"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 divide-y">
            {filteredTasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="block hover:bg-muted/50 transition-colors">
                <div className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <TaskSourceIcon source={task.source} />
                      <span className="text-xs font-mono font-bold text-muted-foreground" data-testid={`task-id-${task.id}`}>
                        {task.externalId || `TASK-${task.id}`}
                      </span>
                      <h4 className="text-base font-medium truncate text-foreground" data-testid={`task-title-${task.id}`}>{task.title}</h4>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs mt-2">
                      <TaskStatusBadge status={task.status} />
                      <Badge variant="outline" className="font-mono uppercase text-[10px]">{task.type}</Badge>
                      <span className={task.priority === 'high' || task.priority === 'critical' ? 'text-destructive font-mono font-bold uppercase' : 'text-muted-foreground font-mono uppercase'}>
                        {task.priority}
                      </span>
                      
                      {task.repositoryId && (
                        <div className="flex items-center gap-1 text-muted-foreground ml-auto md:ml-0 border-l pl-3 border-border">
                          <Database className="h-3 w-3" />
                          <span className="font-mono truncate max-w-[120px]">{getRepoName(task.repositoryId)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 md:w-32 border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0">
                    {task.linkedCommit ? (
                      <div className="flex items-center gap-1 text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground" title="Linked Commit">
                        <GitBranch className="h-3 w-3" />
                        {task.linkedCommit.substring(0, 7)}
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-muted-foreground/50 italic">No commit</div>
                    )}
                    <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      <Clock className="h-3 w-3" />
                      {format(new Date(task.updatedAt), 'MMM d, yyyy')}
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function TaskSourceIcon({ source }: { source: string }) {
  switch (source) {
    case 'github': return <SiGithub className="h-4 w-4 text-muted-foreground" title="GitHub" />;
    case 'jira': return <SiJira className="h-4 w-4 text-[#0052CC]" title="Jira" />;
    case 'azure-devops': return <Cloud className="h-4 w-4 text-[#0078D7]" title="Azure DevOps" />;
    default: return <CheckSquare className="h-4 w-4 text-muted-foreground" title="Manual" />;
  }
}

export function TaskStatusBadge({ status }: { status: string }) {
  const getStyle = () => {
    switch (status) {
      case 'open': return 'bg-muted text-muted-foreground border-border';
      case 'in-progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'review': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'done': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'blocked': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded border ${getStyle()}`}>
      {status.replace('-', ' ')}
    </span>
  );
}