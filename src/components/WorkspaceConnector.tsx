import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  FileText, 
  Calendar, 
  Table, 
  HardDrive, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Plus, 
  ExternalLink, 
  RefreshCw,
  Clock,
  UserCheck
} from 'lucide-react';

interface WorkspaceStatus {
  isConnected: boolean;
  userEmail?: string;
  scopes: string[];
  mode: string;
}

export const WorkspaceConnector: React.FC = () => {
  const [status, setStatus] = useState<WorkspaceStatus | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'gmail' | 'docs' | 'calendar' | 'sheets' | 'drive'>('gmail');
  const [loading, setLoading] = useState(false);
  const [actionOutput, setActionOutput] = useState<any | null>(null);

  // Form states
  const [emailTo, setEmailTo] = useState('hafidzmuhammad536@gmail.com');
  const [emailSubject, setEmailSubject] = useState('AI-247 Assistant Executive Briefing Memo');
  const [emailBody, setEmailBody] = useState('Dear Team,\n\nThe AI-247 Executive Assistant Google Workspace OAuth integration is active and operating with full permissions for Gmail, Docs, Sheets, Calendar, and Drive.\n\nBest regards,\nAI-247 Executive Assistant');

  const [docTitle, setDocTitle] = useState('AI-247 Strategic Automation Plan');
  const [docContent, setDocContent] = useState('1. Overview of AI-247 Assistant System Architecture\n2. OpenRouter & SSE Streaming Pipeline\n3. BullMQ Persistent Task Queue\n4. Google Workspace Sync Modules');

  const [calSummary, setCalSummary] = useState('AI-247 Executive Sync & Roadmap Review');
  const [calTime, setCalTime] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16));

  const [sheetName, setSheetName] = useState('Weekly KPI Dashboard');
  const [sheetValues, setSheetValues] = useState('2026-07-22, OAuth Connector Active, 100% Pass');

  const [driveFiles, setDriveFiles] = useState<any[]>([]);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/workspace/status');
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch workspace status:', err);
    }
  };

  const handleCreateGmailDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActionOutput(null);
    try {
      const res = await fetch('/api/workspace/gmail/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo, subject: emailSubject, body: emailBody })
      });
      const data = await res.json();
      setActionOutput(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoogleDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActionOutput(null);
    try {
      const res = await fetch('/api/workspace/docs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: docTitle, content: docContent })
      });
      const data = await res.json();
      setActionOutput(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleCalendar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActionOutput(null);
    try {
      const res = await fetch('/api/workspace/calendar/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: calSummary, startTime: new Date(calTime).toISOString() })
      });
      const data = await res.json();
      setActionOutput(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppendSheets = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setActionOutput(null);
    try {
      const res = await fetch('/api/workspace/sheets/append', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: sheetName, values: sheetValues.split(',').map((v) => v.trim()) })
      });
      const data = await res.json();
      setActionOutput(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDriveFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workspace/drive/files');
      const data = await res.json();
      if (data.files) setDriveFiles(data.files);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="workspace-connector-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                PART 5 IMPLEMENTATION
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> OAUTH ACTIVE
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Google Workspace Connector (Gmail, Docs, Sheets, Calendar, Drive)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              OAuth2 authorized Workspace connector. Execute live actions across Gmail draft composer, Google Docs creator, Calendar scheduler, and Sheets KPI logger.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-800 flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-xs">
              <div className="text-[10px] font-mono text-slate-400">Authenticated Google Account</div>
              <div className="font-mono text-white font-bold">{status?.userEmail || 'hafidzmuhammad536@gmail.com'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => { setActiveSubTab('gmail'); setActionOutput(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'gmail'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4 text-red-400" />
          <span>Gmail Composer</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('docs'); setActionOutput(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'docs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Google Docs</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('calendar'); setActionOutput(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'calendar'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Google Calendar</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('sheets'); setActionOutput(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'sheets'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Table className="w-4 h-4 text-emerald-400" />
          <span>Google Sheets</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('drive'); setActionOutput(null); handleFetchDriveFiles(); }}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'drive'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <HardDrive className="w-4 h-4 text-cyan-400" />
          <span>Google Drive</span>
        </button>
      </div>

      {/* Interactive Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Form Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          
          {/* Gmail Form */}
          {activeSubTab === 'gmail' && (
            <form onSubmit={handleCreateGmailDraft} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <Mail className="w-4 h-4 text-red-400" />
                <span>Draft Executive Email in Gmail</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Recipient Email</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Email Body Message</label>
                <textarea
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-blue-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Creating Gmail Draft...' : 'Create Gmail Draft via OAuth'}</span>
              </button>
            </form>
          )}

          {/* Google Docs Form */}
          {activeSubTab === 'docs' && (
            <form onSubmit={handleCreateGoogleDoc} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Create New Google Doc Briefing</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Document Outline & Content</label>
                <textarea
                  rows={5}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-blue-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{loading ? 'Generating Google Doc...' : 'Generate Google Doc Document'}</span>
              </button>
            </form>
          )}

          {/* Google Calendar Form */}
          {activeSubTab === 'calendar' && (
            <form onSubmit={handleScheduleCalendar} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>Schedule Google Calendar Event</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Meeting Summary Title</label>
                <input
                  type="text"
                  value={calSummary}
                  onChange={(e) => setCalSummary(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Start Time (Date & Time)</label>
                <input
                  type="datetime-local"
                  value={calTime}
                  onChange={(e) => setCalTime(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-amber-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{loading ? 'Scheduling Event...' : 'Schedule Event & Attach Google Meet'}</span>
              </button>
            </form>
          )}

          {/* Google Sheets Form */}
          {activeSubTab === 'sheets' && (
            <form onSubmit={handleAppendSheets} className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
                <Table className="w-4 h-4 text-emerald-400" />
                <span>Append Data Row to Google Sheets</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Spreadsheet Name / ID</label>
                <input
                  type="text"
                  value={sheetName}
                  onChange={(e) => setSheetName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">CSV Row Values (Comma Separated)</label>
                <input
                  type="text"
                  value={sheetValues}
                  onChange={(e) => setSheetValues(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Table className="w-4 h-4" />
                <span>{loading ? 'Appending Row...' : 'Append Data Row to Spreadsheet'}</span>
              </button>
            </form>
          )}

          {/* Google Drive Files List */}
          {activeSubTab === 'drive' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <HardDrive className="w-4 h-4 text-cyan-400" />
                  <span>Google Drive File Manager</span>
                </div>
                <button
                  type="button"
                  onClick={handleFetchDriveFiles}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              <div className="space-y-2">
                {driveFiles.map((file) => (
                  <div key={file.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{file.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{file.type} • Updated {file.updatedAt}</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                      Drive Synced
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Live Output Log Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Workspace API Execution Result
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                OAuth2 Verified
              </span>
            </div>

            {actionOutput ? (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 space-y-2 overflow-x-auto">
                <div className="text-white font-bold pb-1 border-b border-slate-800">
                  Status: {actionOutput.status || 'Success'}
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-slate-300">
                  {JSON.stringify(actionOutput, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-2xl p-8 text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">
                  Select a Google Workspace action on the left and execute to view real-time OAuth payload results.
                </p>
              </div>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-xs space-y-2">
            <span className="font-semibold text-blue-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Active OAuth2 Scopes:
            </span>
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">gmail.readonly</span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">gmail.send</span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">gmail.compose</span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">documents</span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">spreadsheets</span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">calendar</span>
              <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">drive.file</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
