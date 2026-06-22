import { 
  useGetDashboardStats, 
  useGetTasksByStatus, 
  useGetTasksBySource,
  useGetRecentActivity
} from "@workspace/api-client-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";
import { Activity, Database, CheckSquare, GitCommit, GitPullRequest, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

const COLORS = {
  open: "hsl(var(--chart-1))",
  "in-progress": "hsl(var(--chart-2))",
  review: "hsl(var(--chart-4))",
  done: "hsl(var(--chart-3))",
  blocked: "hsl(var(--chart-5))"
};

const SOURCE_COLORS = {
  github: "hsl(var(--chart-2))",
  jira: "hsl(var(--chart-1))",
  "azure-devops": "hsl(var(--chart-4))",
  manual: "hsl(var(--muted-foreground))"
};

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const { data: byStatus, isLoading: statusLoading } = useGetTasksByStatus();
  const { data: bySource, isLoading: sourceLoading } = useGetTasksBySource();
  const { data: activity, isLoading: activityLoading } = useGetRecentActivity();

  return (
    <div className="flex flex-col gap-4 px-5 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-xs">System Overview</p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-md border bg-card md:grid-cols-4 md:divide-y-0">
        <Stat label="Repositories" value={stats?.totalRepositories} loading={statsLoading} testId="total-repositories" />
        <Stat label="Active tasks" value={(stats?.openTasks || 0) + (stats?.inProgressTasks || 0)} loading={statsLoading} testId="active-tasks" />
        <Stat label="Completed" value={stats?.completedTasks} loading={statsLoading} testId="completed-tasks" />
        <Stat label="Linked commits" value={stats?.linkedCommits} loading={statsLoading} testId="linked-commits" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-mono text-muted-foreground">Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {statusLoading ? (
              <Skeleton className="w-full h-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatus} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="status" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {byStatus?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || COLORS.open} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-mono text-muted-foreground">Source Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {sourceLoading ? (
              <Skeleton className="w-full h-full rounded-md" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bySource}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="source"
                  >
                    {bySource?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SOURCE_COLORS[entry.source as keyof typeof SOURCE_COLORS] || SOURCE_COLORS.manual} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {bySource?.map(entry => (
                <div key={entry.source} className="flex items-center gap-2 text-xs font-mono">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: SOURCE_COLORS[entry.source as keyof typeof SOURCE_COLORS] || SOURCE_COLORS.manual }} />
                  {entry.source}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-mono text-muted-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
             <div className="space-y-4">
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
               <Skeleton className="h-12 w-full" />
             </div>
          ) : !activity || activity.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent activity found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activity.map((item, i: number) => (
                <div key={item.id ?? i} className="flex items-start gap-4 p-3 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border" data-testid={`activity-item-${item.id}`}>
                  <div className="mt-0.5 text-muted-foreground">
                    {item.linkedCommit ? <GitCommit className="h-4 w-4" /> :
                     item.status === 'done' ? <CheckSquare className="h-4 w-4" /> :
                     <GitPullRequest className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {item.updatedAt ? formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true }) : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value, loading, testId }: { label: string; value?: number; loading: boolean; testId: string }) {
  return (
    <div className="px-4 py-3.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      {loading ? (
        <Skeleton className="mt-1.5 h-7 w-12" />
      ) : (
        <p className="mt-1 font-mono text-2xl font-semibold tracking-tight" data-testid={`stat-${testId}`}>{value ?? 0}</p>
      )}
    </div>
  );
}