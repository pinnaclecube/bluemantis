export interface CodeSuggestion {
  agent: 'claude' | 'openai' | 'copilot' | 'antigravity';
  code: string;
  explanation: string;
  filePath: string;
  language: string;
  score?: number;
  recommendation?: string;
}
