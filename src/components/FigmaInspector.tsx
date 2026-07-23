import React, { useState, useEffect } from 'react';
import { 
  Figma, 
  Eye, 
  Code2, 
  Palette, 
  Type, 
  LayoutGrid, 
  Sparkles, 
  Copy, 
  Check, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Zap, 
  Terminal, 
  FileCode,
  Smartphone,
  Monitor
} from 'lucide-react';
import { FigmaFrameSpec, FigmaAnalysisResult } from '../services/figma';

export const FigmaInspector: React.FC = () => {
  const [frames, setFrames] = useState<FigmaFrameSpec[]>([]);
  const [selectedFrameId, setSelectedFrameId] = useState<string>('fig-1');
  const [analysis, setAnalysis] = useState<FigmaAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('Extract React component with dark mode Tailwind CSS styling');
  const [activeSubTab, setActiveSubTab] = useState<'preview' | 'specs' | 'code'>('specs');

  useEffect(() => {
    fetchFrames();
  }, []);

  useEffect(() => {
    if (selectedFrameId) {
      handleInspect(selectedFrameId);
    }
  }, [selectedFrameId]);

  const fetchFrames = async () => {
    try {
      const res = await fetch('/api/figma/frames');
      const data = await res.json();
      setFrames(data);
    } catch (err) {
      console.error('Failed to fetch Figma frames:', err);
    }
  };

  const handleInspect = async (frameId: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/figma/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frameId, customPrompt })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Figma inspection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (analysis?.reactComponentCode) {
      navigator.clipboard.writeText(analysis.reactComponentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentFrame = frames.find((f) => f.id === selectedFrameId) || frames[0];

  return (
    <div id="figma-inspector-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                PART 8 IMPLEMENTATION
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> VISION LLM ACTIVE
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Figma className="w-5 h-5 text-purple-400" />
              Figma Design Inspector (Vision LLM)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Multimodal design frame analyzer. Select Figma mockups to automatically extract color tokens, typography, grid specs, and clean React + Tailwind CSS code.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleInspect(selectedFrameId)}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-purple-950/50 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>{loading ? 'Inspecting Canvas...' : 'Re-Inspect Frame'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Frame Selection Carousel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {frames.map((frame) => {
          const isSelected = frame.id === selectedFrameId;
          return (
            <div
              key={frame.id}
              onClick={() => setSelectedFrameId(frame.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                isSelected
                  ? 'bg-slate-900 border-purple-500 shadow-lg shadow-purple-950/30'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="h-32 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden relative">
                <img
                  src={frame.previewUrl}
                  alt={frame.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-2 right-2 bg-slate-900/90 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                  {frame.dimensions.width}x{frame.dimensions.height}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>{frame.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                </div>
                <div className="text-[10px] font-mono text-purple-400 mt-0.5">{frame.category}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Area: Inspector View */}
      {currentFrame && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          
          {/* Sub-tabs header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSubTab('specs')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSubTab === 'specs'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Palette className="w-4 h-4 text-purple-300" />
                <span>Design Tokens & Specs</span>
              </button>

              <button
                onClick={() => setActiveSubTab('code')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSubTab === 'code'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Code2 className="w-4 h-4 text-blue-300" />
                <span>Generated React + Tailwind</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Custom Vision LLM prompt..."
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-purple-500 w-64"
              />
              <button
                onClick={() => handleInspect(selectedFrameId)}
                className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Specs Subtab */}
          {activeSubTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left: Color Palette Tokens */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-400" /> Color Tokens Palette
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Extracted by Vision LLM</span>
                </div>

                <div className="space-y-3">
                  {currentFrame.colorPalette.map((color, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg border border-slate-700 shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div>
                          <div className="text-xs font-bold text-white">{color.name}</div>
                          <div className="text-[10px] text-slate-400">{color.usage}</div>
                        </div>
                      </div>
                      <code className="text-xs font-mono text-purple-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {color.hex}
                      </code>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Typography & Spacing Rules */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Type className="w-4 h-4 text-blue-400" /> Typography & Layout Rules
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Figma Frame Spec</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
                    <span className="text-slate-400 text-[10px] font-mono uppercase">Font Family</span>
                    <div className="font-bold text-white">{currentFrame.typography.fontFamily}</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
                    <span className="text-slate-400 text-[10px] font-mono uppercase">Detected Spacing Rules</span>
                    <ul className="space-y-1 text-slate-300 text-[11px] font-mono">
                      {analysis?.spacingRules?.map((rule, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Generated React Code Subtab */}
          {activeSubTab === 'code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-300">
                  <FileCode className="w-4 h-4" />
                  <span>React Component + Tailwind CSS Output</span>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Code!' : 'Copy React Component'}</span>
                </button>
              </div>

              {/* Code display block */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto max-h-96">
                <pre className="whitespace-pre-wrap leading-relaxed text-slate-200">
                  {analysis?.reactComponentCode || currentFrame.generatedTailwindCode}
                </pre>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
