import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <style>{`
        .dc-main-content {
          margin-left: 220px;
          flex: 1;
          background: var(--bg-app);
          overflow-y: auto;
          transition: margin-left 200ms ease;
          min-height: 100vh;
        }
        @media (max-width: 1200px) {
          .dc-main-content { margin-left: 48px; }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
        <Sidebar isAzureConnected={true} isJiraConnected={true} />
        <main className="dc-main-content">
          {children}
        </main>
      </div>
    </>
  );
}
