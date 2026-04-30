import type { StackProfile } from "../../../../shared/types/stack";

export type DetectorInput = {
  files: string[];
  packageJson?: Record<string, unknown>;
};

export function detectStack(input: DetectorInput): Partial<StackProfile> {
  const { files, packageJson } = input;
  const deps = {
    ...((packageJson?.dependencies as Record<string, string>) ?? {}),
    ...((packageJson?.devDependencies as Record<string, string>) ?? {}),
  };

  const frontend =
    "react" in deps
      ? "react"
      : "@angular/core" in deps
        ? "angular"
        : "vue" in deps
          ? "vue"
          : "none";

  const backend =
    "express" in deps || "fastify" in deps
      ? "nodejs"
      : "spring" in deps
        ? "java-spring"
        : files.some((f) => f.endsWith(".csproj"))
          ? "dotnet"
          : files.some((f) => f.endsWith(".py"))
            ? "python"
            : "nodejs";

  const language =
    files.some((f) => f.endsWith(".ts") || f.endsWith(".tsx"))
      ? "typescript"
      : files.some((f) => f.endsWith(".cs"))
        ? "csharp"
        : files.some((f) => f.endsWith(".java"))
          ? "java"
          : files.some((f) => f.endsWith(".py"))
            ? "python"
            : "javascript";

  const testFramework =
    "jest" in deps
      ? "jest"
      : "jasmine" in deps
        ? "jasmine"
        : "pytest" in deps
          ? "pytest"
          : "none";

  const packageManager = files.includes("pnpm-lock.yaml")
    ? "npm"
    : files.includes("yarn.lock")
      ? "yarn"
      : files.includes("pom.xml")
        ? "maven"
        : files.includes("build.gradle")
          ? "gradle"
          : "npm";

  return { frontend: frontend as StackProfile["frontend"], backend: backend as StackProfile["backend"], language: language as StackProfile["language"], testFramework: testFramework as StackProfile["testFramework"], packageManager: packageManager as StackProfile["packageManager"] };
}
