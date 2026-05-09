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
import { ErrorBoundary } from "@/components/ErrorBoundary";
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

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#7c6ff7",
    colorBackground: "#1a2538",
    colorInputBackground: "#111b2c",
    colorText: "#f0f2f8",
    colorTextSecondary: "#a8b4cc",
    colorNeutral: "#c0cce0",
    borderRadius: "8px",
    fontFamily: "'Inter', sans-serif",
  },
  elements: {
    card: "shadow-2xl",
    headerTitle: { color: "#f0f2f8" },
    headerSubtitle: { color: "#a8b4cc" },
    socialButtonsBlockButton: {
      background: "#232f45",
      border: "1px solid #3a4d6a",
      color: "#d8e0f0",
    },
    dividerLine: { background: "#2d3f5a" },
    dividerText: { color: "#7a8fa8" },
    formFieldLabel: { color: "#c0cce0" },
    footerActionText: { color: "#7a8fa8" },
    identityPreviewText: { color: "#c0cce0" },
    formResendCodeLink: { color: "#7c6ff7" },
  },
};

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
          forceRedirectUrl={`${basePath}/tasks`}
        />
      ) : (
        <SignUp
          routing="path"
          path={`${basePath}/sign-up`}
          appearance={clerkAppearance}
          signInUrl={`${basePath}/sign-in`}
          forceRedirectUrl={`${basePath}/tasks`}
        />
      )}
    </div>
  );
}

/** Root: redirect signed-in users to /tasks, others to /sign-in */
function RootRoute() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return <LoadingScreen />;
  if (isSignedIn) return <Redirect to="/tasks" />;
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
 * Runs once per browser session after the user is signed in.
 * Calls /api/auth/github-sync to pull the Clerk-held GitHub OAuth token
 * into integration_configs so the GitHub integration is ready automatically.
 */
function useGitHubSync() {
  const { refreshConfig } = useConfig();
  const attempted = useRef(false);

  useEffect(() => {
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
  }, [refreshConfig]);
}

function ProtectedApp() {
  useGitHubSync();
  return (
    <RequireAuth>
      <AppShell>
        <Switch>
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

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={clerkPubKey}
        proxyUrl={clerkProxyUrl}
        signInUrl={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        afterSignOutUrl="/"
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
    </ErrorBoundary>
  );
}

export default App;
