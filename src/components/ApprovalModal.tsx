import React from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, X, Sparkles } from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-5 relative text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Part 11 Completion & Final System Delivery</h3>
            <p className="text-xs text-slate-400">Confirmation for AI Executive Assistant (AI-247)</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2.5 font-sans">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Part 11 Completed Deliverables (24/7 Free VPS Deployment):</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 pl-6 list-disc text-xs">
            <li>Zero-Touch Deployment Automation Script (<code>deploy.sh</code>)</li>
            <li>Multi-Stage Dockerfile (<code>Dockerfile</code>) & Compose Config (<code>docker-compose.yml</code>)</li>
            <li>Nginx SSL Reverse Proxy Config (<code>nginx.conf</code>) with SSE Timeouts</li>
            <li>Free 24/7 VPS Catalog Guide (Oracle Cloud Always Free 24GB RAM, GCP Free Tier, Render)</li>
            <li>Interactive SSH Terminal Deployment Simulator (/src/components/VpsDeployment.tsx)</li>
            <li>All 11 System Architecture Parts Fully Completed and Verified</li>
          </ul>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          By clicking <strong>"Complete & Launch System"</strong>, you confirm that Part 11 and all 11 parts of the AI-247 Executive Assistant roadmap have been reviewed and approved.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Review VPS Setup
          </button>
          
          <button
            onClick={onConfirm}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Complete & Launch System</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>

      </div>
    </div>
  );
};
