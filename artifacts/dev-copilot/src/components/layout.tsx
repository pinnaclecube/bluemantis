import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Database,
  CheckSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Terminal,
  Layers,
  Server,
  HardDrive,
  Code2,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useHealthCheck, useGetRepository, useDetectRepositoryStack, getGetRepositoryQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const { data: health } = useHealthCheck();

  const repoMatch = location.match(/^\/repositories\/(\d+)/);
  const activeRepoId = repoMatch ? parseInt(repoMatch[1], 10) : null;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground selection:bg-primary/20">
      <div
        className={cn(
          "flex flex-col border-r bg-card/50 backdrop-blur-xl transition-all duration-300 relative z-20",
          collapsed ? "w-[60px]" : "w-64",
        )}
      >
        <div className="flex h-14 items-center border-b px-4 justify-between shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2 font-mono font-bold tracking-tight">
              <Terminal className="h-5 w-5 text-primary" />
              <span>DevCopilot</span>
            </div>
          )}
          {collapsed && <Terminal className="h-5 w-5 text-primary mx-auto" />}
          <button
            data-testid="button-toggle-sidebar"
            onClick={() => setCollapsed(!collapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors absolute -right-3 top-4 bg-background border rounded-full p-0.5 z-30"
          >
            {collapsed ? (
              <PanelLeftOpen className="h-3 w-3" />
            ) : (
              <PanelLeftClose className="h-3 w-3" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-2">
          <NavItem
            href="/"
            icon={LayoutDashboard}
            label="Dashboard"
            collapsed={collapsed}
            active={location === "/"}
          />
          <NavItem
            href="/repositories"
            icon={Database}
            label="Repositories"
            collapsed={collapsed}
            active={location.startsWith("/repositories")}
          />
          <NavItem
            href="/tasks"
            icon={CheckSquare}
            label="Tasks"
            collapsed={collapsed}
            active={location.startsWith("/tasks")}
          />

          {activeRepoId != null && !collapsed && (
            <StackProfilePanel repoId={activeRepoId} />
          )}
        </div>

        <div className="p-4 border-t shrink-0 flex flex-col gap-2">
          <div
            className={cn(
              "flex items-center gap-2 text-xs",
              collapsed ? "justify-center" : "",
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                health?.status === "ok"
                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                  : "bg-yellow-500 animate-pulse",
              )}
            />
            {!collapsed && (
              <span className="text-muted-foreground font-mono">
                System {health?.status === "ok" ? "Online" : "Checking"}
              </span>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1400px] mx-auto h-full flex flex-col">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function StackProfilePanel({ repoId }: { repoId: number }) {
  const queryClient = useQueryClient();

  const { data: repo } = useGetRepository(repoId, {
    query: { queryKey: getGetRepositoryQueryKey(repoId) },
  });

  const { refetch: refetchStack, isFetching: detecting } = useDetectRepositoryStack(repoId, {
    query: {
      enabled: false,
      queryKey: [`/api/repositories/${repoId}/stack`] as const,
    },
  });

  const stack = repo?.stackProfile as Record<string, string> | null | undefined;
  if (!stack) return null;

  return (
    <div
      data-testid="sidebar-stack-profile"
      className="mt-4 mx-1 rounded-md border border-border bg-muted/40 p-3 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Stack
        </span>
        <button
          data-testid="button-redetect-stack"
          onClick={() => refetchStack().then(() => queryClient.invalidateQueries({ queryKey: getGetRepositoryQueryKey(repoId) }))}
          disabled={detecting}
          title="Re-detect stack"
          className="text-muted-foreground hover:text-primary transition-colors disabled:opacity-40"
        >
          <RefreshCw className={cn("h-3 w-3", detecting && "animate-spin")} />
        </button>
      </div>

      <StackRow icon={Layers} label="Frontend" value={stack.frontend} />
      <StackRow icon={Server} label="Backend" value={stack.backend} />
      <StackRow icon={HardDrive} label="Database" value={stack.database} />
      <StackRow icon={Code2} label="Language" value={stack.language} />
    </div>
  );
}

function StackRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
}) {
  if (!value || value === "none") return null;
  return (
    <div
      data-testid={`stack-${label.toLowerCase()}`}
      className="flex items-center gap-2"
    >
      <Icon className="h-3 w-3 text-muted-foreground shrink-0" />
      <span className="text-[10px] text-muted-foreground font-mono w-14 shrink-0">
        {label}
      </span>
      <span className="text-[10px] font-mono font-medium text-foreground truncate">
        {value}
      </span>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  collapsed,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  collapsed: boolean;
  active: boolean;
}) {
  return (
    <Link href={href} className="block">
      <div
        data-testid={`nav-${label.toLowerCase()}`}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative",
          active
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        title={collapsed ? label : undefined}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            active ? "scale-110" : "group-hover:scale-110",
          )}
        />
        {!collapsed && <span className="text-sm tracking-wide">{label}</span>}
      </div>
    </Link>
  );
}
