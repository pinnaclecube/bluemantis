import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5a5.5 5.5 0 1 0 7 7z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v1.6M8 13.4V15M1 8h1.6M13.4 8H15M3.05 3.05l1.13 1.13M11.82 11.82l1.13 1.13M3.05 12.95l1.13-1.13M11.82 4.18l1.13-1.13" />
    </svg>
  );
}

/** Persistent day/night toggle. `collapsed` hides the label for the icon rail. */
export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Before mount, assume the default (dark) so SSR/first-paint stays stable.
  const isDark = !mounted || resolvedTheme === "dark";
  const label = isDark ? "Light mode" : "Dark mode";

  return (
    <>
      <style>{`
        .dc-theme-toggle {
          display: flex; align-items: center; gap: 8px;
          width: 100%;
          background: none; border: none; cursor: pointer;
          color: var(--text-secondary);
          font-size: var(--fs-sm); font-family: var(--app-font-sans);
          padding: 6px 8px; border-radius: var(--radius-md);
          transition: background 120ms ease, color 120ms ease;
        }
        .dc-theme-toggle:hover { background: var(--bg-hover); color: var(--text-primary); }
        .dc-theme-toggle.collapsed { justify-content: center; padding: 8px 0; }
      `}</style>
      <button
        type="button"
        className={`dc-theme-toggle${collapsed ? " collapsed" : ""}`}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={label}
        aria-label={label}
        data-testid="theme-toggle"
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
        {!collapsed && <span>{label}</span>}
      </button>
    </>
  );
}
