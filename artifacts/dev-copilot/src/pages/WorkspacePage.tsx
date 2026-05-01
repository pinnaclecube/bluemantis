import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Task {
  id: number;
  externalId: string | null;
  source: string;
  type: string;
  title: string;
  description: string | null;
  acceptanceCriteria: string | null;
  priority: string;
  status: string;
  linkedCommit: string | null;
  repositoryId: number | null;
}

interface Repository {
  id: number;
  name: string;
  provider: string;
  stackProfile: Record<string, string> | null;
}

interface CodeSuggestion {
  agent: "claude" | "openai" | "copilot" | "antigravity";
  code: string;
  explanation: string;
  filePath: string;
  language: string;
  score?: number;
  recommendation?: string;
}

type WorkflowStep = "loading" | "suggestions" | "accepted" | "committed" | "completed";

/* ─── Constants ──────────────────────────────────────────────────────────── */

const AGENT_META: Record<string, { label: string; colour: string }> = {
  claude:      { label: "Claude",       colour: "text-orange-400 border-orange-400/30 bg-orange-400/5" },
  openai:      { label: "OpenAI",       colour: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5" },
  antigravity: { label: "Anti Gravity", colour: "text-violet-400 border-violet-400/30 bg-violet-400/5" },
  copilot:     { label: "MS Copilot",   colour: "text-blue-400 border-blue-400/30 bg-blue-400/5" },
};

const AGENT_ORDER: Array<CodeSuggestion["agent"]> = ["claude", "openai", "antigravity", "copilot"];

const STEP_LABELS: { key: WorkflowStep; label: string }[] = [
  { key: "suggestions", label: "Suggestions" },
  { key: "accepted",    label: "Accepted" },
  { key: "committed",   label: "PR opened" },
  { key: "completed",   label: "Task closed" },
];

const STEP_ORDER: WorkflowStep[] = ["loading", "suggestions", "accepted", "committed", "completed"];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function priorityLabel(p: string) {
  return { critical: "P1", high: "P2", medium: "P3", low: "P4" }[p] ?? p.toUpperCase();
}

function sourceLabel(s: string) {
  return { "azure-devops": "Azure DevOps", jira: "Jira", github: "GitHub", manual: "Manual" }[s] ?? s;
}

function sourceBadgeCls(s: string) {
  if (s === "azure-devops") return "bg-purple-500/15 text-purple-400 border-purple-500/30";
  if (s === "jira")         return "bg-blue-500/15 text-blue-400 border-blue-500/30";
  return "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

function typeBadgeCls(t: string) {
  const m: Record<string, string> = {
    feature: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    story:   "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    bug:     "bg-red-500/15 text-red-400 border-red-500/30",
    chore:   "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };
  return m[t] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

function typeLabel(t: string) {
  return { feature: "Feature", story: "Story", chore: "Task", bug: "Bug" }[t] ?? t;
}

function stackPillCls(key: string) {
  const m: Record<string, string> = {
    frontend:       "bg-blue-500/10 text-blue-400 border-blue-400/20",
    backend:        "bg-green-500/10 text-green-400 border-green-400/20",
    database:       "bg-orange-500/10 text-orange-400 border-orange-400/20",
    language:       "bg-violet-500/10 text-violet-400 border-violet-400/20",
    testFramework:  "bg-pink-500/10 text-pink-400 border-pink-400/20",
    packageManager: "bg-slate-500/10 text-slate-400 border-slate-400/20",
  };
  return m[key] ?? "bg-slate-500/10 text-slate-400 border-slate-400/20";
}

function criteriaLines(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split("\n").map((l) => l.replace(/^[\s\-*]+/, "").trim()).filter(Boolean);
}

function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sz = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-10 w-10" }[size];
  return (
    <span className={`inline-block ${sz} rounded-full border-2 border-primary border-t-transparent animate-spin`} />
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-mono font-semibold uppercase tracking-wider ${className ?? ""}`}>
      {children}
    </span>
  );
}

/* ─── WorkspacePage ──────────────────────────────────────────────────────── */

export default function WorkspacePage() {
  const params = useParams<{ taskId: string }>();
  const [, navigate] = useLocation();
  const taskId = Number(params.taskId);

  const [task, setTask]               = useState<Task | null>(null);
  const [repo, setRepo]               = useState<Repository | null>(null);
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string>("claude");
  const [accepted, setAccepted]       = useState<CodeSuggestion | null>(null);
  const [refinePrompt, setRefinePrompt] = useState("");
  const [refining, setRefining]       = useState(false);
  const [commitMsg, setCommitMsg]     = useState("");
  const [committing, setCommitting]   = useState(false);
  const [completing, setCompleting]   = useState(false);
  const [prUrl, setPrUrl]             = useState<string | null>(null);
  const [commitHash, setCommitHash]   = useState<string | null>(null);
  const [step, setStep]               = useState<WorkflowStep>("loading");
  const [actionError, setActionError] = useState<string | null>(null);
  const [criteria, setCriteria]       = useState<Record<number, boolean>>({});
  const refineRef                     = useRef<HTMLTextAreaElement>(null);

  /* ── Fetch task + repo + initial suggestions ─────────────────────────── */

  const loadSuggestions = useCallback(async (refine?: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(refine ? { refinePrompt: refine } : {}),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(b.error ?? `HTTP ${res.status}`);
      }
      const data = await res.json() as CodeSuggestion[];
      setSuggestions(data);
      // Auto-select the agent of the recommended suggestion
      const rec = data.find((s) => s.recommendation === "Recommended");
      if (rec) setActiveAgent(rec.agent);
      else if (data[0]) setActiveAgent(data[0].agent);
      setStep("suggestions");
    } catch (err) {
      throw err;
    }
  }, [taskId]);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch task
        const taskRes = await fetch(`/api/tasks/${taskId}`);
        if (!taskRes.ok) throw new Error(`Task not found (HTTP ${taskRes.status})`);
        const taskData = await taskRes.json() as Task;
        if (cancelled) return;
        setTask(taskData);
        setCommitMsg(taskData.title);

        // Fetch repo if linked
        if (taskData.repositoryId) {
          const repoRes = await fetch(`/api/repositories/${taskData.repositoryId}`);
          if (repoRes.ok) {
            const repoData = await repoRes.json() as Repository;
            if (!cancelled) setRepo(repoData);
          }
        }

        // Load suggestions
        await loadSuggestions();
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unexpected error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void init();
    return () => { cancelled = true; };
  }, [taskId, loadSuggestions]);

  /* ── Handlers ────────────────────────────────────────────────────────── */

  const handleRefine = async () => {
    if (!refinePrompt.trim()) return;
    setRefining(true);
    setAccepted(null);
    if (step === "accepted") setStep("suggestions");
    try {
      await loadSuggestions(refinePrompt.trim());
      setRefinePrompt("");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Refinement failed");
    } finally {
      setRefining(false);
    }
  };

  const handleAccept = (s: CodeSuggestion) => {
    setAccepted(s);
    setStep("accepted");
    setActionError(null);
  };

  const handleCommit = async () => {
    if (!accepted) return;
    setCommitting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/tasks/${taskId}/commit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: accepted.filePath,
          code: accepted.code,
          commitMessage: commitMsg || task?.title,
        }),
      });
      const body = await res.json() as { commitHash?: string; prUrl?: string; error?: string };
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setPrUrl(body.prUrl ?? null);
      setCommitHash(body.commitHash ?? null);
      setStep("committed");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Commit failed");
    } finally {
      setCommitting(false);
    }
  };

  const handleComplete = async () => {
    if (!commitHash) return;
    setCompleting(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commitHash }),
      });
      const body = await res.json() as { success?: boolean; error?: string };
      if (!res.ok) throw new Error(body.error ?? `HTTP ${res.status}`);
      setStep("completed");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Complete failed");
    } finally {
      setCompleting(false);
    }
  };

  /* ── Loading / error states ──────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full">
        <Spinner size="lg" />
        <p className="text-sm font-mono text-muted-foreground">Running AI pipeline…</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-full text-center">
        <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <svg className="h-6 w-6 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm0-12.75a9 9 0 110 18 9 9 0 010-18z" />
          </svg>
        </div>
        <p className="text-sm font-mono text-destructive">{error ?? "Task not found"}</p>
        <button onClick={() => navigate("/")} className="text-xs font-mono px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
          ← Back to tasks
        </button>
      </div>
    );
  }

  /* ── Derive display values ───────────────────────────────────────────── */

  const stackEntries = repo?.stackProfile
    ? Object.entries(repo.stackProfile).filter(([, v]) => v && v !== "none" && v !== "unknown")
    : [];

  const orderedSuggestions = AGENT_ORDER.map((a) => suggestions.find((s) => s.agent === a)).filter(Boolean) as CodeSuggestion[];
  const activeSuggestion = orderedSuggestions.find((s) => s.agent === activeAgent) ?? orderedSuggestions[0];
  const criteriaList = criteriaLines(task.acceptanceCriteria);
  const branchName = `task/${taskId}`;

  const stepIndex = (s: WorkflowStep) => STEP_ORDER.indexOf(s);

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="flex gap-4 h-full overflow-hidden animate-in fade-in duration-400">

      {/* ── LEFT PANEL ── */}
      <aside className="w-1/4 flex flex-col gap-4 overflow-y-auto shrink-0 pr-1">

        {/* Task header */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge className={sourceBadgeCls(task.source)}>{sourceLabel(task.source)}</Badge>
            <Badge className={typeBadgeCls(task.type)}>{typeLabel(task.type)}</Badge>
            <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">{priorityLabel(task.priority)}</Badge>
          </div>
          <h2 className="font-bold text-sm leading-snug">{task.title}</h2>
          {task.description && (
            <p className="text-xs text-muted-foreground font-mono leading-relaxed">{task.description}</p>
          )}
          <div className="text-[10px] font-mono text-muted-foreground/50 pt-1 border-t border-border">
            {task.externalId ?? `TASK-${task.id}`} · <span className="capitalize">{task.status.replace("-", " ")}</span>
          </div>
        </div>

        {/* Acceptance criteria */}
        {criteriaList.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Acceptance Criteria</span>
            <ul className="flex flex-col gap-2">
              {criteriaList.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <button
                    onClick={() => setCriteria((prev) => ({ ...prev, [i]: !prev[i] }))}
                    className={`mt-0.5 h-4 w-4 shrink-0 rounded border flex items-center justify-center transition-colors ${criteria[i] ? "bg-green-500 border-green-500" : "border-border hover:border-primary"}`}
                  >
                    {criteria[i] && (
                      <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <span className={`text-xs font-mono leading-relaxed ${criteria[i] ? "line-through text-muted-foreground/40" : "text-muted-foreground"}`}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Stack badges */}
        {stackEntries.length > 0 && (
          <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Stack · {repo?.name}</span>
            <div className="flex flex-wrap gap-1.5">
              {stackEntries.map(([key, value]) => (
                <span key={key} className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium ${stackPillCls(key)}`}>
                  {value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Refine with AI */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Refine with AI</span>
          <textarea
            ref={refineRef}
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void handleRefine(); }}
            placeholder="e.g. Use JWT instead of session cookies"
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-xs font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => void handleRefine()}
            disabled={refining || !refinePrompt.trim()}
            className="w-full h-8 rounded-md bg-primary text-primary-foreground text-xs font-mono font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          >
            {refining ? <><Spinner size="sm" /> Refining…</> : "Submit"}
          </button>
        </div>
      </aside>

      {/* ── CENTRE PANEL ── */}
      <section className="flex-1 flex flex-col gap-3 overflow-hidden min-w-0">
        <div className="shrink-0 flex items-center gap-1 bg-card border border-border rounded-lg p-1 overflow-x-auto">
          {orderedSuggestions.length === 0
            ? AGENT_ORDER.map((agent) => (
                <div key={agent} className={`flex-1 px-3 py-1.5 rounded-md text-xs font-mono text-center opacity-30 ${AGENT_META[agent]?.colour ?? ""}`}>
                  {AGENT_META[agent]?.label}
                </div>
              ))
            : orderedSuggestions.map((s) => {
                const meta = AGENT_META[s.agent];
                const isActive = s.agent === activeAgent;
                const isRec = s.recommendation === "Recommended";
                return (
                  <button
                    key={s.agent}
                    data-testid={`tab-${s.agent}`}
                    onClick={() => setActiveAgent(s.agent)}
                    className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap ${isActive ? `${meta?.colour ?? ""} border` : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  >
                    {meta?.label}
                    {isRec && (
                      <span className="shrink-0 px-1 py-0 rounded text-[9px] font-bold bg-green-500/15 text-green-400 border border-green-500/30">
                        ★ Recommended
                      </span>
                    )}
                  </button>
                );
              })}
        </div>

        {/* Code panel */}
        <div className="flex-1 overflow-hidden flex flex-col gap-3 min-h-0">
          {suggestions.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs font-mono text-muted-foreground">No suggestions loaded.</p>
            </div>
          ) : activeSuggestion ? (
            <>
              {/* File path */}
              <div className="shrink-0 flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-muted/40 border border-border">
                <span className="text-[10px] font-mono text-muted-foreground truncate">{activeSuggestion.filePath}</span>
                <span className="text-[10px] font-mono text-muted-foreground/50 shrink-0">{activeSuggestion.language}</span>
              </div>

              {/* Highlighted code */}
              <div className="flex-1 overflow-auto rounded-lg border border-border text-xs">
                <SyntaxHighlighter
                  language={activeSuggestion.language}
                  style={vscDarkPlus}
                  customStyle={{ margin: 0, borderRadius: "0.5rem", fontSize: "0.7rem", minHeight: "100%", background: "transparent" }}
                  showLineNumbers
                  wrapLongLines={false}
                >
                  {activeSuggestion.code}
                </SyntaxHighlighter>
              </div>

              {/* Score + explanation */}
              <div className="shrink-0 flex items-start gap-3 bg-card border border-border rounded-lg p-3">
                {activeSuggestion.score !== undefined && (
                  <div className="shrink-0 flex flex-col items-center px-3 py-1 rounded-md border border-border bg-muted/30">
                    <span className="text-lg font-bold font-mono text-foreground leading-none">{activeSuggestion.score.toFixed(1)}</span>
                    <span className="text-[9px] font-mono text-muted-foreground">/10</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground font-mono leading-relaxed">{activeSuggestion.explanation}</p>
              </div>

              {/* Accept button */}
              <button
                data-testid={`btn-accept-${activeSuggestion.agent}`}
                onClick={() => handleAccept(activeSuggestion)}
                disabled={accepted?.agent === activeSuggestion.agent}
                className={`shrink-0 w-full h-9 rounded-lg text-xs font-mono font-semibold transition-colors ${accepted?.agent === activeSuggestion.agent ? "bg-green-500/10 text-green-400 border border-green-500/30 cursor-default" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
              >
                {accepted?.agent === activeSuggestion.agent ? "✓ Accepted" : "Accept this code"}
              </button>
            </>
          ) : null}
        </div>
      </section>

      {/* ── RIGHT PANEL ── */}
      <aside className="w-1/4 flex flex-col gap-4 overflow-y-auto shrink-0 pl-1">

        {/* Status stepper */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Workflow</span>
          <div className="flex flex-col gap-0">
            {STEP_LABELS.map(({ key, label }, i) => {
              const done   = stepIndex(step) > stepIndex(key);
              const active = step === key;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-5 w-5 rounded-full flex items-center justify-center border text-[9px] font-bold font-mono transition-colors ${done ? "bg-green-500 border-green-500 text-white" : active ? "bg-primary border-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                      {done ? (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < STEP_LABELS.length - 1 && (
                      <div className={`w-px h-4 ${done ? "bg-green-500/40" : "bg-border"}`} />
                    )}
                  </div>
                  <span className={`text-xs font-mono ${active ? "text-foreground font-semibold" : done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Branch name */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Branch</span>
          <div className="flex items-center gap-2 bg-muted/40 rounded-md px-3 py-2">
            <svg className="h-3 w-3 text-muted-foreground shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 7a2 2 0 110 4 2 2 0 010-4zm10 10a2 2 0 110 4 2 2 0 010-4zm-10 0a2 2 0 110 4 2 2 0 010-4M7 11v5m10-9v3" />
            </svg>
            <span className="text-xs font-mono text-foreground">{branchName}</span>
          </div>
        </div>

        {/* Commit message */}
        <div className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Commit message</span>
          <textarea
            value={commitMsg}
            onChange={(e) => setCommitMsg(e.target.value)}
            disabled={step === "committed" || step === "completed"}
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-xs font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
          />
        </div>

        {/* Accepted suggestion summary */}
        {accepted && (
          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 flex flex-col gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-green-400">Accepted suggestion</span>
            <p className="text-xs font-mono text-green-300">{AGENT_META[accepted.agent]?.label}</p>
            <p className="text-[10px] font-mono text-muted-foreground truncate">{accepted.filePath}</p>
          </div>
        )}

        {/* Error */}
        {actionError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-xs font-mono text-destructive leading-relaxed">{actionError}</p>
          </div>
        )}

        {/* PR link */}
        {prUrl && (
          <a
            href={prUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-card border border-border rounded-lg p-3 text-xs font-mono text-primary hover:underline"
          >
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Pull Request
          </a>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            data-testid="btn-commit"
            onClick={() => void handleCommit()}
            disabled={!accepted || committing || step === "committed" || step === "completed"}
            className="w-full h-9 rounded-lg text-xs font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          >
            {committing ? <><Spinner size="sm" /> Committing…</> : step === "committed" || step === "completed" ? "✓ PR opened" : "Commit + open PR"}
          </button>

          <button
            data-testid="btn-complete"
            onClick={() => void handleComplete()}
            disabled={step !== "committed" || completing}
            className="w-full h-9 rounded-lg text-xs font-mono font-semibold border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
          >
            {completing ? <><Spinner size="sm" /> Completing…</> : step === "completed" ? "✓ Task closed" : "Mark task complete"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full h-8 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            ← Back to tasks
          </button>
        </div>
      </aside>
    </div>
  );
}
