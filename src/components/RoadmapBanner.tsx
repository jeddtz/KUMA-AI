import React from 'react';
import { IMPLEMENTATION_PARTS } from '../data/parts';
import { CheckCircle2, Lock, ArrowRight, ShieldAlert, Sparkles, FolderTree } from 'lucide-react';

interface RoadmapBannerProps {
  onRequestApproval: () => void;
}

export const RoadmapBanner: React.FC<RoadmapBannerProps> = ({ onRequestApproval }) => {
  const completedCount = IMPLEMENTATION_PARTS.filter(p => p.status === 'completed').length;
  const progressPercent = Math.round((completedCount / IMPLEMENTATION_PARTS.length) * 100);

  return (
    <div id="roadmap-banner" className="bg-slate-900 border-b border-slate-800 text-slate-100 p-4 sm:p-6 shadow-inner">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Status Callout Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-white">Part 11: VPS Deployment (Docker, Nginx, SSL) Completed</h2>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Step 11 / 11 All Done 🚀
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete zero-touch Docker containerization, deploy.sh script, Nginx reverse proxy, and free 24/7 VPS guides for Oracle Cloud Always Free (24GB RAM) & GCP Free Tier.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-confirm-approval-banner"
              onClick={onRequestApproval}
              className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-md shadow-emerald-950 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Review Part 11 Deliverables</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Strict Rules Rule Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/40 px-3.5 py-2 rounded-lg border border-slate-800/60 font-mono">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Full System Delivery: <strong>11 of 11 Parts Fully Completed & Ready for 24/7 Production</strong>.</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-blue-400" />
            <span>Progress: 100% (11/11 Parts Completed)</span>
          </div>
        </div>

        {/* 11 Part Interactive Roadmap Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-2 pt-1">
          {IMPLEMENTATION_PARTS.map((part) => {
            const isCompleted = part.status === 'completed';
            const isReady = part.status === 'ready';

            return (
              <div
                key={part.id}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                    : isReady
                    ? 'bg-blue-950/40 border-blue-600/80 text-blue-200 ring-2 ring-blue-500/30'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold uppercase">Part {part.id}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isReady ? (
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                  ) : (
                    <Lock className="w-3 h-3 text-slate-600" />
                  )}
                </div>
                <div className="text-[11px] font-medium line-clamp-1 leading-snug">
                  {part.title.split(': ')[1] || part.title}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
