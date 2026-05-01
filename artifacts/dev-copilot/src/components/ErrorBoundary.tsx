import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary] Uncaught error:", error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 bg-background text-foreground">
          <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>

          <div className="text-center space-y-2 max-w-md">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground font-mono">
              {this.state.error?.message ?? "An unexpected error occurred"}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 rounded-md text-sm font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.assign("/")}
              className="px-4 py-2 rounded-md text-sm font-mono border border-border hover:bg-muted transition-colors"
            >
              Go home
            </button>
          </div>

          {import.meta.env.DEV && this.state.error?.stack && (
            <details className="w-full max-w-2xl">
              <summary className="text-xs font-mono text-muted-foreground cursor-pointer hover:text-foreground">
                Stack trace (dev only)
              </summary>
              <pre className="mt-2 p-4 rounded-md bg-muted text-xs font-mono overflow-auto text-muted-foreground whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
