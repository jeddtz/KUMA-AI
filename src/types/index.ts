export type PlanPartId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface ImplementationPart {
  id: PlanPartId;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'ready' | 'locked';
  deliverables: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  skillTriggered?: string;
  isStreaming?: boolean;
}

export interface AISkill {
  id: string;
  name: string;
  description: string;
  trigger: string;
  parametersSchema?: string;
  isActive: boolean;
}

export interface ScheduledTask {
  id: string;
  title: string;
  cronExpression: string;
  action: string;
  skillTrigger?: string;
  status: 'scheduled' | 'running' | 'completed' | 'paused' | 'failed';
  nextRunAt: string;
  lastRunAt?: string;
  logs?: string[];
  type?: 'cron' | 'one-time';
  payload?: Record<string, any>;
}

export interface ConnectorStatus {
  service: 'google_workspace' | 'notion' | 'google_sheets' | 'openrouter';
  name: string;
  iconName: string;
  isConnected: boolean;
  accountEmail?: string;
  lastSyncedAt?: string;
}

export interface ContentPlanItem {
  id: string;
  title: string;
  date: string;
  contentType: 'carousel' | 'reel' | 'single_post' | 'story';
  caption: string;
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published';
  notionPageUrl?: string;
}

export interface SystemHealth {
  status: string;
  app: string;
  version: string;
  uptime: number;
  port: number;
  environment: string;
  timestamp: string;
  activePart: {
    number: number;
    title: string;
    status: string;
    readyForPart2: boolean;
  };
  integrations: {
    gemini: boolean;
    openRouter: boolean;
    redis: boolean;
    notion: boolean;
  };
}
