import React from 'react';
import { Bot, Cpu, Layers, CheckCircle2, Server, Terminal, Shield, Clock, HardDrive, Instagram, Figma, FileText } from 'lucide-react';
import { SystemHealth } from '../types';

interface NavbarProps {
  health: SystemHealth | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRequestApproval: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ health, activeTab, setActiveTab, onRequestApproval }) => {
  return (
    <header id="main-header" className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-900/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">AI-247</span>
              <span className="text-xs bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full font-mono font-medium">
                Executive Assistant
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Server className="w-3 h-3 text-emerald-400" />
              <span>Full-Stack Express + Vite</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono">Port 3000</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            id="nav-tab-part1"
            onClick={() => setActiveTab('part1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'part1'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Part 1 Setup</span>
          </button>

          <button
            id="nav-tab-chat"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Chat & SSE Stream</span>
          </button>

          <button
            id="nav-tab-skills"
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Skills Manager (Part 3)</span>
          </button>

          <button
            id="nav-tab-scheduler"
            onClick={() => setActiveTab('scheduler')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'scheduler'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Task Scheduler (Part 4)</span>
          </button>

          <button
            id="nav-tab-workspace"
            onClick={() => setActiveTab('workspace')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'workspace'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span>Workspace (Part 5)</span>
          </button>

          <button
            id="nav-tab-planner"
            onClick={() => setActiveTab('planner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'planner'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Instagram (Part 7)</span>
          </button>

          <button
            id="nav-tab-figma"
            onClick={() => setActiveTab('figma')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'figma'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Figma className="w-3.5 h-3.5 text-purple-400" />
            <span>Figma (Part 8)</span>
          </button>

          <button
            id="nav-tab-parser"
            onClick={() => setActiveTab('parser')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'parser'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>File Parser (Part 9)</span>
          </button>

          <button
            id="nav-tab-pwa"
            onClick={() => setActiveTab('pwa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>ChatGPT PWA (Part 10)</span>
          </button>

          <button
            id="nav-tab-vps"
            onClick={() => setActiveTab('vps')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'vps'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-amber-400" />
            <span>24/7 VPS Deploy (Part 11)</span>
          </button>

          <button
            id="nav-tab-modules"
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'modules'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Module Hub</span>
          </button>
        </nav>

        {/* Server & Part Status Indicator */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 px-3 py-1 rounded-lg text-xs font-mono">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>ALL 11 PARTS COMPLETED 🚀</span>
          </div>

          <button
            id="btn-request-part11"
            onClick={onRequestApproval}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-blue-900/40 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Part 11 Approval</span>
          </button>
        </div>

      </div>
    </header>
  );
};
