import React, { useState } from "react";
import { useConfig, type ConfigMap } from "@/context/ConfigContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Field {
  key: string;
  label: string;
  placeholder: string;
  hint?: string;
}

interface Integration {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  fields: Field[];
  steps: { label: string; link?: { text: string; url: string } }[];
  testKey: string;
}

// ─── Integrations definition ──────────────────────────────────────────────────

const INTEGRATIONS: Integration[] = [
  {
    id: "anthropic",
    title: "Anthropic (Claude)",
    subtitle: "AI code suggestions via Claude Sonnet",
    icon: <AnthropicIcon />,
    testKey: "anthropic",
    fields: [
      { key: "ANTHROPIC_API_KEY", label: "API Key", placeholder: "sk-ant-api03-…", hint: "Starts with sk-ant-" },
    ],
    steps: [
      { label: "Go to console.anthropic.com and sign in" },
      { label: "Open API Keys from the left sidebar", link: { text: "Open console", url: "https://console.anthropic.com/account/keys" } },
      { label: "Click Create Key, copy the value, paste it below" },
    ],
  },
  {
    id: "openai",
    title: "OpenAI (GPT-4o)",
    subtitle: "Alternative AI suggestions via GPT-4o",
    icon: <OpenAIIcon />,
    testKey: "openai",
    fields: [
      { key: "OPENAI_API_KEY", label: "API Key", placeholder: "sk-proj-…", hint: "Starts with sk-" },
    ],
    steps: [
      { label: "Go to platform.openai.com and sign in" },
      { label: "Open API Keys page", link: { text: "Open platform", url: "https://platform.openai.com/api-keys" } },
      { label: "Click Create new secret key, copy the value, paste it below" },
    ],
  },
  {
    id: "gemini",
    title: "Google Gemini",
    subtitle: "AI code suggestions via Gemini 1.5 Pro / 2.0 Flash",
    icon: <GeminiIcon />,
    testKey: "gemini",
    fields: [
      {
        key: "GOOGLE_GEMINI_API_KEY",
        label: "API Key",
        placeholder: "AIza…",
        hint: "Starts with AIza — from Google AI Studio",
      },
    ],
    steps: [
      {
        label: "Go to Google AI Studio and sign in",
        link: { text: "Open AI Studio", url: "https://aistudio.google.com/app/apikey" },
      },
      { label: "Click Get API key → Create API key in new project (or an existing project)" },
      { label: "Copy the key and paste it below — it starts with AIza" },
    ],
  },
  {
    id: "copilot",
    title: "GitHub Copilot",
    subtitle: "AI completions via GitHub Copilot (token stored for future use)",
    icon: <CopilotIcon />,
    testKey: "copilot",
    fields: [
      {
        key: "GITHUB_COPILOT_TOKEN",
        label: "Copilot Token",
        placeholder: "ghu_… or ghp_…",
        hint: "GitHub does not yet offer a public Copilot generation API",
      },
    ],
    steps: [
      {
        label: "GitHub Copilot's code-generation API is not publicly available — only IDE plugins can use it",
      },
      {
        label: "Save your token here now so the app is ready when GitHub opens up access",
        link: { text: "Check Copilot docs", url: "https://docs.github.com/en/copilot" },
      },
      {
        label: "When a public API ships, no Settings change will be needed — just re-save the token",
      },
    ],
  },
  {
    id: "github",
    title: "GitHub",
    subtitle: "File context for suggestions + PR creation",
    icon: <GitHubIcon />,
    testKey: "github",
    fields: [
      { key: "GITHUB_TOKEN", label: "Personal Access Token", placeholder: "ghp_…", hint: "Needs repo scope" },
    ],
    steps: [
      { label: "Go to GitHub → Settings → Developer settings", link: { text: "Open settings", url: "https://github.com/settings/tokens/new" } },
      { label: "Select Classic token, tick the repo scope, set an expiry" },
      { label: "Generate token, copy it, paste it below" },
    ],
  },
  {
    id: "azurerepos",
    title: "Azure Repos",
    subtitle: "Azure Git repositories — file context + PR creation",
    icon: <AzureReposIcon />,
    testKey: "azurerepos",
    fields: [
      {
        key: "AZURE_REPOS_ORG",
        label: "Organisation",
        placeholder: "mycompany",
        hint: "The part after dev.azure.com/ in your browser URL",
      },
      {
        key: "AZURE_REPOS_TOKEN",
        label: "Personal Access Token",
        placeholder: "Paste your PAT here",
        hint: "Needs Code → Read & Write scope",
      },
    ],
    steps: [
      { label: "Open dev.azure.com and note your organisation name from the URL (dev.azure.com/{org})" },
      {
        label: "Click your avatar → Personal Access Tokens",
        link: { text: "Open ADO", url: "https://dev.azure.com" },
      },
      {
        label: "Click New Token — set scope to Code → Read & Write only (do NOT use Full access)",
      },
      {
        label: "Enter your organisation name above, paste the token, then click Test connection.",
      },
    ],
  },
  {
    id: "jira",
    title: "JIRA",
    subtitle: "Sync tasks from your JIRA project board",
    icon: <JiraIcon />,
    testKey: "jira",
    fields: [
      { key: "JIRA_DOMAIN", label: "Domain", placeholder: "acme.atlassian.net", hint: "Just the domain, no https://" },
      { key: "JIRA_EMAIL", label: "Account email", placeholder: "you@company.com" },
      { key: "JIRA_API_TOKEN", label: "API Token", placeholder: "ATATT3xFfGF…", hint: "Created in Atlassian account settings" },
    ],
    steps: [
      { label: "Find your JIRA domain — it's the part before .atlassian.net in your browser URL" },
      { label: "Create an API token at id.atlassian.com", link: { text: "Create token", url: "https://id.atlassian.com/manage-profile/security/api-tokens" } },
      { label: "Click Create API token, give it a name, copy the value" },
      { label: "Fill in your domain, the email you log in with, and paste the token below" },
    ],
  },
  {
    id: "azuredevops",
    title: "Azure DevOps",
    subtitle: "Sync work items from your ADO project",
    icon: <AzureIcon />,
    testKey: "azuredevops",
    fields: [
      { key: "AZURE_DEVOPS_ORG", label: "Organisation", placeholder: "mycompany", hint: "The part after dev.azure.com/" },
      { key: "AZURE_DEVOPS_PROJECT", label: "Project (optional)", placeholder: "MyProject" },
      { key: "AZURE_DEVOPS_PAT", label: "Personal Access Token", placeholder: "Paste your PAT here", hint: "Needs Work Items read/write" },
    ],
    steps: [
      { label: "Open dev.azure.com, find your organisation name in the URL" },
      { label: "Go to User Settings → Personal Access Tokens", link: { text: "Open ADO", url: "https://dev.azure.com" } },
      { label: "Click New Token, set scope to Work Items → Read & Write, copy the token" },
      { label: "Fill in your organisation, project name (optional), and paste the token below" },
    ],
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function AnthropicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#D4845A" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="11" fontWeight="700">A</text>
    </svg>
  );
}
function OpenAIIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#10A37F" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">GPT</text>
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <rect width="24" height="24" rx="6" fill="#24292E" />
      <path d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12c0 3.75 2.44 6.94 5.82 8.07.43.08.59-.18.59-.41V18.3c-2.37.51-2.87-1.14-2.87-1.14-.39-1-.95-1.26-.95-1.26-.77-.53.06-.52.06-.52.85.06 1.3.88 1.3.88.76 1.3 1.99.92 2.47.7.08-.55.3-.92.54-1.13-1.89-.21-3.88-.95-3.88-4.21 0-.93.33-1.69.88-2.29-.09-.21-.38-1.08.08-2.25 0 0 .72-.23 2.35.88a8.2 8.2 0 0 1 2.15-.29c.73 0 1.46.1 2.15.29 1.63-1.11 2.35-.88 2.35-.88.46 1.17.17 2.04.08 2.25.55.6.87 1.36.87 2.29 0 3.27-1.99 3.99-3.89 4.2.31.27.58.8.58 1.61v2.38c0 .23.15.5.59.41A8.51 8.51 0 0 0 20.5 12C20.5 7.3 16.7 3.5 12 3.5Z" fill="white" />
    </svg>
  );
}
function JiraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0052CC" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">J</text>
    </svg>
  );
}
function AzureIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0078D4" />
      <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="700">ADO</text>
    </svg>
  );
}
function AzureReposIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0078D4" />
      <path d="M17 7H13L7 12L13 17H17L11 12L17 7Z" fill="white" />
      <rect x="7" y="11" width="2" height="2" rx="1" fill="white" />
    </svg>
  );
}
function GeminiIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1A73E8" />
      <path d="M12 4L13.8 10.2H20.4L15 13.8L16.8 20L12 16.4L7.2 20L9 13.8L3.6 10.2H10.2L12 4Z" fill="white" />
    </svg>
  );
}
function CopilotIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#6E40C9" />
      <circle cx="9" cy="10" r="2" fill="white" />
      <circle cx="15" cy="10" r="2" fill="white" />
      <path d="M8 15c0 0 1.5 2 4 2s4-2 4-2" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusPill({ set }: { set: boolean }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
      background: set ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
      color: set ? "#22c55e" : "var(--dc-text-muted)",
      border: `1px solid ${set ? "rgba(34,197,94,0.3)" : "var(--dc-border)"}`,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: set ? "#22c55e" : "var(--dc-text-muted)",
        flexShrink: 0,
      }} />
      {set ? "Configured" : "Not set"}
    </span>
  );
}

function SecretInput({
  value, onChange, placeholder, disabled,
}: {
  value: string; onChange: (v: string) => void; placeholder: string; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        style={{
          width: "100%", boxSizing: "border-box",
          padding: "9px 40px 9px 12px",
          background: "var(--dc-bg)", border: "1px solid var(--dc-border)",
          borderRadius: "var(--dc-radius-sm)", color: "var(--dc-text-primary)",
          fontSize: "13px", fontFamily: "var(--dc-font-mono)",
          outline: "none", transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--dc-accent)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--dc-border)")}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer",
          color: "var(--dc-text-muted)", padding: 0, lineHeight: 1,
        }}
        title={show ? "Hide" : "Show"}
      >
        {show ? "🙈" : "👁"}
      </button>
    </div>
  );
}

// ─── Integration Card ─────────────────────────────────────────────────────────

function IntegrationCard({
  integration,
  configMap,
  onSaved,
}: {
  integration: Integration;
  configMap: ConfigMap;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const handleRemove = async (key: string) => {
    setRemoving(key);
    setRemoveError(null);
    try {
      const res = await fetch(`/api/config/${encodeURIComponent(key)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Remove failed");
      onSaved();
    } catch {
      setRemoveError("Failed to remove — please try again");
    } finally {
      setRemoving(null);
    }
  };

  const isConfigured = integration.fields.every((f) => configMap[f.key]?.set);

  const setField = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setTestResult(null);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const payload: Record<string, string> = {};
      for (const f of integration.fields) {
        const v = values[f.key] ?? "";
        if (v) payload[f.key] = v;
      }
      const res = await fetch(`/api/config/test/${integration.testKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      setTestResult(data);
    } catch {
      setTestResult({ ok: false, message: "Network error — could not reach the server" });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const payload: Record<string, string> = {};
      for (const f of integration.fields) {
        const v = values[f.key] ?? "";
        if (v) payload[f.key] = v;
      }
      const res = await fetch("/api/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      setSaveMsg("Saved!");
      setValues({});
      onSaved();
      setTimeout(() => setSaveMsg(null), 3000);
    } catch {
      setSaveMsg("Failed to save — try again");
    } finally {
      setSaving(false);
    }
  };

  const hasNewValues = integration.fields.some((f) => (values[f.key] ?? "").trim().length > 0);

  return (
    <div style={{
      border: `1px solid ${open ? "var(--dc-accent)" : "var(--dc-border)"}`,
      borderRadius: "var(--dc-radius-md)",
      background: "var(--dc-surface)",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: 14,
          padding: "16px 20px", background: "none", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ flexShrink: 0 }}>{integration.icon}</span>
        <span style={{ flex: 1 }}>
          <span style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--dc-text-primary)" }}>
            {integration.title}
          </span>
          <span style={{ display: "block", fontSize: "12px", color: "var(--dc-text-muted)", marginTop: 2 }}>
            {integration.subtitle}
          </span>
        </span>
        <StatusPill set={isConfigured} />
        <ChevronIcon open={open} />
      </button>

      {/* Body */}
      {open && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid var(--dc-border)" }}>
          {/* Steps */}
          <div style={{ margin: "16px 0 20px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--dc-text-muted)", marginBottom: 10 }}>
              How to obtain credentials
            </p>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {integration.steps.map((step, i) => (
                <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, width: 20, height: 20, borderRadius: "50%",
                    background: "var(--dc-bg)", border: "1px solid var(--dc-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "10px", fontWeight: 700, color: "var(--dc-text-muted)",
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--dc-text-secondary)", lineHeight: 1.5, paddingTop: 1 }}>
                    {step.label}
                    {step.link && (
                      <>
                        {" "}
                        <a
                          href={step.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "var(--dc-accent)", textDecoration: "none" }}
                        >
                          {step.link.text} ↗
                        </a>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Fields */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {integration.fields.map((field) => (
              <div key={field.key}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--dc-text-secondary)", marginBottom: 5 }}>
                  {field.label}
                  {field.hint && (
                    <span style={{ fontWeight: 400, color: "var(--dc-text-muted)", marginLeft: 6 }}>— {field.hint}</span>
                  )}
                </label>
                {configMap[field.key]?.set && !(field.key in values) ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      flex: 1, padding: "9px 12px",
                      background: "var(--dc-bg)", border: "1px solid var(--dc-border)",
                      borderRadius: "var(--dc-radius-sm)", fontSize: "13px",
                      fontFamily: "var(--dc-font-mono)", color: "var(--dc-text-muted)",
                    }}>
                      {configMap[field.key].masked}
                    </div>
                    <button
                      onClick={() => setField(field.key, "")}
                      style={{
                        padding: "8px 14px", fontSize: "12px", fontWeight: 600,
                        background: "none", border: "1px solid var(--dc-border)",
                        borderRadius: "var(--dc-radius-sm)", color: "var(--dc-text-muted)",
                        cursor: "pointer",
                      }}
                    >
                      Replace
                    </button>
                    <button
                      onClick={() => handleRemove(field.key)}
                      disabled={removing === field.key}
                      style={{
                        padding: "8px 14px", fontSize: "12px", fontWeight: 600,
                        background: "none", border: "1px solid rgba(239,68,68,0.4)",
                        borderRadius: "var(--dc-radius-sm)", color: "#ef4444",
                        cursor: removing === field.key ? "not-allowed" : "pointer",
                        opacity: removing === field.key ? 0.6 : 1,
                      }}
                    >
                      {removing === field.key ? "Removing…" : "Remove"}
                    </button>
                  </div>
                ) : (
                  <SecretInput
                    value={values[field.key] ?? ""}
                    onChange={(v) => setField(field.key, v)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Remove error */}
          {removeError && (
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: "var(--dc-radius-sm)",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              fontSize: "13px", color: "#ef4444",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>✗</span>
              {removeError}
            </div>
          )}

          {/* Test result */}
          {testResult && (
            <div style={{
              marginTop: 14, padding: "10px 14px", borderRadius: "var(--dc-radius-sm)",
              background: testResult.ok ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${testResult.ok ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
              fontSize: "13px",
              color: testResult.ok ? "#22c55e" : "#ef4444",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span>{testResult.ok ? "✓" : "✗"}</span>
              {testResult.message}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
            <button
              onClick={handleTest}
              disabled={testing}
              style={{
                padding: "8px 18px", fontSize: "13px", fontWeight: 600,
                background: "none", border: "1px solid var(--dc-border)",
                borderRadius: "var(--dc-radius-sm)", color: "var(--dc-text-secondary)",
                cursor: testing ? "not-allowed" : "pointer",
                opacity: testing ? 0.6 : 1,
              }}
            >
              {testing ? "Testing…" : "Test connection"}
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasNewValues}
              style={{
                padding: "8px 22px", fontSize: "13px", fontWeight: 600,
                background: hasNewValues ? "var(--dc-accent)" : "var(--dc-surface-raised)",
                border: "none", borderRadius: "var(--dc-radius-sm)",
                color: hasNewValues ? "#fff" : "var(--dc-text-muted)",
                cursor: saving || !hasNewValues ? "not-allowed" : "pointer",
                opacity: saving ? 0.7 : 1,
                transition: "background 0.15s",
              }}
            >
              {saving ? "Saving…" : saveMsg ?? "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14" height="14" viewBox="0 0 14 14" fill="none"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0 }}
    >
      <path d="M3 5l4 4 4-4" stroke="var(--dc-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ configured, total }: { configured: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((configured / total) * 100);
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: "13px", color: "var(--dc-text-secondary)" }}>
          {configured} of {total} integrations configured
        </span>
        <span style={{ fontSize: "13px", fontWeight: 600, color: pct === 100 ? "#22c55e" : "var(--dc-text-muted)" }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 4, background: "var(--dc-border)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: pct === 100 ? "#22c55e" : "var(--dc-accent)",
          borderRadius: 4, transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { configMap, loading, error, refreshConfig } = useConfig();

  const configuredCount = INTEGRATIONS.filter((integ) =>
    integ.fields.every((f) => configMap[f.key]?.set)
  ).length;

  return (
    <div style={{ padding: "40px 48px", maxWidth: 680 }}>
      <h1 style={{
        fontSize: "22px", fontWeight: 600, color: "var(--dc-text-primary)", marginBottom: 4,
      }}>
        Settings
      </h1>
      <p style={{ fontSize: "13px", color: "var(--dc-text-muted)", marginBottom: 32 }}>
        Connect your tools. Credentials are stored securely in the database and loaded automatically on startup.
      </p>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: 64, borderRadius: "var(--dc-radius-md)", background: "var(--dc-surface)", border: "1px solid var(--dc-border)", animation: "dc-pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : error ? (
        <div style={{ padding: "16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "var(--dc-radius-md)", color: "#ef4444", fontSize: "13px" }}>
          {error}
        </div>
      ) : (
        <>
          <ProgressBar configured={configuredCount} total={INTEGRATIONS.length} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {INTEGRATIONS.map((integ) => (
              <IntegrationCard
                key={integ.id}
                integration={integ}
                configMap={configMap}
                onSaved={refreshConfig}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
