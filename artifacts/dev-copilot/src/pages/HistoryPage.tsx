import React from "react";

export default function HistoryPage() {
  return (
    <div style={{ padding: "40px 48px" }}>
      <h1 style={{
        fontSize: "22px",
        fontWeight: 600,
        color: "var(--dc-text-primary)",
        marginBottom: "8px",
      }}>
        History
      </h1>
      <p style={{ color: "var(--dc-text-muted)", fontSize: "14px" }}>
        Past tasks and accepted suggestions will appear here.
      </p>
    </div>
  );
}
