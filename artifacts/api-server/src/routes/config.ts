import { Router, type IRouter } from "express";
import { z } from "zod/v4";
import {
  getAllConfigs,
  saveConfigs,
  deleteConfig,
  CONFIG_KEYS,
  type ConfigKey,
} from "../services/configService";
import { logger } from "../lib/logger";

const router: IRouter = Router();

// GET /api/config — return all keys with masked values + set status
router.get("/config", async (req, res): Promise<void> => {
  const configs = await getAllConfigs();
  res.json(configs);
});

// PUT /api/config — save one or more key→value pairs
const SaveConfigBody = z.object(
  Object.fromEntries(CONFIG_KEYS.map((k) => [k, z.string().optional()])) as Record<
    ConfigKey,
    z.ZodOptional<z.ZodString>
  >,
);

router.put("/config", async (req, res): Promise<void> => {
  const parsed = SaveConfigBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid config keys" });
    return;
  }
  await saveConfigs(parsed.data as Partial<Record<ConfigKey, string>>);
  req.log.info("Integration config updated");
  res.json({ ok: true });
});

// DELETE /api/config/:key — clear a single key
router.delete("/config/:key", async (req, res): Promise<void> => {
  const key = req.params.key as ConfigKey;
  if (!CONFIG_KEYS.includes(key)) {
    res.status(400).json({ error: "Unknown config key" });
    return;
  }
  await deleteConfig(key);
  res.json({ ok: true });
});

// GET /api/config/test/:integration — friendly error for browser navigation
router.get("/config/test/:integration", (_req, res): void => {
  res.status(405).json({ error: "Use POST to test a connection" });
});

// POST /api/config/test/:integration — live connection test
router.post("/config/test/:integration", async (req, res): Promise<void> => {
  const integration = req.params.integration;

  try {
    switch (integration) {
      case "anthropic": {
        const key = (req.body?.ANTHROPIC_API_KEY as string | undefined) ?? process.env.ANTHROPIC_API_KEY ?? "";
        if (!key) { res.status(400).json({ ok: false, message: "API key not set" }); return; }
        const r = await fetch("https://api.anthropic.com/v1/models", {
          headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
        });
        if (!r.ok) throw new Error(`Anthropic returned ${r.status}`);
        res.json({ ok: true, message: "Connected to Anthropic successfully" });
        break;
      }

      case "openai": {
        const key = (req.body?.OPENAI_API_KEY as string | undefined) ?? process.env.OPENAI_API_KEY ?? "";
        if (!key) { res.status(400).json({ ok: false, message: "API key not set" }); return; }
        const r = await fetch("https://api.openai.com/v1/models", {
          headers: { Authorization: `Bearer ${key}` },
        });
        if (!r.ok) throw new Error(`OpenAI returned ${r.status}`);
        res.json({ ok: true, message: "Connected to OpenAI successfully" });
        break;
      }

      case "github": {
        const token = (req.body?.GITHUB_TOKEN as string | undefined) ?? process.env.GITHUB_TOKEN ?? "";
        if (!token) { res.status(400).json({ ok: false, message: "Token not set" }); return; }
        const r = await fetch("https://api.github.com/user", {
          headers: { Authorization: `Bearer ${token}`, "User-Agent": "DevCopilot" },
        });
        if (!r.ok) throw new Error(`GitHub returned ${r.status}`);
        const data = (await r.json()) as { login?: string };
        res.json({ ok: true, message: `Connected as @${data.login}` });
        break;
      }

      case "jira": {
        const domain = (req.body?.JIRA_DOMAIN as string | undefined) ?? process.env.JIRA_DOMAIN ?? "";
        const email = (req.body?.JIRA_EMAIL as string | undefined) ?? process.env.JIRA_EMAIL ?? "";
        const token = (req.body?.JIRA_API_TOKEN as string | undefined) ?? process.env.JIRA_API_TOKEN ?? "";
        if (!domain || !email || !token) {
          res.status(400).json({ ok: false, message: "All three JIRA fields are required" });
          return;
        }
        const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
        const creds = Buffer.from(`${email}:${token}`).toString("base64");
        const r = await fetch(`https://${cleanDomain}/rest/api/3/myself`, {
          headers: { Authorization: `Basic ${creds}`, Accept: "application/json" },
        });
        if (!r.ok) throw new Error(`JIRA returned ${r.status} — check domain, email, and token`);
        const data = (await r.json()) as { displayName?: string; emailAddress?: string };
        res.json({ ok: true, message: `Connected as ${data.displayName ?? data.emailAddress}` });
        break;
      }

      case "azuredevops": {
        const org = (req.body?.AZURE_DEVOPS_ORG as string | undefined) ?? process.env.AZURE_DEVOPS_ORG ?? "";
        const project = (req.body?.AZURE_DEVOPS_PROJECT as string | undefined) ?? process.env.AZURE_DEVOPS_PROJECT ?? "";
        const pat = (req.body?.AZURE_DEVOPS_PAT as string | undefined) ?? process.env.AZURE_DEVOPS_PAT ?? "";
        if (!org || !pat) {
          res.status(400).json({ ok: false, message: "Organisation and PAT are required" });
          return;
        }
        const creds = Buffer.from(`:${pat}`).toString("base64");
        const url = project
          ? `https://dev.azure.com/${org}/${project}/_apis/wit/workitemtypes?api-version=7.1`
          : `https://dev.azure.com/${org}/_apis/projects?api-version=7.1`;
        const r = await fetch(url, {
          headers: { Authorization: `Basic ${creds}`, Accept: "application/json" },
        });
        if (!r.ok) throw new Error(`Azure DevOps returned ${r.status} — check org, project, and PAT`);
        res.json({ ok: true, message: `Connected to ${org}${project ? `/${project}` : ""}` });
        break;
      }

      case "azurerepos": {
        const token = (req.body?.AZURE_REPOS_TOKEN as string | undefined) ?? process.env.AZURE_REPOS_TOKEN ?? "";
        const org = ((req.body?.AZURE_REPOS_ORG as string | undefined) ?? process.env.AZURE_REPOS_ORG ?? "").trim();
        if (!token) {
          res.status(400).json({ ok: false, message: "Personal Access Token is required" });
          return;
        }
        if (!org) {
          res.status(400).json({ ok: false, message: "Organisation name is required to test — enter it in the field above" });
          return;
        }
        // Use the Git repositories endpoint — only requires Code (read) scope
        const creds = Buffer.from(`:${token}`).toString("base64");
        const r = await fetch(
          `https://dev.azure.com/${org}/_apis/git/repositories?api-version=7.1`,
          { headers: { Authorization: `Basic ${creds}`, Accept: "application/json" } },
        );
        if (r.status === 401) throw new Error("Invalid PAT or expired — ensure it has Code → Read & Write scope");
        if (r.status === 403) throw new Error("PAT is valid but lacks permission — ensure it has Code → Read scope for this organisation");
        if (r.status === 404) throw new Error(`Organisation "${org}" not found — check the spelling (it's case-sensitive)`);
        if (!r.ok) throw new Error(`Azure Repos returned ${r.status} — check your organisation name and PAT`);
        const data = (await r.json()) as { value?: { name: string }[] };
        const count = Array.isArray(data.value) ? data.value.length : 0;
        res.json({ ok: true, message: `Connected to ${org} — ${count} repositor${count === 1 ? "y" : "ies"} found` });
        break;
      }

      default:
        res.status(404).json({ ok: false, message: "Unknown integration" });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Connection failed";
    logger.warn({ integration, err }, "Integration test failed");
    res.status(400).json({ ok: false, message });
  }
});

export default router;
