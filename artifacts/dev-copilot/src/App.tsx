import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  RedirectToSignIn,
  ClerkLoading,
  useAuth,
} from "@clerk/react";
import { dark } from "@clerk/themes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { RepoProvider } from "@/context/RepoContext";
import TasksPage from "@/pages/TasksPage";
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

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#7c6ff7",
    colorBackground: "#0f1117",
    colorInputBackground: "#1a1d27",
    colorText: "#e2e4ef",
    borderRadius: "8px",
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
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <path d="M10 1.5L17.5 5.75V14.25L10 18.5L2.5 14.25V5.75L10 1.5Z" fill="#7c6ff7" />
        </svg>
        <span style={{ color: "var(--text-primary)", fontSize: 20, fontWeight: 700, fontFamily: "var(--font-sans)" }}>
          DevCopilot
        </span>
      </div>
      {mode === "sign-in" ? (
        <SignIn
          appearance={clerkAppearance}
          signUpUrl={`${basePath}/sign-up`}
          forceRedirectUrl={`${basePath}/`}
        />
      ) : (
        <SignUp
          appearance={clerkAppearance}
          signInUrl={`${basePath}/sign-in`}
          forceRedirectUrl={`${basePath}/`}
        />
      )}
    </div>
  );
}

function ProtectedApp() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return <LoadingScreen />;
  if (!isSignedIn) return <RedirectToSignIn />;

  return (
    <AppShell>
      <Switch>
        <Route path="/" component={TasksPage} />
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
  );
}

function Router() {
  return (
    <>
      <ClerkLoading>
        <LoadingScreen />
      </ClerkLoading>
      <Switch>
        <Route path="/sign-in" component={() => <AuthPage mode="sign-in" />} />
        <Route path="/sign-up" component={() => <AuthPage mode="sign-up" />} />
        <Route component={ProtectedApp} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={CLERK_PUBLISHABLE_KEY}
        signInUrl={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        afterSignOutUrl={`${basePath}/sign-in`}
      >
        <QueryClientProvider client={queryClient}>
          <RepoProvider>
            <WouterRouter base={basePath}>
              <Router />
            </WouterRouter>
          </RepoProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
