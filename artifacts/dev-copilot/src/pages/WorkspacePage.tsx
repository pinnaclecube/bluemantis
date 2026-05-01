import { useParams, useLocation } from "wouter";

export default function WorkspacePage() {
  const params = useParams<{ taskId: string }>();
  const [, navigate] = useLocation();
  const taskId = params.taskId;

  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
        <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V7.5A2.25 2.25 0 0018 5.25H6A2.25 2.25 0 003.75 7.5v10.5A2.25 2.25 0 006 20.25z" />
        </svg>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Workspace</h1>
        <p className="text-muted-foreground font-mono text-sm">
          Task <span className="text-foreground font-semibold">#{taskId}</span> — AI suggestions ready
        </p>
        <p className="text-xs text-muted-foreground/60 font-mono max-w-sm">
          Code suggestions have been generated and ranked. Full workspace view coming soon.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-md text-xs font-mono font-semibold border border-border hover:bg-muted transition-colors"
        >
          ← Back to tasks
        </button>
        <button
          disabled
          className="px-4 py-2 rounded-md text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20 opacity-50 cursor-not-allowed"
        >
          Open editor (coming soon)
        </button>
      </div>
    </div>
  );
}
