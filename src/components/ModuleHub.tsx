import React from 'react';
import { 
  Zap, Code, Calendar, Mail, FileSpreadsheet, Instagram, 
  Figma, FileText, Lock, ArrowRight, ShieldCheck, Cpu 
} from 'lucide-react';

interface ModuleHubProps {
  onRequestApproval: () => void;
}

export const ModuleHub: React.FC<ModuleHubProps> = ({ onRequestApproval }) => {
  const modules = [
    { id: 2, name: 'Part 2: OpenRouter & SSE Streaming', icon: Zap, color: 'text-amber-400', status: 'READY NEXT', desc: 'Real-time response streaming API wrapper and SSE token generator.' },
    { id: 3, name: 'Part 3: Modular Skills & Slash Commands', icon: Code, color: 'text-blue-400', status: 'LOCKED', desc: 'Dynamic AI skill registration engine with structured function calls.' },
    { id: 4, name: 'Part 4: Task Scheduler (BullMQ + Redis)', icon: Calendar, color: 'text-red-400', status: 'LOCKED', desc: '24/7 background job queue worker for automated scheduled tasks.' },
    { id: 5, name: 'Part 5: Google Workspace Connector', icon: Mail, color: 'text-emerald-400', status: 'LOCKED', desc: 'Gmail draft creation & Google Docs automated document builder.' },
    { id: 6, name: 'Part 6: Notion & Google Sheets', icon: FileSpreadsheet, color: 'text-purple-400', status: 'LOCKED', desc: 'Bi-directional Notion database sync and Google Sheets logging.' },
    { id: 7, name: 'Part 7: Instagram Content Planner', icon: Instagram, color: 'text-pink-400', status: 'LOCKED', desc: 'Rumah Quran Ahsan daily social media generator & Notion sync.' },
    { id: 8, name: 'Part 8: Figma Design Inspector', icon: Figma, color: 'text-cyan-400', status: 'LOCKED', desc: 'Multimodal vision LLM analysis of Figma canvas and layout UI.' },
    { id: 9, name: 'Part 9: File Parsing Engine', icon: FileText, color: 'text-indigo-400', status: 'LOCKED', desc: 'PDF, DOCX, and CSV text extractor and conversational Q&A binder.' },
  ];

  return (
    <div id="module-hub-container" className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">AI-247 Assistant Module Architecture</h2>
          </div>
          <p className="text-xs text-slate-400">
            Following strict <strong>One Part at a Time</strong> execution. Part 1 setup is complete. Next module: Part 2 (OpenRouter & SSE Streaming).
          </p>
        </div>

        <button
          onClick={onRequestApproval}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md flex items-center gap-2 shrink-0 transition-all cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Approve Part 1 & Unlock Part 2</span>
        </button>
      </div>

      {/* Grid of Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => {
          const IconComp = mod.icon;
          const isReadyNext = mod.status === 'READY NEXT';

          return (
            <div
              key={mod.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isReadyNext
                  ? 'bg-gradient-to-b from-slate-900 to-blue-950/60 border-blue-600/80 shadow-lg shadow-blue-950/40 ring-1 ring-blue-500/30'
                  : 'bg-slate-900 border-slate-800 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center ${mod.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isReadyNext
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse'
                        : 'bg-slate-950 text-slate-500 border border-slate-800'
                    }`}
                  >
                    {mod.status}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-white">{mod.name}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{mod.desc}</p>
                </div>
              </div>

              {isReadyNext ? (
                <button
                  onClick={onRequestApproval}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Proceed to Part 2</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="flex items-center text-xs text-slate-500 gap-1.5 font-mono pt-2 border-t border-slate-800/60">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Awaiting Part {mod.id - 1} Completion</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
