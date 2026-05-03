import { useLocation, Link } from 'wouter';
import { useUser, useClerk } from '@clerk/react';
import { Tooltip } from '@/components/dc/Tooltip';
import { StackBadge } from '@/components/dc/StackBadge';
import { useRepo } from '@/context/RepoContext';

interface SidebarProps {
  isAzureConnected: boolean;
  isJiraConnected: boolean;
}

function Logo() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Red Mantis"
      style={{ width: 24, height: 24, objectFit: "contain", flexShrink: 0 }}
    />
  );
}

function TasksIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="1" width="12" height="14" rx="1.5" />
      <path d="M5 5h6M5 8h6M5 11h4" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6" />
      <path d="M8 5v3.5l2 2" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1.5v1.2M8 13.3v1.2M1.5 8h1.2M13.3 8h1.2M3.4 3.4l.85.85M11.75 11.75l.85.85M3.4 12.6l.85-.85M11.75 4.25l.85-.85" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: '/tasks', label: 'Tasks', Icon: TasksIcon, match: (l: string) => l === '/tasks' || l.startsWith('/workspace') || l.startsWith('/tasks/') },
  { href: '/history', label: 'History', Icon: HistoryIcon, match: (l: string) => l === '/history' },
  { href: '/settings', label: 'Settings', Icon: SettingsIcon, match: (l: string) => l === '/settings' },
];

export function Sidebar({ isAzureConnected, isJiraConnected }: SidebarProps) {
  const [location] = useLocation();
  const { activeRepository, stackProfile, setActiveRepository } = useRepo();
  const { user } = useUser();
  const { signOut } = useClerk();

  const initials = user
    ? (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? user.username?.[0] ?? '')
    : 'RM';

  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ''}`
    : (user?.username ?? user?.primaryEmailAddress?.emailAddress ?? 'User');

  return (
    <>
      <style>{`
        .dc-sidebar {
          position: fixed; left: 0; top: 0;
          width: 220px; height: 100vh;
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          z-index: 100; transition: width 200ms ease;
        }
        .dc-sidebar-wordmark-text,
        .dc-sidebar-nav-label,
        .dc-sidebar-stack-section,
        .dc-sidebar-bottom-text {
          transition: opacity 200ms ease;
        }
        @media (max-width: 1200px) {
          .dc-sidebar { width: 48px; }
          .dc-sidebar-wordmark-text,
          .dc-sidebar-nav-label,
          .dc-sidebar-stack-section,
          .dc-sidebar-bottom-text { display: none !important; }
          .dc-sidebar-nav-item { justify-content: center; padding: 10px 0 !important; }
          .dc-sidebar-bottom { align-items: center; }
          .dc-sidebar-status-text { display: none !important; }
        }
        .dc-signout-btn {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          color: var(--text-muted); font-size: 11px;
          font-family: var(--font-sans); padding: 4px 0;
          transition: color 150ms ease;
        }
        .dc-signout-btn:hover { color: var(--accent-red); }
      `}</style>

      <nav className="dc-sidebar">
        {/* Wordmark */}
        <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Logo />
          <span className="dc-sidebar-wordmark-text" style={{ color: 'var(--text-primary)', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-sans)' }}>
            Red Mantis
          </span>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ href, label, Icon, match }) => {
            const active = match(location);
            return (
              <Tooltip key={href} content={label}>
                <Link href={href} style={{ display: 'block', textDecoration: 'none', width: '100%' }}>
                  <div
                    className="dc-sidebar-nav-item"
                    data-testid={`nav-${label.toLowerCase()}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      fontSize: 13,
                      fontFamily: 'var(--font-sans)',
                      transition: 'background 150ms ease',
                      color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
                      background: active ? 'var(--bg-raised)' : 'transparent',
                      borderLeft: active ? '3px solid var(--accent-blue)' : '3px solid transparent',
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    <span style={{ flexShrink: 0 }}><Icon /></span>
                    <span className="dc-sidebar-nav-label">{label}</span>
                  </div>
                </Link>
              </Tooltip>
            );
          })}
        </div>

        {/* Active repo */}
        <div
          className="dc-sidebar-stack-section"
          style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}
        >
          <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>
            Active Repo
          </div>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 8 }}>
            {activeRepository?.name ?? 'None selected'}
          </div>
          {stackProfile && (
            <div style={{ marginBottom: 8 }}>
              <StackBadge stackProfile={stackProfile} />
            </div>
          )}
          <button
            onClick={() => setActiveRepository(null)}
            style={{ fontSize: 11, color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-sans)' }}
          >
            Change repo
          </button>
        </div>

        {/* Status / user */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border)', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="dc-sidebar-bottom" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isAzureConnected ? 'var(--accent-green)' : 'var(--accent-red)', flexShrink: 0 }} />
              <span className="dc-sidebar-status-text dc-sidebar-bottom-text">Azure DevOps</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isJiraConnected ? 'var(--accent-green)' : 'var(--accent-red)', flexShrink: 0 }} />
              <span className="dc-sidebar-status-text dc-sidebar-bottom-text">JIRA</span>
            </div>
          </div>

          {/* User avatar + sign out */}
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={displayName}
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1px solid var(--border)' }}
                />
              ) : (
                <div style={{
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: 'rgba(139,124,248,0.2)',
                  color: 'var(--accent-purple)',
                  fontSize: 11,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-sans)',
                  flexShrink: 0,
                  textTransform: 'uppercase',
                }}>
                  {initials.toUpperCase() || 'RM'}
                </div>
              )}
              <span
                className="dc-sidebar-bottom-text"
                style={{ fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {displayName}
              </span>
            </div>
            <button
              className="dc-signout-btn dc-sidebar-bottom-text"
              onClick={() => signOut()}
            >
              <SignOutIcon />
              Sign out
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
