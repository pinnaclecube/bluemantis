import { Octokit } from "@octokit/rest";
import { eq } from "drizzle-orm";
import { db, repositoriesTable } from "@workspace/db";
import type { Repository } from "@workspace/db";
import { detectStack, type StackProfile } from "../stack/detector.js";
import { logger } from "../lib/logger.js";

// ---------------------------------------------------------------------------
// Stack → file extension mapping
// ---------------------------------------------------------------------------

const STACK_EXTENSIONS: Record<string, string[]> = {
  react: [".ts", ".tsx", ".js", ".jsx", ".html", ".scss", ".css"],
  angular: [".ts", ".tsx", ".html", ".scss"],
  vue: [".ts", ".js", ".vue", ".html", ".scss"],
  dotnet: [".cs", ".csproj", ".razor", ".cshtml"],
  "java-spring": [".java", ".xml", ".properties", ".yml", ".yaml"],
  python: [".py", ".toml", ".cfg", ".ini"],
  nodejs: [".ts", ".js", ".mts", ".mjs", ".json"],
};

function stackExtensions(stack: StackProfile): string[] {
  const exts = new Set<string>();
  const buckets = [stack.frontend, stack.backend, stack.language];
  for (const key of buckets) {
    const mapped = STACK_EXTENSIONS[key];
    if (mapped) mapped.forEach((e) => exts.add(e));
  }
  if (exts.size === 0) [".ts", ".js", ".py", ".java", ".cs"].forEach((e) => exts.add(e));
  return [...exts];
}

function matchesKeywords(filePath: string, keywords: string[]): boolean {
  const lower = filePath.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function hasStackExtension(filePath: string, exts: string[]): boolean {
  return exts.some((ext) => filePath.toLowerCase().endsWith(ext));
}

// ---------------------------------------------------------------------------
// Provider-specific git interfaces
// ---------------------------------------------------------------------------

interface GitProviderClient {
  fetchFilePaths(): Promise<string[]>;
  fetchFileContent(path: string): Promise<string>;
  createBranch(branchName: string, fromRef: string): Promise<void>;
  getDefaultBranchSha(): Promise<string>;
  commitChanges(params: CommitParams): Promise<string>;
  createPullRequest(params: PullRequestParams): Promise<string>;
}

export interface CommitParams {
  branchName: string;
  message: string;
  files: Array<{ path: string; content: string }>;
}

export interface PullRequestParams {
  title: string;
  body: string;
  head: string;
  base: string;
}

// ---------------------------------------------------------------------------
// GitHub provider (via @octokit/rest)
// ---------------------------------------------------------------------------

export interface GitCreds {
  githubToken?: string;
  azureReposToken?: string;
}

class GitHubClient implements GitProviderClient {
  private readonly octokit: Octokit;
  private readonly owner: string;
  private readonly repo: string;
  private readonly defaultBranch: string;

  constructor(repoUrl: string, defaultBranch: string, creds?: GitCreds) {
    this.octokit = new Octokit({ auth: creds?.githubToken });
    this.defaultBranch = defaultBranch;

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/);
    if (!match) throw new Error(`Cannot parse GitHub URL: ${repoUrl}`);
    this.owner = match[1];
    this.repo = match[2];
  }

  async fetchFilePaths(): Promise<string[]> {
    const { data } = await this.octokit.git.getTree({
      owner: this.owner,
      repo: this.repo,
      tree_sha: this.defaultBranch,
      recursive: "1",
    });
    return (data.tree ?? [])
      .filter((item) => item.type === "blob" && item.path)
      .map((item) => item.path as string);
  }

  async fetchFileContent(path: string): Promise<string> {
    const { data } = await this.octokit.repos.getContent({
      owner: this.owner,
      repo: this.repo,
      path,
      ref: this.defaultBranch,
    });

    if (Array.isArray(data) || data.type !== "file") return "";
    const content = (data as { content?: string; encoding?: string }).content ?? "";
    const encoding = (data as { encoding?: string }).encoding ?? "base64";
    if (encoding === "base64") {
      return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf8");
    }
    return content;
  }

  async getDefaultBranchSha(): Promise<string> {
    const { data } = await this.octokit.git.getRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${this.defaultBranch}`,
    });
    return data.object.sha;
  }

  async createBranch(branchName: string, fromRef: string): Promise<void> {
    await this.octokit.git.createRef({
      owner: this.owner,
      repo: this.repo,
      ref: `refs/heads/${branchName}`,
      sha: fromRef,
    });
  }

  async commitChanges(params: CommitParams): Promise<string> {
    const baseRef = await this.getDefaultBranchSha();

    const blobs = await Promise.all(
      params.files.map((f) =>
        this.octokit.git.createBlob({
          owner: this.owner,
          repo: this.repo,
          content: f.content,
          encoding: "utf-8",
        }).then((r) => ({ path: f.path, sha: r.data.sha })),
      ),
    );

    const { data: baseCommit } = await this.octokit.git.getCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: baseRef,
    });

    const { data: tree } = await this.octokit.git.createTree({
      owner: this.owner,
      repo: this.repo,
      base_tree: baseCommit.tree.sha,
      tree: blobs.map((b) => ({
        path: b.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: b.sha,
      })),
    });

    const { data: commit } = await this.octokit.git.createCommit({
      owner: this.owner,
      repo: this.repo,
      message: params.message,
      tree: tree.sha,
      parents: [baseRef],
    });

    await this.octokit.git.updateRef({
      owner: this.owner,
      repo: this.repo,
      ref: `heads/${params.branchName}`,
      sha: commit.sha,
    });

    return commit.sha;
  }

  async createPullRequest(params: PullRequestParams): Promise<string> {
    const { data } = await this.octokit.pulls.create({
      owner: this.owner,
      repo: this.repo,
      title: params.title,
      body: params.body,
      head: params.head,
      base: params.base,
    });
    return data.html_url;
  }
}

// ---------------------------------------------------------------------------
// Azure Repos provider (raw REST API)
// ---------------------------------------------------------------------------

class AzureReposClient implements GitProviderClient {
  private readonly org: string;
  private readonly project: string;
  private readonly repoName: string;
  private readonly defaultBranch: string;
  private readonly authHeader: string;

  constructor(repoUrl: string, defaultBranch: string, creds?: GitCreds) {
    this.defaultBranch = defaultBranch;

    const match = repoUrl.match(/dev\.azure\.com\/([^/]+)\/([^/]+)\/_git\/([^/]+)/);
    if (!match) throw new Error(`Cannot parse Azure Repos URL: ${repoUrl}`);
    [, this.org, this.project, this.repoName] = match;

    const pat = creds?.azureReposToken ?? "";
    this.authHeader = `Basic ${Buffer.from(`:${pat}`).toString("base64")}`;
  }

  private get baseUrl(): string {
    return `https://dev.azure.com/${this.org}/${this.project}/_apis/git/repositories/${this.repoName}`;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: this.authHeader,
        ...options.headers,
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Azure Repos API ${res.status} at ${path}: ${body}`);
    }
    return res.json() as Promise<T>;
  }

  async fetchFilePaths(): Promise<string[]> {
    const data = await this.request<{ value: Array<{ path: string; isFolder: boolean }> }>(
      `/items?scopePath=/&recursionLevel=Full&versionDescriptor.version=${this.defaultBranch}&api-version=7.1`,
    );
    return (data.value ?? [])
      .filter((item) => !item.isFolder)
      .map((item) => item.path.replace(/^\//, ""));
  }

  async fetchFileContent(path: string): Promise<string> {
    const url = `${this.baseUrl}/items?path=/${path}&versionDescriptor.version=${this.defaultBranch}&api-version=7.1&$format=text`;
    const res = await fetch(url, {
      headers: { Authorization: this.authHeader },
    });
    if (!res.ok) return "";
    return res.text();
  }

  async getDefaultBranchSha(): Promise<string> {
    const data = await this.request<{ value: Array<{ objectId: string }> }>(
      `/refs?filter=heads/${this.defaultBranch}&api-version=7.1`,
    );
    const ref = data.value?.[0];
    if (!ref) throw new Error(`Azure Repos: ref heads/${this.defaultBranch} not found`);
    return ref.objectId;
  }

  async createBranch(branchName: string, fromRef: string): Promise<void> {
    const OLD_ZERO = "0000000000000000000000000000000000000000";
    await this.request(`/refs?api-version=7.1`, {
      method: "POST",
      body: JSON.stringify([
        {
          name: `refs/heads/${branchName}`,
          oldObjectId: OLD_ZERO,
          newObjectId: fromRef,
        },
      ]),
    });
  }

  async commitChanges(params: CommitParams): Promise<string> {
    const baseSha = await this.getDefaultBranchSha();

    const body = {
      refUpdates: [{ name: `refs/heads/${params.branchName}`, oldObjectId: baseSha }],
      commits: [
        {
          comment: params.message,
          changes: params.files.map((f) => ({
            changeType: "edit",
            item: { path: `/${f.path}` },
            newContent: { content: f.content, contentType: "rawtext" },
          })),
        },
      ],
    };

    const data = await this.request<{ commits: Array<{ commitId: string }> }>(
      `/pushes?api-version=7.1`,
      { method: "POST", body: JSON.stringify(body) },
    );

    return data.commits?.[0]?.commitId ?? "";
  }

  async createPullRequest(params: PullRequestParams): Promise<string> {
    const body = {
      title: params.title,
      description: params.body,
      sourceRefName: `refs/heads/${params.head}`,
      targetRefName: `refs/heads/${params.base}`,
    };

    const data = await this.request<{ pullRequestId: number }>(`/pullrequests?api-version=7.1`, {
      method: "POST",
      body: JSON.stringify(body),
    });

    return `https://dev.azure.com/${this.org}/${this.project}/_git/${this.repoName}/pullrequest/${data.pullRequestId}`;
  }
}

// ---------------------------------------------------------------------------
// GitService — public API
// ---------------------------------------------------------------------------

export class GitService {
  private readonly repo: Repository;
  private readonly client: GitProviderClient;

  private constructor(repo: Repository, client: GitProviderClient) {
    this.repo = repo;
    this.client = client;
  }

  static async forRepo(repoId: number, creds?: GitCreds): Promise<GitService> {
    const [repo] = await db
      .select()
      .from(repositoriesTable)
      .where(eq(repositoriesTable.id, repoId));

    if (!repo) throw new Error(`Repository ${repoId} not found`);

    const provider = (process.env.GIT_PROVIDER ?? repo.provider) as "github" | "azure-repos";
    const client =
      provider === "github"
        ? new GitHubClient(repo.url, repo.defaultBranch, creds)
        : new AzureReposClient(repo.url, repo.defaultBranch, creds);

    const service = new GitService(repo, client);

    const profile = repo.stackProfile as Record<string, string> | null;
    const hasProfile = profile && Object.keys(profile).length > 0 &&
      Object.values(profile).some((v) => v !== "none");

    if (!hasProfile) {
      logger.info({ repoId }, "No stack profile — running first-connection detection");
      await service.connect();
    }

    return service;
  }

  async connect(): Promise<StackProfile> {
    const filePaths = await this.client.fetchFilePaths();
    const stackProfile = await detectStack(filePaths);

    await db
      .update(repositoriesTable)
      .set({ stackProfile })
      .where(eq(repositoriesTable.id, this.repo.id));

    logger.info({ repoId: this.repo.id, stackProfile }, "Stack profile saved on first connection");
    return stackProfile;
  }

  async fetchFileContext(
    taskId: string,
    keywords: string[],
    stack: StackProfile,
  ): Promise<string> {
    const allPaths = await this.client.fetchFilePaths();
    const exts = stackExtensions(stack);

    const ranked = allPaths
      .filter((p) => hasStackExtension(p, exts))
      .map((p) => ({
        path: p,
        score: (matchesKeywords(p, keywords) ? 2 : 0) +
          (keywords.some((kw) => p.toLowerCase().includes(kw.toLowerCase())) ? 1 : 0),
      }))
      .filter((f) => f.score > 0 || allPaths.filter((p) => hasStackExtension(p, exts)).length < 20)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (ranked.length === 0) {
      logger.warn({ taskId, keywords }, "No matching files found for task context");
      return "";
    }

    const CHAR_LIMIT = 8000;
    let output = "";

    for (const { path } of ranked) {
      if (output.length >= CHAR_LIMIT) break;
      try {
        const content = await this.client.fetchFileContent(path);
        const header = `\n// === ${path} ===\n`;
        const chunk = header + content;
        const remaining = CHAR_LIMIT - output.length;
        output += chunk.slice(0, remaining);
      } catch (err) {
        logger.warn({ path, err }, "Failed to fetch file content — skipping");
      }
    }

    return output.trim();
  }

  async createBranch(taskId: string): Promise<void> {
    const branchName = `task/${taskId}`;
    const sha = await this.client.getDefaultBranchSha();
    await this.client.createBranch(branchName, sha);
    logger.info({ branchName, repoId: this.repo.id }, "Branch created");
  }

  async commitChanges(params: CommitParams): Promise<string> {
    const sha = await this.client.commitChanges(params);
    logger.info({ sha, branch: params.branchName, repoId: this.repo.id }, "Changes committed");
    return sha;
  }

  async createPullRequest(params: PullRequestParams): Promise<string> {
    const url = await this.client.createPullRequest(params);
    logger.info({ url, repoId: this.repo.id }, "Pull request created");
    return url;
  }

  get stackProfile(): StackProfile {
    return this.repo.stackProfile as StackProfile;
  }

  get defaultBranch(): string {
    return this.repo.defaultBranch;
  }
}
