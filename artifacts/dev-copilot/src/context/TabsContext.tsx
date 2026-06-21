import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { useLocation } from "wouter";

export type TabKind =
  | "tasks" | "task" | "workspace" | "repositories" | "repository"
  | "dashboard" | "history" | "settings" | "other";

export interface OpenTab {
  path: string;
  title: string;
  kind: TabKind;
}

/** Derive a tab's title + kind from a route path. */
export function deriveTabMeta(path: string): OpenTab {
  const p = path.replace(/\/+$/, "") || "/";
  if (p === "/tasks") return { path: "/tasks", title: "Tasks", kind: "tasks" };
  if (p === "/tasks/new") return { path, title: "New task", kind: "task" };
  if (p.startsWith("/tasks/")) return { path, title: `Task ${p.split("/")[2]}`, kind: "task" };
  if (p.startsWith("/workspace/")) return { path, title: `Workspace ${p.split("/")[2]}`, kind: "workspace" };
  if (p === "/repositories") return { path, title: "Repositories", kind: "repositories" };
  if (p.startsWith("/repositories/")) return { path, title: `Repo ${p.split("/")[2]}`, kind: "repository" };
  if (p === "/dashboard") return { path, title: "Dashboard", kind: "dashboard" };
  if (p === "/history") return { path, title: "History", kind: "history" };
  if (p === "/settings") return { path, title: "Settings", kind: "settings" };
  return { path: p, title: p, kind: "other" };
}

interface TabsContextValue {
  tabs: OpenTab[];
  activePath: string;
  open: (path: string) => void;
  close: (path: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const [tabs, setTabs] = useState<OpenTab[]>(() => [deriveTabMeta(location)]);

  // Ensure a tab exists for the current location (auto-open on navigation).
  useEffect(() => {
    setTabs((prev) => {
      if (prev.some((t) => t.path === location)) return prev;
      return [...prev, deriveTabMeta(location)];
    });
  }, [location]);

  const open = useCallback((path: string) => navigate(path), [navigate]);

  const close = useCallback(
    (path: string) => {
      setTabs((prev) => {
        const idx = prev.findIndex((t) => t.path === path);
        if (idx === -1) return prev;
        const next = prev.filter((t) => t.path !== path);
        // If we closed the active tab, move to a sensible neighbour.
        if (path === location) {
          const fallback = next[idx - 1] ?? next[idx] ?? next[next.length - 1];
          navigate(fallback ? fallback.path : "/tasks");
        }
        return next;
      });
    },
    [location, navigate],
  );

  return (
    <TabsContext.Provider value={{ tabs, activePath: location, open, close }}>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used inside TabsProvider");
  return ctx;
}
