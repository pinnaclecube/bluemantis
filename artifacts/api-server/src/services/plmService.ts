import type { DevCopilotTask } from "../../../../shared/types/task";
import { AzureDevOpsAdapter } from "../adapters/azureDevOpsAdapter";
import { JiraAdapter } from "../adapters/jiraAdapter";
import { logger } from "../lib/logger";

export class PLMService {
  private readonly azureAdapter: AzureDevOpsAdapter;
  private readonly jiraAdapter: JiraAdapter;

  constructor() {
    this.azureAdapter = new AzureDevOpsAdapter();
    this.jiraAdapter = new JiraAdapter();
  }

  async fetchAllTasks(): Promise<DevCopilotTask[]> {
    const results = await Promise.allSettled([
      this.azureAdapter.fetchIncompleteTasks(),
      this.jiraAdapter.fetchIncompleteTasks(),
    ]);

    const tasks: DevCopilotTask[] = [];

    const [azureResult, jiraResult] = results;

    if (azureResult.status === "fulfilled") {
      logger.info({ count: azureResult.value.length }, "AzureDevOps tasks fetched");
      tasks.push(...azureResult.value);
    } else {
      logger.warn({ err: azureResult.reason }, "AzureDevOps adapter failed — skipping");
    }

    if (jiraResult.status === "fulfilled") {
      logger.info({ count: jiraResult.value.length }, "Jira tasks fetched");
      tasks.push(...jiraResult.value);
    } else {
      logger.warn({ err: jiraResult.reason }, "Jira adapter failed — skipping");
    }

    return deduplicateTasks(tasks);
  }

  async closeTask(source: "azure-devops" | "jira", taskId: string, commitHash: string): Promise<void> {
    if (source === "azure-devops") {
      await this.azureAdapter.closeTask(taskId, commitHash);
    } else {
      await this.jiraAdapter.closeTask(taskId, commitHash);
    }
  }
}

function deduplicateTasks(tasks: DevCopilotTask[]): DevCopilotTask[] {
  const seen = new Set<string>();
  return tasks.filter((t) => {
    const key = `${t.source}:${t.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const plmService = new PLMService();
