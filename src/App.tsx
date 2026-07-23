import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { RoadmapBanner } from './components/RoadmapBanner';
import { Part1Overview } from './components/Part1Overview';
import { ChatPreview } from './components/ChatPreview';
import { SkillsFramework } from './components/SkillsFramework';
import { TaskScheduler } from './components/TaskScheduler';
import { WorkspaceConnector } from './components/WorkspaceConnector';
import { InstagramPlanner } from './components/InstagramPlanner';
import { FigmaInspector } from './components/FigmaInspector';
import { FileParsingEngine } from './components/FileParsingEngine';
import { PwaChatInterface } from './components/PwaChatInterface';
import { VpsDeployment } from './components/VpsDeployment';
import { ModuleHub } from './components/ModuleHub';
import { ApprovalModal } from './components/ApprovalModal';
import { SystemHealth } from './types';
import { fetchSystemHealth } from './services/api';

export default function App() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [activeTab, setActiveTab] = useState<'part1' | 'chat' | 'skills' | 'scheduler' | 'workspace' | 'planner' | 'figma' | 'parser' | 'pwa' | 'vps' | 'modules'>('vps');
  const [isApprovalOpen, setIsApprovalOpen] = useState(false);
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);

  useEffect(() => {
    fetchSystemHealth().then((h) => setHealth(h));
  }, []);

  const handleConfirmApproval = () => {
    setApprovalConfirmed(true);
    setIsApprovalOpen(false);
    setActiveTab('vps');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        health={health}
        activeTab={activeTab}
        setActiveTab={(t) => setActiveTab(t as any)}
        onRequestApproval={() => setIsApprovalOpen(true)}
      />

      {/* 11-Part Roadmap Progress Banner */}
      <RoadmapBanner onRequestApproval={() => setIsApprovalOpen(true)} />

      {/* Main Content View Container */}
      <main className="flex-1 pb-12">
        {activeTab === 'part1' && (
          <Part1Overview onRequestApproval={() => setIsApprovalOpen(true)} />
        )}

        {activeTab === 'chat' && <ChatPreview />}

        {activeTab === 'skills' && <SkillsFramework />}

        {activeTab === 'scheduler' && <TaskScheduler />}

        {activeTab === 'workspace' && <WorkspaceConnector />}

        {activeTab === 'planner' && <InstagramPlanner />}

        {activeTab === 'figma' && <FigmaInspector />}

        {activeTab === 'parser' && <FileParsingEngine />}

        {activeTab === 'pwa' && <PwaChatInterface />}

        {activeTab === 'vps' && <VpsDeployment />}

        {activeTab === 'modules' && (
          <ModuleHub onRequestApproval={() => setIsApprovalOpen(true)} />
        )}
      </main>

      {/* Confirmation & Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        onConfirm={handleConfirmApproval}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI-247 Executive Assistant • Express Server Port 3000 • Vite React ESM</span>
          <span className="text-emerald-400">PART 11 COMPLETED — ALL 11 PARTS FULLY BUILT & READY FOR 24/7 VPS DEPLOYMENT</span>
        </div>
      </footer>
    </div>
  );
}
