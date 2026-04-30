import type { StackProfile } from "../../../../shared/types/stack";

export function buildCodeGenPrompt(stack: Partial<StackProfile>, taskTitle: string, description: string): string {
  const lang = stack.language ?? "typescript";
  const framework = stack.backend ?? "nodejs";
  const testFw = stack.testFramework ?? "none";

  return `You are an expert ${lang} developer working with ${framework}.

Task: ${taskTitle}
${description ? `Description: ${description}` : ""}

Generate production-quality ${lang} code that:
- Follows ${framework} best practices
- Includes proper error handling
- ${testFw !== "none" ? `Includes ${testFw} unit tests` : "Is well-commented"}
- Is type-safe and idiomatic

Provide only the implementation code without explanation.`;
}

export function buildPRDescriptionPrompt(stack: Partial<StackProfile>, taskTitle: string, acceptanceCriteria?: string): string {
  return `Generate a professional pull request description for:
Task: ${taskTitle}
Stack: ${stack.frontend ?? "none"} frontend, ${stack.backend ?? "nodejs"} backend, ${stack.language ?? "typescript"}
${acceptanceCriteria ? `Acceptance Criteria:\n${acceptanceCriteria}` : ""}

Include: Summary, Changes Made, Testing Notes, and Checklist.`;
}
