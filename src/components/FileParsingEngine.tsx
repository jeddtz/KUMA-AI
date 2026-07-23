import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Table, 
  HelpCircle, 
  Search, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Tag, 
  Send, 
  FileSpreadsheet, 
  FileCode, 
  Database,
  Bot
} from 'lucide-react';
import type { ParsedDocument, DocumentQAResponse } from '../types/shared';

export const FileParsingEngine: React.FC = () => {
  const [documents, setDocuments] = useState<ParsedDocument[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'table' | 'chunks' | 'qa'>('table');
  const [loading, setLoading] = useState(false);

  // Upload state
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'csv' | 'txt' | 'json'>('pdf');
  const [rawText, setRawText] = useState('');

  // QA State
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState<DocumentQAResponse[]>([]);

  // CSV Search filter
  const [csvFilter, setCsvFilter] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents/list');
      const data: ParsedDocument[] = await res.json();
      setDocuments(data);
      if (data.length > 0 && !selectedDocId) {
        setSelectedDocId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !rawText) return;
    setLoading(true);
    try {
      const res = await fetch('/api/documents/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fileName, fileType, rawText })
      });
      const newDoc: ParsedDocument = await res.json();
      await fetchDocuments();
      setSelectedDocId(newDoc.id);
      setFileName('');
      setRawText('');
      setActiveTab(newDoc.fileType === 'csv' ? 'table' : 'chunks');
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question || !selectedDocId) return;
    setLoading(true);
    try {
      const res = await fetch('/api/documents/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: selectedDocId, question })
      });
      const qaResult: DocumentQAResponse = await res.json();
      setQaHistory((prev) => [qaResult, ...prev]);
      setQuestion('');
    } catch (err) {
      console.error('QA query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    try {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      await fetchDocuments();
      if (selectedDocId === id) {
        setSelectedDocId(documents.find((d) => d.id !== id)?.id || '');
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const selectedDoc = documents.find((d) => d.id === selectedDocId) || documents[0];

  const loadSamplePreset = (preset: 'pdf' | 'csv') => {
    if (preset === 'pdf') {
      setFileName('RumahQuranAhsan_Curriculum_2026.pdf');
      setFileType('pdf');
      setRawText(`RUMAH QURAN AHSAN - TAHFIZH & TAJWEED CURRICULUM 2026
Chapter 1: Makhraj & Sifat Huruf
Chapter 2: Hukum Nun Mati & Tanwin (Izhar, Idgham, Iqlab, Ikhfa)
Chapter 3: Mad & Qasr Rules
Chapter 4: Murajaah Targets (1 Juz / month standard track)
Chapter 5: Evaluasi Sanad & Sertifikasi Akhlaq Rabbani.`);
    } else {
      setFileName('AI247_Executive_Task_Metrics.csv');
      setFileType('csv');
      setRawText(`Task_ID,Service,Latency_ms,Status,Priority
TSK-001,Workspace Gmail,142,Completed,High
TSK-002,Instagram Meta API,188,Completed,High
TSK-003,Figma Vision Inspector,210,Completed,Medium
TSK-004,Document File Parser,120,Completed,Critical
TSK-005,BullMQ Redis Queue,95,Completed,High`);
    }
  };

  return (
    <div id="file-parsing-engine-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                PART 9 IMPLEMENTATION
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> MULTIMODAL PARSER
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              File Parsing Engine (PDF, DOCX, CSV)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Upload, extract, chunk, and query documents. Includes CSV structured table visualizer, auto-summary generator, and Gemini context binder Q&A.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-200" />
              <span>Parse New Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Document List Sidebar (4 Cols) + Detail Inspection View (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Document Repository Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white">Parsed Documents</h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
                {documents.length} Files
              </span>
            </div>

            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {documents.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {doc.fileType === 'csv' ? (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : doc.fileType === 'pdf' ? (
                          <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                        <span className="text-xs font-bold text-white truncate">{doc.name}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteDoc(doc.id);
                        }}
                        className="text-slate-500 hover:text-red-400 p-0.5 transition-all cursor-pointer shrink-0"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span className="uppercase text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                        {doc.fileType}
                      </span>
                      <span>{(doc.sizeBytes / 1024).toFixed(1)} KB</span>
                      <span>{doc.chunks.length} Chunks</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Active Document Viewer & Inspector */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Document Navigation Sub-tabs */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
            
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('table')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'table'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Table className="w-3.5 h-3.5 text-cyan-300" />
                  <span>CSV Data Table</span>
                </button>

                <button
                  onClick={() => setActiveTab('chunks')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'chunks'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-300" />
                  <span>Text Chunks & Summary</span>
                </button>

                <button
                  onClick={() => setActiveTab('qa')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'qa'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Document Q&A Bot</span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-purple-300" />
                  <span>Upload & Parse</span>
                </button>
              </div>

              {selectedDoc && (
                <div className="text-xs font-mono text-cyan-400 truncate max-w-xs">
                  {selectedDoc.name}
                </div>
              )}
            </div>

            {/* TAB 1: CSV DATA TABLE VISUALIZER */}
            {activeTab === 'table' && (
              <div className="space-y-4">
                {selectedDoc?.csvData ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="relative flex-1">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={csvFilter}
                          onChange={(e) => setCsvFilter(e.target.value)}
                          placeholder="Filter rows in CSV..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-lg">
                        {selectedDoc.csvData.totalRows} Rows
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-900 border-b border-slate-800 font-mono text-cyan-400">
                          <tr>
                            {selectedDoc.csvData.headers.map((h, i) => (
                              <th key={i} className="p-3 font-semibold uppercase text-[10px]">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-slate-300">
                          {selectedDoc.csvData.rows
                            .filter((r) =>
                              Object.values(r).some((v) =>
                                String(v).toLowerCase().includes(csvFilter.toLowerCase())
                              )
                            )
                            .map((row, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/40 transition-all">
                                {selectedDoc.csvData?.headers.map((h, cIdx) => (
                                  <td key={cIdx} className="p-3 text-xs">
                                    {row[h]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
                    <Table className="w-8 h-8 text-slate-600 mx-auto" />
                    <p>Selected document is not a CSV dataset.</p>
                    <p className="text-[11px] text-slate-500">
                      Switch to "Text Chunks & Summary" tab or select a CSV document from the repository.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: TEXT CHUNKS & SUMMARY */}
            {activeTab === 'chunks' && selectedDoc && (
              <div className="space-y-4">
                
                {/* Auto Summary Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Auto-Generated Summary</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedDoc.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    {selectedDoc.keyTopics.map((topic, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded-full"
                      >
                        #{topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Text Chunks List */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>Text Chunks ({selectedDoc.chunks.length})</span>
                  </span>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {selectedDoc.chunks.map((chunk, cIdx) => (
                      <div
                        key={cIdx}
                        className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed"
                      >
                        <span className="text-[10px] text-cyan-400 block mb-1">
                          [Chunk #{cIdx + 1}]
                        </span>
                        {chunk}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: DOCUMENT QA BOT */}
            {activeTab === 'qa' && selectedDoc && (
              <div className="space-y-4">
                
                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={`Ask anything about "${selectedDoc.name}"...`}
                    required
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-cyan-950 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Analyzing...' : 'Ask Doc'}</span>
                  </button>
                </form>

                {/* QA History */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {qaHistory.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500 bg-slate-950 border border-slate-800 rounded-2xl">
                      <Bot className="w-8 h-8 text-cyan-400 mx-auto mb-2 opacity-60" />
                      <p>Ask a question about the active document to start Gemini QA context binding.</p>
                    </div>
                  ) : (
                    qaHistory.map((qa, qIdx) => (
                      <div key={qIdx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-cyan-400" />
                          <span>Q: {qa.question}</span>
                        </div>
                        <div className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900 p-3 rounded-xl border border-slate-800">
                          {qa.answer}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: UPLOAD & PARSE NEW DOCUMENT */}
            {activeTab === 'upload' && (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => loadSamplePreset('pdf')}
                    className="bg-slate-950 hover:bg-slate-800 text-rose-400 border border-rose-950 px-3 py-1.5 rounded-xl text-xs font-mono transition-all"
                  >
                    Load Sample PDF Text
                  </button>
                  <button
                    type="button"
                    onClick={() => loadSamplePreset('csv')}
                    className="bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-950 px-3 py-1.5 rounded-xl text-xs font-mono transition-all"
                  >
                    Load Sample CSV Dataset
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">Document Name</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="e.g. Annual_Report_2026.pdf"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">File Format</label>
                    <select
                      value={fileType}
                      onChange={(e: any) => setFileType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="pdf">PDF Document</option>
                      <option value="docx">DOCX Word</option>
                      <option value="csv">CSV Dataset</option>
                      <option value="txt">Plain Text</option>
                      <option value="json">JSON File</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Document Raw Content</label>
                  <textarea
                    rows={6}
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste or upload document text content here..."
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-cyan-950 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{loading ? 'Parsing Document...' : 'Parse Document & Extract Chunks'}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
