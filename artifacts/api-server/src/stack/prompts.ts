import type { StackProfile } from "./detector.js";

type Task = {
  title: string;
  description?: string | null;
  acceptanceCriteria?: string | null;
};

const FRONTEND_TEMPLATES: Record<string, string> = {
  react:
    "Generate a React 18 functional component with TypeScript. Use hooks, no class components.",
  angular:
    "Generate an Angular 17 standalone component with TypeScript. Use signals and inject().",
  vue: "Generate a Vue 3 SFC with <script setup> and TypeScript composition API.",
  none: "Generate a frontend component appropriate for this stack.",
};

const BACKEND_TEMPLATES: Record<string, string> = {
  nodejs:
    "Generate a Node.js/Express route handler with TypeScript and async/await.",
  dotnet:
    "Generate a C# .NET 8 controller or minimal API endpoint following REST conventions.",
  "java-spring":
    "Generate a Java Spring Boot 3 REST controller or service class with appropriate annotations.",
  python:
    "Generate a Python FastAPI or Django REST endpoint with type hints.",
};

const DATABASE_TEMPLATES: Record<string, string> = {
  postgresql: "Use standard SQL / Prisma syntax.",
  sqlserver: "Use T-SQL syntax. Avoid PostgreSQL-specific functions.",
  oracle: "Use Oracle SQL / PL-SQL syntax. Use ROWNUM not LIMIT.",
  mysql: "Use MySQL 8 syntax.",
};

export function buildPrompt(
  task: Task,
  codeContext: string,
  stack: StackProfile,
): string {
  const frontendInstruction =
    FRONTEND_TEMPLATES[stack.frontend] ?? FRONTEND_TEMPLATES["none"];
  const backendInstruction =
    BACKEND_TEMPLATES[stack.backend] ?? BACKEND_TEMPLATES["nodejs"];
  const databaseInstruction =
    DATABASE_TEMPLATES[stack.database] ?? DATABASE_TEMPLATES["postgresql"];

  return `You are an expert software engineer specializing in ${stack.language}.

## Stack Instructions
${frontendInstruction}
${backendInstruction}
${databaseInstruction}

## Task
**Title:** ${task.title}
${task.description ? `**Description:** ${task.description}` : ""}
${task.acceptanceCriteria ? `**Acceptance Criteria:**\n${task.acceptanceCriteria}` : ""}

## Code Context
\`\`\`
${codeContext}
\`\`\`

## Stack Profile
\`\`\`json
${JSON.stringify(stack, null, 2)}
\`\`\`

## Output Format
Return a JSON object with this exact structure:
\`\`\`json
{
  "code": "<the generated code>",
  "explanation": "<brief explanation of what was generated and why>",
  "filePath": "<suggested file path for this code>"
}
\`\`\`

Respond ONLY with the JSON object, no additional text.`;
}
