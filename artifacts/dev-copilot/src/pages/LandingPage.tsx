import { Link } from "wouter";

export default function LandingPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "20px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={`${basePath}/logo.png`} alt="Blue Mantis" style={{ width: 28, height: 28, objectFit: "contain" }} />
          <span style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>Blue Mantis</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            href="/sign-in"
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              textDecoration: "none",
              padding: "7px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              transition: "border-color 150ms ease",
            }}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{
              fontSize: 13,
              color: "#fff",
              textDecoration: "none",
              padding: "7px 14px",
              borderRadius: "var(--radius-md)",
              background: "var(--accent-purple)",
              fontWeight: 500,
            }}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
          gap: 32,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent-purple)",
            background: "rgba(124,111,247,0.12)",
            padding: "4px 12px",
            borderRadius: 999,
            border: "1px solid rgba(124,111,247,0.25)",
          }}
        >
          AI-Powered Dev Tooling
        </div>

        <h1
          style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 800,
            margin: 0,
            color: "var(--text-primary)",
          }}
        >
          Ship tasks faster with{" "}
          <span style={{ color: "var(--accent-purple)" }}>AI-guided</span> code suggestions
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "var(--text-secondary)",
            maxWidth: 560,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Blue Mantis connects your Azure DevOps, Jira tasks, and GitHub repositories — then uses Claude and GPT-4 to generate targeted code suggestions scoped to your actual codebase.
        </p>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/sign-up"
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#fff",
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: "var(--radius-md)",
              background: "var(--accent-purple)",
            }}
          >
            Start for free
          </Link>
          <Link
            href="/sign-in"
            style={{
              fontSize: 15,
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
              padding: "12px 28px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
            }}
          >
            Sign in
          </Link>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          {[
            "Azure DevOps sync",
            "Jira integration",
            "GitHub stack detection",
            "Claude & GPT-4",
            "Multi-tenant isolation",
          ].map((f) => (
            <span
              key={f}
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: 999,
                padding: "4px 12px",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "20px 40px",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          fontSize: 12,
          color: "var(--text-muted)",
        }}
      >
        Blue Mantis — AI-powered task management for software teams
      </footer>
    </div>
  );
}
