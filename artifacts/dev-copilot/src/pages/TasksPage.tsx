import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'wouter';
import { Badge } from '@/components/dc/Badge';
import { Button } from '@/components/dc/Button';
import { Skeleton } from '@/components/dc/Skeleton';
import { StackBadge } from '@/components/dc/StackBadge';
import { ToastContainer } from '@/components/dc/Toast';
import { useToast } from '@/components/dc/useToast';
import { TaskRow } from '@/components/tasks/TaskRow';
import { FilterPills, applyFilters } from '@/components/tasks/FilterPills';
import type { FilterState } from '@/components/tasks/FilterPills';
import { useRepo } from '@/context/RepoContext';
import {
  fetchTasks, fetchRepositories, connectRepository, redetectStack,
  type DevCopilotTask, type Repository,
} from '@/services/api';

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-raised)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-md)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-sans)',
  fontSize: 13,
  padding: '8px 12px',
  outline: 'none',
  boxSizing: 'border-box',
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 10,
  color: 'var(--text-muted)',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 500,
  fontFamily: 'var(--font-sans)',
  display: 'block',
  marginBottom: 6,
};

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ animation: spinning ? 'dc-spin 1s linear infinite' : 'none', flexShrink: 0 }}>
      <path d="M13 2v4h-4" />
      <path d="M1 12v-4h4" />
      <path d="M11.5 5A6 6 0 1 0 12 9" />
    </svg>
  );
}

interface ConnectModalProps {
  onClose: () => void;
  onSuccess: (repo: Repository) => void;
}

function ConnectModal({ onClose, onSuccess }: ConnectModalProps) {
  const [url, setUrl] = useState('');
  const [provider, setProvider] = useState('github');
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('main');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedRepo, setDetectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const repo = await connectRepository({ url, provider, name: name || url, defaultBranch: branch });
      setDetectedRepo(repo);
      setTimeout(() => { onSuccess(repo); }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect repository');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24, width: 480, maxWidth: '90vw', position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}
        >×</button>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Connect Repository</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Link a Git repository to DevCopilot</p>

        {detectedRepo ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <p style={{ color: 'var(--accent-green)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Repository connected!</p>
            {detectedRepo.stackProfile && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StackBadge stackProfile={detectedRepo.stackProfile} />
              </div>
            )}
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Closing…</p>
          </div>
        ) : (
          <form onSubmit={(e) => void handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={LABEL_STYLE}>Repository URL</label>
              <input
                data-testid="input-repo-url"
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/org/repo"
                style={INPUT_STYLE}
              />
            </div>
            <div>
              <label style={LABEL_STYLE}>Display name</label>
              <input
                data-testid="input-repo-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="my-repo"
                style={INPUT_STYLE}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={LABEL_STYLE}>Provider</label>
                <select
                  data-testid="select-repo-provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  style={{ ...INPUT_STYLE }}
                >
                  <option value="github">GitHub</option>
                  <option value="azure-repos">Azure Repos</option>
                </select>
              </div>
              <div>
                <label style={LABEL_STYLE}>Default branch</label>
                <input
                  data-testid="input-repo-branch"
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  style={INPUT_STYLE}
                />
              </div>
            </div>
            {error && (
              <div style={{ background: 'rgba(240,101,101,0.1)', borderLeft: '4px solid var(--accent-red)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: 13, color: 'var(--accent-red)' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <Button label="Cancel" variant="outline" size="md" onClick={onClose} style={{ flex: 1 }} />
              <Button label={submitting ? 'Connecting…' : 'Connect'} variant="primary" size="md" type="submit" loading={submitting} style={{ flex: 1 }} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [, navigate] = useLocation();
  const { toasts, showSuccess, showError, dismiss } = useToast();
  const { repos, reposLoading, activeRepository, setActiveRepository, stackProfile, setStackProfile, refetchRepos } = useRepo();

  const [tasks, setTasks] = useState<DevCopilotTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [redetecting, setRedetecting] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ type: 'All', source: 'All', priority: 'All' });

  useEffect(() => { document.title = 'DevCopilot — Sprint Backlog'; }, []);

  const loadTasks = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setSyncing(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
      if (silent) showSuccess('Tasks synced');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(msg);
      if (silent) showError(`Sync failed — ${msg}`);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [showSuccess, showError]);

  useEffect(() => { void loadTasks(); }, [loadTasks]);

  const handleRedetect = async () => {
    if (!activeRepository) return;
    setRedetecting(true);
    try {
      const sp = await redetectStack(activeRepository.id);
      setStackProfile(sp);
      showSuccess(`Stack detected: ${sp.frontend} · ${sp.backend} · ${sp.database}`);
    } catch (err) {
      showError(`Stack detection failed — ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setRedetecting(false);
    }
  };

  const handleGenerate = async (taskId: number) => {
    navigate(`/workspace/${taskId}`);
  };

  const filtered = applyFilters(tasks, filters);

  return (
    <div style={{ padding: 32, maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>
          Sprint backlog
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Badge label={`${filtered.length} task${filtered.length !== 1 ? 's' : ''}`} variant="muted" />
          <Button
            label={syncing ? 'Syncing…' : 'Sync'}
            variant="outline"
            size="sm"
            loading={syncing}
            icon={<RefreshIcon spinning={syncing} />}
            onClick={() => void loadTasks(true)}
            data-testid="btn-sync-tasks"
          />
        </div>
      </div>

      {/* Repo bar */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '10px 16px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}>
        <select
          data-testid="repo-selector"
          value={activeRepository?.id ?? ''}
          disabled={reposLoading}
          onChange={(e) => {
            const r = repos.find((r) => r.id === Number(e.target.value));
            if (r) setActiveRepository(r);
          }}
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 13,
            fontFamily: 'var(--font-mono)',
            padding: '6px 10px',
            cursor: 'pointer',
            minWidth: 140,
          }}
        >
          {reposLoading
            ? <option>Loading…</option>
            : repos.length === 0
              ? <option>No repos</option>
              : repos.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)
          }
        </select>
        {activeRepository && stackProfile && (
          <StackBadge stackProfile={stackProfile} />
        )}
        <div style={{ flex: 1 }} />
        <Button
          label="Connect repo"
          variant="ghost"
          size="sm"
          onClick={() => setShowModal(true)}
          data-testid="btn-add-repository"
        />
        <Button
          label={redetecting ? 'Detecting…' : 'Re-detect stack'}
          variant="ghost"
          size="sm"
          loading={redetecting}
          onClick={() => void handleRedetect()}
          data-testid="btn-redetect-stack"
        />
      </div>

      {/* Filters */}
      <FilterPills filters={filters} onChange={setFilters} />

      {/* Task list states */}
      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={64} borderRadius="var(--radius-md)" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div style={{
          background: 'rgba(240,101,101,0.10)',
          borderLeft: '4px solid var(--accent-red)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}>
          <span style={{ color: 'var(--accent-red)', fontSize: 13 }}>{error}</span>
          <Button label="Retry" variant="outline" size="sm" onClick={() => void loadTasks()} data-testid="btn-retry" />
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '80px 0', textAlign: 'center' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="12" y="8" width="56" height="64" rx="6" />
            <path d="M24 24h32M24 36h32M24 48h20" />
            <path d="M52 52l12 12M58 52l6 6" />
          </svg>
          <p style={{ fontSize: 14, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>No tasks found</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Sync your board to load tasks</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onGenerate={() => void handleGenerate(task.id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ConnectModal
          onClose={() => setShowModal(false)}
          onSuccess={(repo) => {
            setShowModal(false);
            refetchRepos();
            showSuccess('Repository connected — stack detected');
            setActiveRepository(repo);
          }}
        />
      )}

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  );
}
