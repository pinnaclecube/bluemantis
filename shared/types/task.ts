export type TaskSource = 'jira' | 'azure-devops' | 'manual';
export type TaskType = 'feature' | 'bug' | 'chore' | 'story';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'open' | 'in-progress' | 'review' | 'done' | 'blocked';

export type Task = {
  id: number;
  externalId: string | null;
  source: TaskSource;
  type: TaskType;
  title: string;
  description: string | null;
  acceptanceCriteria: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  linkedCommit: string | null;
  repositoryId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface DevCopilotTask {
  id: string;
  source: 'azure-devops' | 'jira';
  type: 'epic' | 'feature' | 'story' | 'task' | 'bug';
  title: string;
  description: string;
  acceptanceCriteria: string[];
  priority: 1 | 2 | 3 | 4;
  parentId?: string;
  rawSource: object;
}

export interface PLMAdapter {
  fetchIncompleteTasks(): Promise<DevCopilotTask[]>;
  closeTask(taskId: string, commitHash: string): Promise<void>;
}
