import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '@clerk/react';
import type { Repository } from '@/services/api';
import type { StackProfile } from '@/components/dc';
import { fetchRepositories } from '@/services/api';

interface RepoContextValue {
  repos: Repository[];
  reposLoading: boolean;
  activeRepository: Repository | null;
  setActiveRepository: (repo: Repository | null) => void;
  stackProfile: StackProfile | null;
  setStackProfile: (sp: StackProfile | null) => void;
  refetchRepos: () => void;
}

const RepoContext = createContext<RepoContextValue | null>(null);

export function RepoProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [reposLoading, setReposLoading] = useState(false);
  const [activeRepository, setActiveRepositoryState] = useState<Repository | null>(null);
  const [stackProfile, setStackProfile] = useState<StackProfile | null>(null);

  const setActiveRepository = useCallback((repo: Repository | null) => {
    setActiveRepositoryState(repo);
    if (repo?.stackProfile) setStackProfile(repo.stackProfile as StackProfile);
    else setStackProfile(null);
  }, []);

  const fetchRepos = useCallback(async () => {
    setReposLoading(true);
    try {
      const data = await fetchRepositories();
      setRepos(data);
      setActiveRepositoryState((prev) => {
        if (prev) {
          const updated = data.find((r) => r.id === prev.id);
          return updated ?? data[0] ?? null;
        }
        const first = data[0] ?? null;
        if (first?.stackProfile) setStackProfile(first.stackProfile as StackProfile);
        return first;
      });
    } catch { /* network error, keep stale */ }
    finally { setReposLoading(false); }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) void fetchRepos();
  }, [isLoaded, isSignedIn, fetchRepos]);

  return (
    <RepoContext.Provider value={{ repos, reposLoading, activeRepository, setActiveRepository, stackProfile, setStackProfile, refetchRepos: fetchRepos }}>
      {children}
    </RepoContext.Provider>
  );
}

export function useRepo() {
  const ctx = useContext(RepoContext);
  if (!ctx) throw new Error('useRepo must be used inside RepoProvider');
  return ctx;
}
