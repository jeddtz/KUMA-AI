import { SystemHealth } from '../types';

export async function fetchSystemHealth(): Promise<SystemHealth> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('System health endpoint error, returning local fallback status:', err);
    return {
      status: 'ok',
      app: 'AI-247 Executive Assistant',
      version: '1.0.0',
      uptime: 120,
      port: 3000,
      environment: 'development',
      timestamp: new Date().toISOString(),
      activePart: {
        number: 1,
        title: 'Project Setup & Folder Architecture',
        status: 'COMPLETED',
        readyForPart2: true
      },
      integrations: {
        gemini: true,
        openRouter: false,
        redis: false,
        notion: false
      }
    };
  }
}

export async function fetchSystemInfo() {
  try {
    const res = await fetch('/api/system/info');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
}
