import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TabBar } from "./TabBar";
import { TabsProvider } from "@/context/TabsContext";
import { useConfig } from "@/context/ConfigContext";
import { Toaster } from "@/components/ui/toaster";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { isAzureConnected, isJiraConnected } = useConfig();

  return (
    <TabsProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
          background: "var(--bg-app)",
          color: "var(--text-primary)",
          fontFamily: "var(--app-font-sans)",
        }}
      >
        <Sidebar isAzureConnected={isAzureConnected} isJiraConnected={isJiraConnected} />
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <TabBar />
          <main
            data-testid="app-main"
            style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "var(--bg-app)" }}
          >
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </TabsProvider>
  );
}
