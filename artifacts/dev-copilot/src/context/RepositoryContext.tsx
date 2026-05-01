import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export interface Repository {
  id: number;
  name: string;
  provider: string;
  url: string;
  defaultBranch: string;
  stackProfile: Record<string, string> | null;
  createdAt: string;
}

interface RepositoryContextValue {
  repos: Repository[];
  loading: boolean;
  selectedRepo: Repository | null;
  setSelectedRepo: (repo: Repository | null) => void;
  refetch: () => void;
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null);

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const fetchRepos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/repositories");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Repository[] = await res.json();
      setRepos(data);
      setSelectedRepo((prev) => {
        if (prev) {
          const updated = data.find((r) => r.id === prev.id);
          return updated ?? (data[0] ?? null);
        }
        return data[0] ?? null;
      });
    } catch {
      // keep stale state on network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRepos();
  }, [fetchRepos]);

  return (
    <RepositoryContext.Provider
      value={{ repos, loading, selectedRepo, setSelectedRepo, refetch: fetchRepos }}
    >
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const ctx = useContext(RepositoryContext);
  if (!ctx) throw new Error("useRepository must be used inside RepositoryProvider");
  return ctx;
}
