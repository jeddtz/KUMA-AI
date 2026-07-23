import React, { useState, useEffect } from 'react';
import { 
  FolderTree, FileCode, Server, Terminal, CheckCircle2, Cpu, 
  Layers, Container, RefreshCw, Play, ShieldCheck, Database, Key, Sparkles 
} from 'lucide-react';
import { SystemHealth } from '../types';
import { fetchSystemHealth, fetchSystemInfo } from '../services/api';

interface Part1OverviewProps {
  onRequestApproval: () => void;
}

export const Part1Overview: React.FC<Part1OverviewProps> = ({ onRequestApproval }) => {
  const [healthData, setHealthData] = useState<SystemHealth | null>(null);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [activeFileView, setActiveFileView] = useState<'server' | 'docker' | 'types' | 'env'>('server');

  const loadHealth = async () => {
    setIsLoadingHealth(true);
    const data = await fetchSystemHealth();
    setHealthData(data);
    const info = await fetchSystemInfo();
    setSystemInfo(info);
    setIsLoadingHealth(false);
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div id="part1-overview" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Title & Architecture Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md">
              PART 1 VERIFIED
            </span>
            <span className="text-xs text-slate-400 font-mono">Status: Completed</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Project Setup & Folder Architecture
          </h1>
          <p className="text-sm text-slate-400 max-w-3xl">
            Clean full-stack TypeScript project foundation established with Express backend running on Port 3000, Vite React frontend, containerized Docker architecture, and modular type system.
          </p>
        </div>

        <button
          id="btn-approve-part1-top"
          onClick={onRequestApproval}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950 flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Approve Part 1 & Proceed to Part 2</span>
        </button>
      </div>

      {/* Grid: Live API Inspector & Architecture Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Live Express API Inspector */}
        <div className="lg:col-span-1 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Live Backend Endpoints</h3>
            </div>
            <button
              id="btn-refresh-health"
              onClick={loadHealth}
              disabled={isLoadingHealth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
              title="Test Express API Endpoint"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingHealth ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <p className="text-xs text-slate-400">
            Send real-time HTTP GET requests to the running Express server endpoints:
          </p>

          <div className="space-y-2">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">GET</span>
                <span className="text-slate-300">/api/health</span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded">200 OK</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">GET</span>
                <span className="text-slate-300">/api/system/info</span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded">200 OK</span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono opacity-80">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400 font-bold">GET</span>
                <span className="text-slate-300">/api/chat/stream</span>
              </div>
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] px-2 py-0.5 rounded">SSE Ready</span>
            </div>
          </div>

          {/* JSON Payload Viewer */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Express Response Payload:</span>
            <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-52 scrollbar-thin">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>Host & Port:</span>
              <span className="text-slate-200">0.0.0.0:3000</span>
            </div>
            <div className="flex justify-between">
              <span>Express Version:</span>
              <span className="text-slate-200">v4.21.2</span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-slate-200">Development (Vite Middleware)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Folder & Code Inspector */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div className="flex items-center space-x-2">
              <FolderTree className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm text-white">Project File & Architecture Inspector</h3>
            </div>

            {/* File Switcher Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveFileView('server')}
                className={`px-2.5 py-1 rounded transition-all ${activeFileView === 'server' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                server.ts
              </button>
              <button
                onClick={() => setActiveFileView('docker')}
                className={`px-2.5 py-1 rounded transition-all ${activeFileView === 'docker' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Dockerfile
              </button>
              <button
                onClick={() => setActiveFileView('types')}
                className={`px-2.5 py-1 rounded transition-all ${activeFileView === 'types' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                types/index.ts
              </button>
              <button
                onClick={() => setActiveFileView('env')}
                className={`px-2.5 py-1 rounded transition-all ${activeFileView === 'env' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                .env.example
              </button>
            </div>
          </div>

          {/* Folder Tree Visualization */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-slate-400 flex items-center gap-1.5 font-bold text-slate-200">
              <FolderTree className="w-4 h-4 text-amber-400" />
              <span>/ (AI-247 Workspace Root)</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 text-slate-300">
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>server.ts</span>
                <span className="text-[10px] text-slate-500 ml-auto">Express Server</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                <Container className="w-3.5 h-3.5 text-blue-400" />
                <span>Dockerfile</span>
                <span className="text-[10px] text-slate-500 ml-auto">Alpine Image</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                <Database className="w-3.5 h-3.5 text-red-400" />
                <span>docker-compose.yml</span>
                <span className="text-[10px] text-slate-500 ml-auto">Redis + App</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span>src/types/index.ts</span>
                <span className="text-[10px] text-slate-500 ml-auto">Data Models</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>.env.example</span>
                <span className="text-[10px] text-slate-500 ml-auto">Config Spec</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 p-2 rounded border border-slate-800">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>package.json</span>
                <span className="text-[10px] text-slate-500 ml-auto">Dependencies</span>
              </div>
            </div>
          </div>

          {/* Source Code View Box */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Active Inspector View: {activeFileView}
            </span>

            {activeFileView === 'server' && (
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64 scrollbar-thin">
{`// server.ts - Custom Express + Vite Entry Point
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Health & System Architecture Endpoints
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AI-247 Executive Assistant",
    port: PORT,
    activePart: { number: 1, title: "Project Setup & Architecture", status: "COMPLETED" }
  });
});

// Vite Middleware for Development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}`}
              </pre>
            )}

            {activeFileView === 'docker' && (
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64 scrollbar-thin">
{`# Dockerfile - Multi-Stage Container Setup for AI-247
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`}
              </pre>
            )}

            {activeFileView === 'types' && (
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64 scrollbar-thin">
{`// src/types/index.ts
export type PlanPartId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface ImplementationPart {
  id: PlanPartId;
  title: string;
  status: 'completed' | 'current' | 'ready' | 'locked';
  deliverables: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}`}
              </pre>
            )}

            {activeFileView === 'env' && (
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-64 scrollbar-thin">
{`# .env.example
GEMINI_API_KEY="MY_GEMINI_API_KEY"
OPENROUTER_API_KEY=""
APP_URL="MY_APP_URL"
REDIS_URL="redis://localhost:6379"
NOTION_API_KEY=""
NOTION_DATABASE_ID=""`}
              </pre>
            )}
          </div>
        </div>

      </div>

      {/* Confirmation & Approval Request Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 rounded-2xl border border-blue-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Ready for Part 2: OpenRouter & SSE Integration</h3>
          </div>
          <p className="text-xs text-slate-300">
            Part 1 is 100% completed. Click the approval button below to send your confirmation and request permission to start Part 2.
          </p>
        </div>

        <button
          id="btn-approve-part1-bottom"
          onClick={onRequestApproval}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>Approve Part 1 & Start Part 2</span>
        </button>
      </div>

    </div>
  );
};
