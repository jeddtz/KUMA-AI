/**
 * Document & File Parsing Engine
 * Part 9 Implementation: Multimodal document upload, text chunking, CSV data visualizer, and Gemini QA context binder.
 */

import { GoogleGenAI } from '@google/genai';

export interface ParsedDocument {
  id: string;
  name: string;
  fileType: 'pdf' | 'docx' | 'csv' | 'txt' | 'json';
  sizeBytes: number;
  uploadedAt: string;
  rawText: string;
  chunks: string[];
  summary: string;
  csvData?: {
    headers: string[];
    rows: Record<string, string>[];
    totalRows: number;
  };
  keyTopics: string[];
}

export interface DocumentQAResponse {
  documentId: string;
  question: string;
  answer: string;
  relevantChunks: string[];
  timestamp: string;
}

const PRESET_SAMPLE_DOCUMENTS: ParsedDocument[] = [
  {
    id: 'doc-101',
    name: 'Executive_AI247_Q3_Strategic_Report.pdf',
    fileType: 'pdf',
    sizeBytes: 2450000,
    uploadedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    rawText: `EXECUTIVE SUMMARY - Q3 AI-247 STRATEGIC DIRECTION
Objective: Scale automated assistant workflows across Google Workspace, Instagram Meta API, and Figma design pipelines.
Key Performance Indicators:
1. Response Latency: Sub-200ms average execution across OpenRouter LLM routing.
2. Workspace Integration: 100% OAuth2 authorization coverage for Gmail, Docs, Sheets, Calendar, and Drive.
3. Content Automation: Daily automated posts for Rumah Quran Ahsan with 0 missed schedules.
4. Security & Compliance: Environment variables protected server-side, no public API key exposure.`,
    chunks: [
      'EXECUTIVE SUMMARY - Q3 AI-247 STRATEGIC DIRECTION. Objective: Scale automated assistant workflows across Google Workspace, Instagram Meta API, and Figma design pipelines.',
      'Key Performance Indicators: 1. Response Latency: Sub-200ms average execution across OpenRouter LLM routing. 2. Workspace Integration: 100% OAuth2 authorization coverage.',
      '3. Content Automation: Daily automated posts for Rumah Quran Ahsan with 0 missed schedules. 4. Security & Compliance: Environment variables protected server-side.'
    ],
    summary: 'Q3 Strategic Report detailing performance targets for AI-247 Assistant, focusing on <200ms response latency, complete Google Workspace OAuth2 integration, and automated Instagram publishing for Rumah Quran Ahsan.',
    keyTopics: ['AI-247 Roadmap', 'Workspace OAuth2', 'Rumah Quran Ahsan', 'Latency Optimization', 'Server Security']
  },
  {
    id: 'doc-102',
    name: 'RumahQuranAhsan_Santri_Database_2026.csv',
    fileType: 'csv',
    sizeBytes: 84000,
    uploadedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    rawText: `Nama,Program,Target_Juz,Sabaq_Harian,Status
Muhammad Hafidz,Tahfizh Intensif,Juz 30,1 Halaman,Aktif
Aisyah Nur,Tajweed Bersanad,Juz 1,2 Halaman,Aktif
Raihan Ahmad,Tahfizh Reguler,Juz 5,1 Halaman,Aktif
Fatimah Az-Zahra,Kelas Akhlaq & Murajaah,Juz 15,3 Halaman,Aktif
Ahmad Zaky,Tahfizh Intensif,Juz 2,1 Halaman,Aktif`,
    chunks: [
      'Nama: Muhammad Hafidz | Program: Tahfizh Intensif | Target: Juz 30 | Sabaq: 1 Halaman | Status: Aktif',
      'Nama: Aisyah Nur | Program: Tajweed Bersanad | Target: Juz 1 | Sabaq: 2 Halaman | Status: Aktif',
      'Nama: Raihan Ahmad | Program: Tahfizh Reguler | Target: Juz 5 | Sabaq: 1 Halaman | Status: Aktif'
    ],
    summary: 'Active santri database for Rumah Quran Ahsan containing records of program tracks (Tahfizh Intensif, Tajweed Bersanad, Akhlaq), target juz, and daily sabaq progress.',
    csvData: {
      headers: ['Nama', 'Program', 'Target_Juz', 'Sabaq_Harian', 'Status'],
      rows: [
        { Nama: 'Muhammad Hafidz', Program: 'Tahfizh Intensif', Target_Juz: 'Juz 30', Sabaq_Harian: '1 Halaman', Status: 'Aktif' },
        { Nama: 'Aisyah Nur', Program: 'Tajweed Bersanad', Target_Juz: 'Juz 1', Sabaq_Harian: '2 Halaman', Status: 'Aktif' },
        { Nama: 'Raihan Ahmad', Program: 'Tahfizh Reguler', Target_Juz: 'Juz 5', Sabaq_Harian: '1 Halaman', Status: 'Aktif' },
        { Nama: 'Fatimah Az-Zahra', Program: 'Kelas Akhlaq & Murajaah', Target_Juz: 'Juz 15', Sabaq_Harian: '3 Halaman', Status: 'Aktif' },
        { Nama: 'Ahmad Zaky', Program: 'Tahfizh Intensif', Target_Juz: 'Juz 2', Sabaq_Harian: '1 Halaman', Status: 'Aktif' }
      ],
      totalRows: 5
    },
    keyTopics: ['Rumah Quran Ahsan', 'Santri Database', 'Tahfizh Progress', 'Sabaq Halaman', 'Status Santri']
  }
];

class FileParsingService {
  private documents: ParsedDocument[] = PRESET_SAMPLE_DOCUMENTS;

  public getDocuments(): ParsedDocument[] {
    return this.documents;
  }

  public parseAndStoreDocument(
    name: string,
    fileType: 'pdf' | 'docx' | 'csv' | 'txt' | 'json',
    rawText: string
  ): ParsedDocument {
    // Generate chunks (simple 300 char slice algorithm)
    const chunks: string[] = [];
    const chunkSize = 300;
    for (let i = 0; i < rawText.length; i += chunkSize) {
      chunks.push(rawText.slice(i, i + chunkSize));
    }

    let csvData: ParsedDocument['csvData'] = undefined;
    if (fileType === 'csv') {
      const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length > 0) {
        const headers = lines[0].split(',').map((h) => h.trim());
        const rows = lines.slice(1).map((line) => {
          const vals = line.split(',').map((v) => v.trim());
          const obj: Record<string, string> = {};
          headers.forEach((h, idx) => {
            obj[h] = vals[idx] || '';
          });
          return obj;
        });
        csvData = {
          headers,
          rows,
          totalRows: rows.length
        };
      }
    }

    // Generate summary
    const summary = `Parsed ${fileType.toUpperCase()} document containing ${rawText.length} characters across ${chunks.length} text chunks. ${
      csvData ? `Structured dataset with ${csvData.totalRows} rows and columns: ${csvData.headers.join(', ')}.` : ''
    }`;

    // Extract topics
    const words = rawText.split(/\s+/).filter((w) => w.length > 4);
    const uniqueTopics = Array.from(new Set(words)).slice(0, 5);

    const doc: ParsedDocument = {
      id: `doc-${Date.now()}`,
      name,
      fileType,
      sizeBytes: rawText.length * 2,
      uploadedAt: new Date().toISOString(),
      rawText,
      chunks,
      summary,
      csvData,
      keyTopics: uniqueTopics.length > 0 ? uniqueTopics : ['General Document', 'Text Analysis']
    };

    this.documents.unshift(doc);
    return doc;
  }

  public async queryDocumentQA(docId: string, question: string): Promise<DocumentQAResponse> {
    const doc = this.documents.find((d) => d.id === docId) || this.documents[0];

    // Find relevant chunks
    const lowerQ = question.toLowerCase();
    const relevantChunks = doc.chunks.filter((chunk) =>
      chunk.toLowerCase().split(/\s+/).some((word) => word.length > 3 && lowerQ.includes(word))
    );
    const selectedChunks = relevantChunks.length > 0 ? relevantChunks.slice(0, 3) : doc.chunks.slice(0, 2);

    let answer = `Based on document "${doc.name}":\n\n${selectedChunks.join('\n\n')}`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
        });
        const res = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `You are an AI Document Q&A Specialist analyzing "${doc.name}".
Context Document Chunks:
${selectedChunks.join('\n---\n')}

User Question: ${question}

Provide a concise, direct, accurate answer using only facts from the document context provided.`
        });
        if (res.text) {
          answer = res.text;
        }
      } catch (err) {
        console.warn('[Gemini Document QA Error - Falling back to extracted context]:', err);
      }
    }

    return {
      documentId: doc.id,
      question,
      answer,
      relevantChunks: selectedChunks,
      timestamp: new Date().toISOString()
    };
  }

  public deleteDocument(id: string): boolean {
    this.documents = this.documents.filter((d) => d.id !== id);
    return true;
  }
}

export const fileParsingService = new FileParsingService();
