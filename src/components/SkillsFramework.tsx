import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Terminal, 
  Play, 
  CheckCircle2, 
  Code2, 
  RefreshCw, 
  SlidersHorizontal,
  Mail,
  FileText,
  Calendar,
  Table,
  PenTool,
  Instagram,
  Figma,
  FileSearch,
  AlertCircle
} from 'lucide-react';
import { AISkill } from '../types';

export const SkillsFramework: React.FC = () => {
  const [skills, setSkills] = useState<AISkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<AISkill | null>(null);
  const [testPrompt, setTestPrompt] = useState('/email Meeting Briefing for Executive Team');
  const [testOutput, setTestOutput] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/skills');
      const data = await res.json();
      if (data.skills) {
        setSkills(data.skills);
        if (!selectedSkill && data.skills.length > 0) {
          setSelectedSkill(data.skills[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleToggle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch('/api/skills/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success && data.skill) {
        setSkills((prev) =>
          prev.map((s) => (s.id === id ? data.skill : s))
        );
        if (selectedSkill?.id === id) {
          setSelectedSkill(data.skill);
        }
      }
    } catch (err) {
      console.error('Failed to toggle skill:', err);
    }
  };

  const handleRunTest = async (commandToRun?: string) => {
    const query = commandToRun || testPrompt;
    if (!query) return;

    setIsExecuting(true);
    setTestOutput(null);

    try {
      const res = await fetch('/api/skills/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query })
      });
      const data = await res.json();
      setTestOutput(data);
    } catch (err) {
      setTestOutput({ error: 'Failed to execute skill endpoint' });
    } finally {
      setIsExecuting(false);
    }
  };

  const getSkillIcon = (trigger: string) => {
    switch (trigger) {
      case '/email': return <Mail className="w-4 h-4 text-blue-400" />;
      case '/docs': return <FileText className="w-4 h-4 text-emerald-400" />;
      case '/schedule': return <Calendar className="w-4 h-4 text-amber-400" />;
      case '/sheets': return <Table className="w-4 h-4 text-green-400" />;
      case '/notion': return <PenTool className="w-4 h-4 text-slate-300" />;
      case '/instagram': return <Instagram className="w-4 h-4 text-pink-400" />;
      case '/figma': return <Figma className="w-4 h-4 text-purple-400" />;
      case '/parse': return <FileSearch className="w-4 h-4 text-cyan-400" />;
      default: return <Zap className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div id="skills-framework-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                PART 3 IMPLEMENTATION
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ACTIVE
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Modular Skills Framework & Slash Commands
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Dynamic skill registry engine capable of parsing slash commands, executing function handlers, and connecting Google Workspace with Notion & Instagram standby modules.
            </p>
          </div>

          <button
            onClick={fetchSkills}
            className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload Registry</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: Skills List & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Registered Skills Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
              Registered Slash Command Skills ({skills.length})
            </h3>
            <span className="text-[11px] text-slate-500">Click to inspect / test</span>
          </div>

          <div className="space-y-2.5">
            {skills.map((skill) => {
              const isSelected = selectedSkill?.id === skill.id;
              const isStandby = skill.trigger === '/notion' || skill.trigger === '/instagram';

              return (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkill(skill)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-950/20'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      {getSkillIcon(skill.trigger)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
                          {skill.trigger}
                        </span>
                        <h4 className="text-xs font-bold text-white">{skill.name}</h4>
                        {isStandby && (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-mono px-1.5 rounded">
                            Standby
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{skill.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleToggle(skill.id, e)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono font-semibold border transition-all cursor-pointer shrink-0 ${
                      skill.isActive
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    {skill.isActive ? 'Active' : 'Disabled'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Skill Inspector & Live Executor (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Selected Skill Details Card */}
          {selectedSkill ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {getSkillIcon(selectedSkill.trigger)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedSkill.name}</h3>
                    <p className="text-[10px] font-mono text-cyan-400">{selectedSkill.trigger}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  selectedSkill.isActive 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}>
                  {selectedSkill.isActive ? 'ENABLED' : 'DISABLED'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500">Description</span>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedSkill.description}</p>
              </div>

              {/* Parameter JSON Schema */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
                  <Code2 className="w-3 h-3 text-cyan-400" /> Parameter Schema
                </span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                  {selectedSkill.parametersSchema || '{}'}
                </pre>
              </div>

              {/* Quick Run Skill Button */}
              <button
                onClick={() => {
                  const defaultArg = selectedSkill.trigger === '/email' ? '/email Executive Sync Agenda' :
                                    selectedSkill.trigger === '/docs' ? '/docs AI-247 Strategic Memo' :
                                    selectedSkill.trigger === '/notion' ? '/notion Daily Sprint Backlog' :
                                    selectedSkill.trigger === '/instagram' ? '/instagram Daily Motivation Post' :
                                    selectedSkill.trigger === '/schedule' ? '/schedule Team Review Tomorrow 10 AM' :
                                    `${selectedSkill.trigger} Test parameter payload`;
                  setTestPrompt(defaultArg);
                  handleRunTest(defaultArg);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Quick Test {selectedSkill.trigger} Handler</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-500 text-xs">
              Select a skill from the list to view its schema and handler details.
            </div>
          )}

          {/* Interactive Live Executor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Live Slash Command Tester
            </h3>

            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  placeholder="/email Draft meeting followup..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleRunTest()}
                  disabled={isExecuting}
                  className="absolute right-1.5 top-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[11px] font-semibold px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  {isExecuting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  <span>Run</span>
                </button>
              </div>

              {testOutput && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-b border-slate-800/80 pb-1.5">
                    <span>Execution Result</span>
                    <span className="text-emerald-400 font-bold">
                      {testOutput.executed ? testOutput.result?.mode?.toUpperCase() : 'NOT MATCHED'}
                    </span>
                  </div>

                  {testOutput.executed ? (
                    <div className="whitespace-pre-wrap font-sans text-slate-200 text-xs leading-relaxed">
                      {testOutput.result?.output}
                    </div>
                  ) : (
                    <div className="text-amber-400 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" />
                      <span>{testOutput.message || 'Slash command not recognized'}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
