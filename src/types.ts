export type LayoutMode = 'split' | 'chat-only' | 'code-only' | 'preview-only';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thought?: string;
  artifact?: {
    id: string;
    title: string;
    actions: {
      id: string;
      type: 'file' | 'shell' | 'start';
      filePath?: string;
      content: string;
      status: 'pending' | 'running' | 'completed' | 'error';
    }[];
  };
}

export interface ModelOption {
  id: string;
  name: string;
  provider: 'gemini' | 'ollama' | 'openrouter' | 'anthropic';
  recommended?: boolean;
}

export interface ProjectSnapshot {
  id: string;
  title: string;
  timestamp: string;
  files: Record<string, string>;
}

export interface TerminalOutputLine {
  id: string;
  type: 'info' | 'success' | 'warn' | 'error' | 'command';
  text: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  email: string;
  teamName: string;
  role: string;
  goal: string;
  agreedToTerms: boolean;
  apiKeyProvider: string;
  apiKey: string;
  ollamaEndpoint?: string;
  recommendedModel: string;
  selectedModel: string;
  githubToken?: string;
  githubRepo?: string;
  createdAt: string;
}

export interface GitHubExportOptions {
  repoName: string;
  description: string;
  isPrivate: boolean;
  includeBadge: boolean;
  token: string;
}
export interface SupabaseConfig {
  projectUrl: string;
  anonKey: string;
  serviceRoleKey?: string;
  databaseUrl?: string;
  isConnected: boolean;
  projectName?: string;
  lastTestedAt?: string;
  tables?: string[];
}

export interface ApiErrorInfo {
  provider?: string;
  model?: string;
  statusCode?: number;
  message: string;
  timestamp: string;
  canFallback: boolean;
}
