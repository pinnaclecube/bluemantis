/**
 * Manages integration credentials stored in the `integration_configs` DB table.
 * On startup, all stored keys are hydrated into process.env so every existing
 * adapter continues to work without modification.
 */
import { eq } from "drizzle-orm";
import { db, integrationConfigsTable } from "@workspace/db";
import { logger } from "../lib/logger";

export const CONFIG_KEYS = [
  "ANTHROPIC_API_KEY",
  "OPENAI_API_KEY",
  "GITHUB_TOKEN",
  "AZURE_REPOS_ORG",
  "AZURE_REPOS_TOKEN",
  "AZURE_DEVOPS_ORG",
  "AZURE_DEVOPS_PROJECT",
  "AZURE_DEVOPS_PAT",
  "JIRA_DOMAIN",
  "JIRA_EMAIL",
  "JIRA_API_TOKEN",
] as const;

export type ConfigKey = (typeof CONFIG_KEYS)[number];

/** Load all integration configs from DB into process.env */
export async function loadConfigsFromDb(): Promise<void> {
  try {
    const rows = await db.select().from(integrationConfigsTable);
    for (const row of rows) {
      if (CONFIG_KEYS.includes(row.key as ConfigKey)) {
        process.env[row.key] = row.value;
      }
    }
    logger.info({ count: rows.length }, "Integration configs loaded from DB into process.env");
  } catch (err) {
    logger.warn({ err }, "Could not load integration configs from DB — using env vars only");
  }
}

/** Get all config keys with masked values (for the settings UI) */
export async function getAllConfigs(): Promise<Record<string, { set: boolean; masked: string }>> {
  const rows = await db.select().from(integrationConfigsTable);
  const dbMap = new Map(rows.map((r) => [r.key, r.value]));

  const result: Record<string, { set: boolean; masked: string }> = {};
  for (const key of CONFIG_KEYS) {
    const dbVal = dbMap.get(key);
    const envVal = process.env[key];
    const value = dbVal ?? envVal ?? "";
    result[key] = {
      set: value.length > 0,
      masked: value.length > 0 ? maskSecret(value) : "",
    };
  }
  return result;
}

/** Save a batch of key→value pairs to DB and process.env */
export async function saveConfigs(entries: Partial<Record<ConfigKey, string>>): Promise<void> {
  for (const [key, value] of Object.entries(entries) as [ConfigKey, string][]) {
    if (!value || value.trim() === "") continue;
    const trimmed = value.trim();
    await db
      .insert(integrationConfigsTable)
      .values({ key, value: trimmed })
      .onConflictDoUpdate({ target: integrationConfigsTable.key, set: { value: trimmed } });
    process.env[key] = trimmed;
  }
}

/** Delete a config key from DB and unset from process.env */
export async function deleteConfig(key: ConfigKey): Promise<void> {
  await db.delete(integrationConfigsTable).where(eq(integrationConfigsTable.key, key));
  delete process.env[key];
}

function maskSecret(value: string): string {
  if (value.length <= 8) return "••••••••";
  return value.slice(0, 4) + "••••••••" + value.slice(-4);
}
