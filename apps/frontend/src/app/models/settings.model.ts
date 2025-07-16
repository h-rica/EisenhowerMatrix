export interface AppSettings {
  theme: 'light' | 'dark';
  aiProvider: 'gemini' | 'openai' | 'anthropic' | 'deepseek' | 'openrouter';
  aiApiKey?: string;
  notifications: boolean;
  language: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  aiProvider: 'gemini',
  notifications: true,
  language: 'en',
};