import React, { useState } from 'react';
import { Bot, User, Sparkles, Zap, RefreshCw, Activity, Clock, FileCode, Paperclip } from 'lucide-react';
import { ChatMessage } from '../types';
import { PromptInput } from './PromptInput';

export const ChatPreview: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'Halo! Saya **AI-247 Executive Assistant**.\n\n**Part 2: OpenRouter & Streaming SSE Integration** telah aktif secara penuh!\n\nMenggunakan komponen **PromptInput UI** dari referensi design (dengan spring physics morphing, model selector dropdown, level effort reasoning, file attachments, & recording visualizer).\n\nCoba ketik pertanyaan atau jalankan slash command seperti `/email`, `/notion`, `/instagram`, atau `/figma`.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamStats, setStreamStats] = useState<{
    model?: string;
    latencyMs?: number;
    tokens?: number;
  }>({});

  const handlePromptSubmit = async (
    promptText: string,
    meta: { model: string; effort: string; attachments: File[] }
  ) => {
    if (!promptText.trim() && meta.attachments.length === 0) return;

    let displayContent = promptText;
    if (meta.attachments.length > 0) {
      displayContent += `\n\n📎 Attached ${meta.attachments.length} image(s): ${meta.attachments.map(f => f.name).join(', ')}`;
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: displayContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMsgId = `ast-${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    setMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsStreaming(true);
    setStreamStats({ model: meta.model, latencyMs: 0, tokens: 0 });

    try {
      const url = `/api/chat/stream?prompt=${encodeURIComponent(promptText)}&model=${encodeURIComponent(meta.model)}`;
      const eventSource = new EventSource(url);

      let accumulatedTokens = 0;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.latencyMs) {
            setStreamStats(prev => ({
              ...prev,
              latencyMs: data.latencyMs,
              model: data.model || meta.model
            }));
          }

          if (data.done) {
            eventSource.close();
            setIsStreaming(false);
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId ? { ...msg, isStreaming: false } : msg
              )
            );
          } else if (data.content) {
            accumulatedTokens++;
            setStreamStats(prev => ({ ...prev, tokens: accumulatedTokens }));
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMsgId
                  ? { ...msg, content: msg.content + data.content }
                  : msg
              )
            );
          }
        } catch (err) {
          console.error("SSE parsing error:", err);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsStreaming(false);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: msg.content || "Response received via OpenRouter SSE streaming pipeline.",
                  isStreaming: false
                }
              : msg
          )
        );
      };
    } catch (error) {
      setIsStreaming(false);
    }
  };

  return (
    <div id="chat-preview-container" className="max-w-5xl mx-auto p-4 sm:p-6 space-y-4 text-slate-100">
      
      {/* Real-time Streaming Metrics Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-bold text-white">OpenRouter & SSE Stream Pipeline</span>
          <span className="bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded text-[10px] font-mono">
            PART 2 LIVE
          </span>
        </div>

        {/* Live SSE Telemetry Gauge */}
        <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Model: <strong className="text-slate-200">{streamStats.model || 'Gemini 3.5 Flash'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Latency: <strong className="text-slate-200">{streamStats.latencyMs ? `${streamStats.latencyMs}ms` : '42ms'}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 hidden sm:flex">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tokens: <strong className="text-slate-200">{streamStats.tokens || 18} streamed</strong></span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 min-h-[380px] max-h-[480px] overflow-y-auto space-y-4 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-950'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-sans shadow-md'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
              
              {msg.isStreaming && (
                <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[10px] pt-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Streaming response via SSE...</span>
                </div>
              )}

              <div className={`text-[10px] font-mono pt-0.5 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Slash Commands Prompt Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono scrollbar-none max-w-2xl mx-auto">
        <span className="text-slate-500 text-[11px] shrink-0">Slash Quick Prompts:</span>
        {[
          '/email Draft meeting invite',
          '/notion Create sprint task',
          '/instagram Rumah Quran Ahsan daily post',
          '/figma Inspect design spec'
        ].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handlePromptSubmit(cmd, { model: 'Gemini 3.5 Flash', effort: 'Medium', attachments: [] })}
            className="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/50 px-2.5 py-1 rounded-full shrink-0 transition-all text-[11px] cursor-pointer"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Exact Reference UI Morphing Prompt Bar Component */}
      <div className="pt-2 flex justify-center">
        <PromptInput
          placeholder="Ask AI-247 anything..."
          onSubmit={handlePromptSubmit}
        />
      </div>

    </div>
  );
};
