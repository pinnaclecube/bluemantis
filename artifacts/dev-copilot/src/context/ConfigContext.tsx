import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/react";

export type ConfigMap = Record<string, { set: boolean; masked: string }>;

interface ConfigContextValue {
  configMap: ConfigMap;
  loading: boolean;
  error: string | null;
  refreshConfig: () => Promise<void>;
  isAzureConnected: boolean;
  isJiraConnected: boolean;
}

const ConfigContext = createContext<ConfigContextValue>({
  configMap: {},
  loading: true,
  error: null,
  refreshConfig: async () => {},
  isAzureConnected: false,
  isJiraConnected: false,
});

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [configMap, setConfigMap] = useState<ConfigMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  const refreshConfig = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const res = await fetch("/api/config");
      if (!res.ok) throw new Error("Could not load configuration");
      const data = (await res.json()) as ConfigMap;
      setConfigMap(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load config");
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (isSignedIn) {
      refreshConfig();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, refreshConfig]);

  const isAzureConnected =
    !!configMap["AZURE_DEVOPS_ORG"]?.set && !!configMap["AZURE_DEVOPS_PAT"]?.set;

  const isJiraConnected =
    !!configMap["JIRA_DOMAIN"]?.set &&
    !!configMap["JIRA_EMAIL"]?.set &&
    !!configMap["JIRA_API_TOKEN"]?.set;

  return (
    <ConfigContext.Provider
      value={{ configMap, loading, error, refreshConfig, isAzureConnected, isJiraConnected }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}
