import React from "react";

const SECTION: React.CSSProperties = {
  marginBottom: "32px",
};

const LABEL: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--dc-text-muted)",
  marginBottom: "12px",
};

const ROW: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  background: "var(--dc-surface)",
  borderRadius: "var(--dc-radius-md)",
  border: "1px solid var(--dc-border)",
  marginBottom: "8px",
};

const ROW_LABEL: React.CSSProperties = {
  fontSize: "14px",
  color: "var(--dc-text-primary)",
  fontWeight: 500,
};

const ROW_VALUE: React.CSSProperties = {
  fontSize: "13px",
  color: "var(--dc-text-muted)",
};

export default function SettingsPage() {
  return (
    <div style={{ padding: "40px 48px", maxWidth: "600px" }}>
      <h1 style={{
        fontSize: "22px",
        fontWeight: 600,
        color: "var(--dc-text-primary)",
        marginBottom: "32px",
      }}>
        Settings
      </h1>

      <div style={SECTION}>
        <p style={LABEL}>Integrations</p>
        <div style={ROW}>
          <span style={ROW_LABEL}>JIRA</span>
          <span style={{ ...ROW_VALUE, color: "var(--dc-success, #22c55e)" }}>Connected</span>
        </div>
        <div style={ROW}>
          <span style={ROW_LABEL}>Azure DevOps</span>
          <span style={{ ...ROW_VALUE, color: "var(--dc-success, #22c55e)" }}>Connected</span>
        </div>
        <div style={ROW}>
          <span style={ROW_LABEL}>GitHub</span>
          <span style={ROW_VALUE}>Not connected</span>
        </div>
      </div>

      <div style={SECTION}>
        <p style={LABEL}>AI Models</p>
        <div style={ROW}>
          <span style={ROW_LABEL}>Claude (Anthropic)</span>
          <span style={ROW_VALUE}>API key not set</span>
        </div>
        <div style={ROW}>
          <span style={ROW_LABEL}>OpenAI</span>
          <span style={ROW_VALUE}>API key not set</span>
        </div>
      </div>

      <div style={SECTION}>
        <p style={LABEL}>Appearance</p>
        <div style={ROW}>
          <span style={ROW_LABEL}>Theme</span>
          <span style={ROW_VALUE}>Dark</span>
        </div>
        <div style={ROW}>
          <span style={ROW_LABEL}>Font</span>
          <span style={ROW_VALUE}>JetBrains Mono</span>
        </div>
      </div>
    </div>
  );
}
