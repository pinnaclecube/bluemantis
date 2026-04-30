export type StackProfile = {
  frontend: 'react' | 'angular' | 'vue' | 'none';
  backend: 'nodejs' | 'dotnet' | 'java-spring' | 'python';
  database: 'postgresql' | 'sqlserver' | 'oracle' | 'mysql';
  language: 'typescript' | 'javascript' | 'csharp' | 'java' | 'python';
  testFramework: 'jest' | 'jasmine' | 'xunit' | 'junit' | 'pytest' | 'none';
  packageManager: 'npm' | 'yarn' | 'maven' | 'gradle' | 'nuget' | 'pip';
};
