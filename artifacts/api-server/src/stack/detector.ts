export type StackProfile = {
  frontend: string;
  backend: string;
  database: string;
  language: string;
  testFramework: string;
  packageManager: string;
};

export async function detectStack(filePaths: string[]): Promise<StackProfile> {
  const has = (pattern: string) =>
    filePaths.some((f) => f.toLowerCase().includes(pattern));

  return {
    frontend:
      has("angular.json") ? "angular"
      : has("vue.config") ? "vue"
      : has("package.json") ? "react"
      : "none",

    backend:
      has(".csproj") ? "dotnet"
      : has("pom.xml") ? "java-spring"
      : has("build.gradle") ? "java-spring"
      : has("requirements.txt") ? "python"
      : "nodejs",

    database:
      has("oracle") || has("tns") ? "oracle"
      : has("sqlserver") || has("mssql") ? "sqlserver"
      : has("mysql") ? "mysql"
      : "postgresql",

    language:
      has(".csproj") ? "csharp"
      : has("pom.xml") || has("build.gradle") ? "java"
      : has("requirements.txt") ? "python"
      : has("tsconfig.json") ? "typescript"
      : "javascript",

    testFramework:
      has(".spec.ts") ? "jasmine"
      : has(".test.ts") || has("jest.config") ? "jest"
      : has("xunit") ? "xunit"
      : has("junit") ? "junit"
      : has("pytest") ? "pytest"
      : "none",

    packageManager:
      has(".csproj") ? "nuget"
      : has("pom.xml") ? "maven"
      : has("build.gradle") ? "gradle"
      : has("requirements.txt") ? "pip"
      : has("yarn.lock") ? "yarn"
      : "npm",
  };
}
