import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  RedirectToSignIn,
  ClerkLoading,
  useAuth,
} from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { HideClerkDevBadge } from "@/components/HideClerkDevBadge";
import { AppShell } from "@/components/layout/AppShell";
import { RepoProvider } from "@/context/RepoContext";
import { ConfigProvider, useConfig } from "@/context/ConfigContext";
import WorkspacePage from "@/pages/WorkspacePage";
import Dashboard from "@/pages/dashboard";
import Repositories from "@/pages/repositories";
import RepositoryDetail from "@/pages/repository-detail";
import Tasks from "@/pages/tasks";
import TaskDetail from "@/pages/task-detail";
import NewTask from "@/pages/new-task";
import NotFound from "@/pages/not-found";
import HistoryPage from "@/pages/HistoryPage";
import SettingsPage from "@/pages/SettingsPage";
import NewProject from "@/pages/new-project";
import ProjectBoard from "@/pages/project-board";
import RunsPage from "@/pages/runs";
import RunDetailPage from "@/pages/run-detail";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPubKey =
  publishableKeyFromHost(
    window.location.hostname,
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  ) ?? (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string);

// In dev this is empty; in prod Replit sets it automatically
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL as string | undefined;

function getClerkAppearance(isDark: boolean) {
  return {
    baseTheme: isDark ? dark : undefined,
    variables: {
      colorPrimary: "#4d9cff",
      colorBackground: isDark ? "#161a1f" : "#ffffff",
      colorInputBackground: isDark ? "#1e2329" : "#f5f7fa",
      colorText: isDark ? "#e8eaf0" : "#0d1117",
      colorTextSecondary: isDark ? "#8b92a5" : "#4a5673",
      colorNeutral: isDark ? "#8b92a5" : "#4a5673",
      borderRadius: "6px",
      fontFamily: "'Inter', sans-serif",
    },
    elements: {
      card: "shadow-xl",
    },
  };
}

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        color: "var(--text-muted)",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
      }}
    >
      Loading…
    </div>
  );
}

function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const { resolvedTheme } = useTheme();
  const clerkAppearance = getClerkAppearance(resolvedTheme !== "light");
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        gap: 24,
      }}
    >
      <HideClerkDevBadge />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <img src={`${basePath}/logo.png`} alt="Blue Mantis" style={{ width: 32, height: 32, objectFit: "contain" }} />
        <span style={{ color: "var(--text-primary)", fontSize: 20, fontWeight: 700, fontFamily: "var(--font-sans)" }}>
          Blue Mantis
        </span>
      </div>
      {mode === "sign-in" ? (
        <SignIn
          routing="path"
          path={`${basePath}/sign-in`}
          appearance={clerkAppearance}
          signUpUrl={`${basePath}/sign-up`}
          forceRedirectUrl={`${basePath}/dashboard`}
        />
      ) : (
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          appearance={clerkAppearance}
          signInUrl={`${basePath}/sign-in`}
          forceRedirectUrl={`${basePath}/dashboard`}
        />
      )}
      {mode === "sign-in" && (
        <p style={{ color: "#8b92a5", fontSize: 14, fontFamily: "'Inter', sans-serif", marginTop: 4, textAlign: "center" }}>
          Don't have account?{" "}
          {/* Full-page navigation to the marketing site, which opens the Request Access modal. */}
          <a href="/?request-access=1" style={{ color: "#4d9cff", fontWeight: 600, textDecoration: "none" }}>
            Request Your Access
          </a>
        </p>
      )}
    </div>
  );
}

/** Root: redirect signed-in users to /tasks, others to /sign-in */
function RootRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (isSignedIn) return <Redirect to="/dashboard" />;
  return <Redirect to="/sign-in" />;
}

/** Wraps any route that requires authentication */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <RedirectToSignIn />;
  return <>{children}</>;
}

/**
 * Runs once per browser session after Clerk has confirmed the user is signed in.
 * Calls /api/auth/github-sync to pull the Clerk-held GitHub OAuth token
 * into integration_configs so the GitHub integration is ready automatically.
 *
 * To activate GitHub sign-in: open the Auth pane → Configure → SSO providers
 * → enable GitHub. No code change is needed — it's a one-time Auth pane step.
 */
function useGitHubSync() {
  const { isLoaded, isSignedIn } = useAuth();
  const { refreshConfig } = useConfig();
  const attempted = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (attempted.current) return;
    if (sessionStorage.getItem("gh_sync_done")) return;
    attempted.current = true;

    fetch("/api/auth/github-sync", { method: "POST" })
      .then((r) => r.json())
      .then((data: { ok?: boolean; login?: string }) => {
        if (data.ok) {
          sessionStorage.setItem("gh_sync_done", "1");
          refreshConfig();
        }
      })
      .catch(() => {
        // Silent — GitHub sign-in is optional
      });
  }, [isLoaded, isSignedIn, refreshConfig]);
}

function ProtectedApp() {
  useGitHubSync();
  return (
    <RequireAuth>
      <AppShell>
        <Switch>
          <Route path="/projects/new" component={NewProject} />
          <Route path="/p/:projectId/board" component={ProjectBoard} />
          <Route path="/p/:projectId/runs" component={RunsPage} />
          <Route path="/runs/:runId" component={RunDetailPage} />
          <Route path="/workspace/:taskId" component={WorkspacePage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/repositories" component={Repositories} />
          <Route path="/repositories/:id" component={RepositoryDetail} />
          <Route path="/tasks" component={Tasks} />
          <Route path="/tasks/new" component={NewTask} />
          <Route path="/tasks/:id" component={TaskDetail} />
          <Route path="/history" component={HistoryPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route component={NotFound} />
        </Switch>
      </AppShell>
    </RequireAuth>
  );
}

function Router() {
  return (
    <>
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>
      <Switch>
        <Route path="/" component={RootRoute} />
        <Route path="/sign-in" component={() => <AuthPage mode="sign-in" />} />
        <Route path="/sign-in/:rest*" component={() => <AuthPage mode="sign-in" />} />
        <Route path="/sign-up" component={() => <AuthPage mode="sign-up" />} />
        <Route path="/sign-up/:rest*" component={() => <AuthPage mode="sign-up" />} />
        <Route component={ProtectedApp} />
      </Switch>
    </>
  );
}

function ClerkedApp() {
  const { resolvedTheme } = useTheme();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      afterSignOutUrl="/"
      appearance={getClerkAppearance(resolvedTheme !== "light")}
    >
      <QueryClientProvider client={queryClient}>
        <RepoProvider>
          <ConfigProvider>
            <WouterRouter base={basePath}>
              <Router />
            </WouterRouter>
          </ConfigProvider>
        </RepoProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ClerkedApp />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
