import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { buildPrompt } from "../stack/prompts.js";
import { logger } from "../lib/logger.js";
import type { DevCopilotTask } from "../../../../shared/types/task.js";
import type { CodeSuggestion } from "../../../../shared/types/codeSuggestion.js";
import type { StackProfile } from "../stack/detector.js";

// ---------------------------------------------------------------------------
// Language detection
// ---------------------------------------------------------------------------

const EXT_TO_LANGUAGE: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  mts: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  py: "python",
  java: "java",
  cs: "csharp",
  go: "go",
  rs: "rust",
  rb: "ruby",
  php: "php",
  cpp: "cpp",
  c: "c",
  html: "html",
  css: "css",
  scss: "scss",
  json: "json",
  yaml: "yaml",
  yml: "yaml",
  xml: "xml",
  sql: "sql",
  sh: "bash",
  bash: "bash",
};

function detectLanguage(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_LANGUAGE[ext] ?? ext ?? "plaintext";
}

// ---------------------------------------------------------------------------
// JSON extraction — strips markdown code fences if present
// ---------------------------------------------------------------------------

function extractJson<T>(raw: string): T {
  const stripped = raw
    .replace(/^```(?:json)?\s*/m, "")
    .replace(/\s*```$/m, "")
    .trim();
  return JSON.parse(stripped) as T;
}

// ---------------------------------------------------------------------------
// Suggestion schema from models
// ---------------------------------------------------------------------------

interface ModelOutput {
  code: string;
  explanation: string;
  filePath: string;
}

// ---------------------------------------------------------------------------
// Credentials type
// ---------------------------------------------------------------------------

export interface AICreds {
  anthropicApiKey?: string;
  openaiApiKey?: string;
}

// ---------------------------------------------------------------------------
// Mock providers
// ---------------------------------------------------------------------------

function mockAntiGravity(stack: StackProfile): ModelOutput {
  const lang = stack.language === "typescript" ? "TypeScript" : stack.language;
  return {
    code: `// AntiGravity suggestion\n// Stack: ${stack.frontend}/${stack.backend}\nexport function antiGravitySuggestion(): void {\n  console.log('AntiGravity: ${lang} implementation');\n}`,
    explanation: `AntiGravity AI mock suggestion for ${lang} stack.`,
    filePath: `src/suggestions/antiGravity.${stack.language === "python" ? "py" : stack.language === "csharp" ? "cs" : stack.language === "java" ? "java" : "ts"}`,
  };
}

function mockCopilot(stack: StackProfile): ModelOutput {
  const lang = stack.language === "typescript" ? "TypeScript" : stack.language;
  return {
    code: `// GitHub Copilot suggestion\n// Stack: ${stack.frontend}/${stack.backend}\nexport function copilotSuggestion(): void {\n  console.log('Copilot: ${lang} implementation');\n}`,
    explanation: `GitHub Copilot mock suggestion for ${lang} stack.`,
    filePath: `src/suggestions/copilot.${stack.language === "python" ? "py" : stack.language === "csharp" ? "cs" : stack.language === "java" ? "java" : "ts"}`,
  };
}

// ---------------------------------------------------------------------------
// AIOrchestrator
// ---------------------------------------------------------------------------

export class AIOrchestrator {
  private readonly anthropicApiKey: string | undefined;
  private readonly openaiApiKey: string | undefined;

  constructor(creds?: AICreds) {
    this.anthropicApiKey = creds?.anthropicApiKey;
    this.openaiApiKey = creds?.openaiApiKey;
  }

  async generateSuggestions(
    task: DevCopilotTask,
    codeContext: string,
    stack: StackProfile,
  ): Promise<CodeSuggestion[]> {
    const prompt = buildPrompt(
      {
        title: task.title,
        description: task.description,
        acceptanceCriteria: task.acceptanceCriteria.join("\n"),
      },
      codeContext,
      stack,
    );

    const [claudeResult, openaiResult, antigravityResult, copilotResult] =
      await Promise.allSettled([
        this.callClaude(prompt),
        this.callOpenAI(prompt),
        Promise.resolve(mockAntiGravity(stack)),
        Promise.resolve(mockCopilot(stack)),
      ]);

    const suggestions: CodeSuggestion[] = [];

    const mapped: Array<[typeof claudeResult, CodeSuggestion["agent"]]> = [
      [claudeResult, "claude"],
      [openaiResult, "openai"],
      [antigravityResult, "antigravity"],
      [copilotResult, "copilot"],
    ];

    for (const [result, agent] of mapped) {
      if (result.status === "fulfilled") {
        const output = result.value;
        suggestions.push({
          agent,
          code: output.code,
          explanation: output.explanation,
          filePath: output.filePath,
          language: detectLanguage(output.filePath),
        });
      } else {
        logger.warn({ agent, err: result.reason }, `${agent} suggestion failed`);
      }
    }

    return suggestions;
  }

  private async callClaude(prompt: string): Promise<ModelOutput> {
    const client = new Anthropic({ apiKey: this.anthropicApiKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const block = message.content[0];
    if (block.type !== "text") throw new Error("Claude returned non-text block");
    return extractJson<ModelOutput>(block.text);
  }

  private async callOpenAI(prompt: string): Promise<ModelOutput> {
    const client = new OpenAI({ apiKey: this.openaiApiKey });
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'You are an expert software engineer. Always respond with valid JSON matching the schema: { "code": string, "explanation": string, "filePath": string }',
        },
        { role: "user", content: prompt },
      ],
    });

    const text = response.choices[0]?.message?.content ?? "{}";
    return extractJson<ModelOutput>(text);
  }
}

// ---------------------------------------------------------------------------
// SynthesisEngine
// ---------------------------------------------------------------------------

interface ScoredEntry {
  score: number;
  recommendation: string;
}

export class SynthesisEngine {
  private readonly anthropicApiKey: string | undefined;

  constructor(creds?: Pick<AICreds, "anthropicApiKey">) {
    this.anthropicApiKey = creds?.anthropicApiKey;
  }

  async synthesize(
    suggestions: CodeSuggestion[],
    stack: StackProfile,
  ): Promise<CodeSuggestion[]> {
    if (suggestions.length === 0) return [];

    const client = new Anthropic({ apiKey: this.anthropicApiKey });

    const synthesisPrompt = buildSynthesisPrompt(suggestions, stack);

    let scored: ScoredEntry[];
    try {
      const message = await client.messages.create({
        model: "claude-sonnet-4-5",
        max_tokens: 8192,
        messages: [{ role: "user", content: synthesisPrompt }],
      });

      const block = message.content[0];
      if (block.type !== "text") throw new Error("Claude returned non-text block");
      scored = extractJson<ScoredEntry[]>(block.text);
    } catch (err) {
      logger.warn({ err }, "SynthesisEngine: Claude scoring failed — using default scores");
      scored = suggestions.map((_, i) => ({
        score: suggestions.length - i,
        recommendation: "",
      }));
    }

    const result: CodeSuggestion[] = suggestions.map((s, i) => ({
      ...s,
      score: scored[i]?.score ?? 0,
      recommendation: scored[i]?.recommendation ?? "",
    }));

    result.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    if (result.length > 0) {
      result[0].recommendation = "Recommended";
    }

    return result;
  }
}

// ---------------------------------------------------------------------------
// Synthesis prompt builder
// ---------------------------------------------------------------------------

function buildSynthesisPrompt(suggestions: CodeSuggestion[], stack: StackProfile): string {
  const suggestionDocs = suggestions
    .map(
      (s, i) => `
### Suggestion ${i + 1} (${s.agent})
**File:** ${s.filePath}
**Language:** ${s.language}
**Explanation:** ${s.explanation}
\`\`\`${s.language}
${s.code}
\`\`\``,
    )
    .join("\n");

  return `You are a senior code reviewer evaluating AI-generated code suggestions.

## Stack Profile
\`\`\`json
${JSON.stringify(stack, null, 2)}
\`\`\`

## Suggestions to Evaluate
${suggestionDocs}

## Scoring Criteria (each out of 10)
Score each suggestion on the following dimensions, then produce an overall score out of 10:

1. **Correctness** — Does the code correctly solve the likely task? No obvious bugs?
2. **Readability** — Is it clean, well-named, and easy to follow?
3. **Minimal Diff** — Does it avoid unnecessary changes? Is the change targeted?
4. **Convention Adherence** — Does it follow the conventions of the detected stack (${stack.frontend}/${stack.backend}/${stack.language})?

## Output Format
Return a JSON array with exactly ${suggestions.length} entries — one per suggestion in the same order:

\`\`\`json
[
  { "score": <number 0-10>, "recommendation": "<brief one-line review>" },
  ...
]
\`\`\`

Respond ONLY with the JSON array. No additional text.`;
}

