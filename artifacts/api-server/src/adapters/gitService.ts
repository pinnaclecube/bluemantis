import { logger } from "../lib/logger";

type GitProvider = "github" | "azure-repos";

export async function fetchFilePaths(
  provider: GitProvider | string,
  url: string,
  defaultBranch: string,
): Promise<string[]> {
  if (provider === "github") {
    return fetchGitHubFilePaths(url, defaultBranch);
  }
  if (provider === "azure-repos") {
    return fetchAzureReposFilePaths(url, defaultBranch);
  }
  logger.warn({ provider }, "Unknown provider, returning empty file list");
  return [];
}

async function fetchGitHubFilePaths(repoUrl: string, branch: string): Promise<string[]> {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?(?:\/|$)/);
  if (!match) {
    logger.warn({ repoUrl }, "Could not parse GitHub repo URL");
    return [];
  }
  const [, owner, repo] = match;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(apiUrl, { headers });

  if (!response.ok) {
    logger.warn({ status: response.status, apiUrl }, "GitHub API request failed");
    return [];
  }

  const data = (await response.json()) as { tree: Array<{ path: string; type: string }> };
  return (data.tree ?? [])
    .filter((item) => item.type === "blob")
    .map((item) => item.path);
}

async function fetchAzureReposFilePaths(repoUrl: string, branch: string): Promise<string[]> {
  const pat = process.env.AZURE_REPOS_TOKEN;
  if (!pat) {
    logger.warn("AZURE_REPOS_TOKEN not set, cannot fetch Azure Repos file list");
    return [];
  }

  const match = repoUrl.match(/dev\.azure\.com\/([^/]+)\/([^/]+)\/_git\/([^/]+)/);
  if (!match) {
    logger.warn({ repoUrl }, "Could not parse Azure Repos URL");
    return [];
  }
  const [, org, project, repoName] = match;
  const apiUrl = `https://dev.azure.com/${org}/${project}/_apis/git/repositories/${repoName}/items?scopePath=/&recursionLevel=Full&versionDescriptor.version=${branch}&api-version=7.1`;

  const credentials = Buffer.from(`:${pat}`).toString("base64");
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    logger.warn({ status: response.status, apiUrl }, "Azure Repos API request failed");
    return [];
  }

  const data = (await response.json()) as { value: Array<{ path: string; isFolder: boolean }> };
  return (data.value ?? [])
    .filter((item) => !item.isFolder)
    .map((item) => item.path.replace(/^\//, ""));
}
