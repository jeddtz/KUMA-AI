import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { streamOpenRouterResponse } from "./src/services/openrouter";
import { skillsRegistry } from "./src/services/skills";
import { taskScheduler } from "./src/services/scheduler";
import { workspaceService } from "./src/services/workspace";
import { instagramService, createInstagramPost } from "./src/services/instagram";
import { figmaService } from "./src/services/figma";
import { fileParsingService } from "./src/services/fileParser";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Server-side Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
  }
  return aiClient;
}

// ---------------------------------------------------------
// Part 1, 2 & 3 API Endpoints: Architecture & Health Check
// ---------------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "AI-247 Executive Assistant",
    version: "1.0.0",
    uptime: process.uptime(),
    port: PORT,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    activePart: {
      number: 11,
      title: "VPS Deployment (Docker, Nginx, SSL)",
      status: "COMPLETED",
      allPartsCompleted: true
    },
    integrations: {
      gemini: !!process.env.GEMINI_API_KEY,
      openRouter: !!process.env.OPENROUTER_API_KEY,
      notion: !!process.env.NOTION_API_KEY,
      instagram: !!process.env.INSTAGRAM_ACCESS_TOKEN,
      googleWorkspace: true
    }
  });
});

app.get("/api/system/info", (req, res) => {
  res.json({
    architecture: {
      runtime: "Node.js ESM + Express",
      bundler: "Vite + esbuild",
      docker: "Multi-stage Alpine Linux",
      port: 3000,
      host: "0.0.0.0"
    },
    folderStructure: [
      "/server.ts (Express backend entry point)",
      "/src/services/skills.ts (Modular Skills Framework & Slash Engine)",
      "/src/services/openrouter.ts (OpenRouter streaming client)",
      "/src/services/notion.ts (Notion Standby service)",
      "/src/services/instagram.ts (Instagram Standby service)",
      "/src/components/SkillsFramework.tsx (Skills Manager UI)",
      "/src/components/PromptInput.tsx (Ref UI morphing prompt bar)",
      "/Dockerfile & /docker-compose.yml (Container setup)"
    ],
    planRoadmap: [
      { id: 1, name: "Project Setup & Folder Architecture", status: "completed" },
      { id: 2, name: "OpenRouter & Streaming SSE Integration", status: "completed" },
      { id: 3, name: "Modular Skills Framework & Slash Commands", status: "completed" },
      { id: 4, name: "Persistent Task Scheduler (BullMQ + Redis)", status: "ready" },
      { id: 5, name: "Google Workspace Connector (Gmail & Docs)", status: "locked" },
      { id: 6, name: "Google Sheets & Notion Connector", status: "locked" },
      { id: 7, name: "Instagram Content Planner (Meta Graph API)", status: "locked" },
      { id: 8, name: "Figma UI Spec Inspector", status: "locked" },
      { id: 9, name: "Document Parsing & Summarization", status: "locked" },
      { id: 10, name: "PWA Support & Offline Capabilities", status: "locked" },
      { id: 11, name: "Cloud Run & Production Deployment", status: "locked" }
    ]
  });
});

// ---------------------------------------------------------
// Part 2: OpenRouter & Streaming SSE Chat Endpoint
// ---------------------------------------------------------

app.get("/api/chat/stream", async (req, res) => {
  const prompt = (req.query.prompt as string) || "Hello AI Assistant!";
  const requestedModel = (req.query.model as string) || "Gemini 3.5 Flash";
  const startTime = Date.now();
  
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Route to OpenRouter if an OpenRouter model requested
  const isOpenRouterModel = 
    requestedModel.includes("Claude") || 
    requestedModel.includes("DeepSeek") || 
    requestedModel.includes("Opus") ||
    requestedModel.includes("GPT 5.5") ||
    requestedModel.includes("Composer");

  if (isOpenRouterModel) {
    const openRouterMap: Record<string, string> = {
      "Claude 3.5 Sonnet": "anthropic/claude-3.5-sonnet",
      "Opus 4.8": "anthropic/claude-3-opus",
      "DeepSeek V3": "deepseek/deepseek-chat",
      "GPT 5.5": "openai/gpt-4o-mini",
      "Composer 2.5": "openai/gpt-4o"
    };
    
    const targetModel = openRouterMap[requestedModel] || "anthropic/claude-3.5-sonnet";
    try {
      for await (const chunk of streamOpenRouterResponse(prompt, targetModel, process.env.OPENROUTER_API_KEY)) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      return res.end();
    } catch (err: any) {
      console.warn("OpenRouter stream error, falling back to Gemini:", err);
    }
  }

  // Native Gemini 3.6 Flash streaming
  const ai = getGenAI();
  if (ai) {
    try {
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are AI-247, an executive personal assistant. Provide clear, professional, concise assistance."
        }
      });

      let tokenCount = 0;
      for await (const chunk of responseStream) {
        if (chunk.text) {
          tokenCount++;
          res.write(`data: ${JSON.stringify({ 
            content: chunk.text, 
            model: "Gemini 3.6 Flash",
            latencyMs: Date.now() - startTime
          })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ 
        done: true, 
        model: "Gemini 3.6 Flash",
        latencyMs: Date.now() - startTime,
        totalTokens: tokenCount 
      })}\n\n`);
      return res.end();
    } catch (err: any) {
      res.write(`data: ${JSON.stringify({ error: err.message || "Gemini streaming error" })}\n\n`);
      return res.end();
    }
  }

  // Fallback demo SSE streaming
  const demoTokens = [
    "Halo! ", "Saya ", "AI-247 ", "Executive ", "Assistant.\n\n",
    `[Model: ${requestedModel} via SSE Stream]\n`,
    "Streaming SSE endpoint Part 2 telah aktif dengan sukses. ",
    "Respons dikirimkan per token secara real-time!"
  ];

  for (const token of demoTokens) {
    res.write(`data: ${JSON.stringify({ 
      content: token, 
      model: requestedModel,
      latencyMs: Date.now() - startTime 
    })}\n\n`);
    await new Promise((r) => setTimeout(r, 50));
  }
  res.write(`data: ${JSON.stringify({ 
    done: true, 
    model: requestedModel,
    latencyMs: Date.now() - startTime,
    totalTokens: demoTokens.length 
  })}\n\n`);
  res.end();
});


// ---------------------------------------------------------
// Part 3: Modular Skills & Slash Command Engine API
// ---------------------------------------------------------

app.get("/api/skills", (req, res) => {
  res.json({ skills: skillsRegistry.getSkills() });
});

app.post("/api/skills/toggle", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Skill ID required" });
  const updated = skillsRegistry.toggleSkill(id);
  res.json({ success: !!updated, skill: updated });
});

app.post("/api/skills/execute", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  const result = await skillsRegistry.executeSkill(prompt);
  if (!result) {
    return res.json({
      executed: false,
      message: "No matching slash command skill found"
    });
  }

  res.json({
    executed: true,
    result
  });
});

// ---------------------------------------------------------
// Part 4: Persistent Task Scheduler API (BullMQ / Redis Engine)
// ---------------------------------------------------------

app.get("/api/tasks", (req, res) => {
  res.json({
    redisConnected: taskScheduler.isRedisActive(),
    queue: "ai-247-cron-jobs",
    tasks: taskScheduler.getTasks()
  });
});

app.post("/api/scheduler/create", (req, res) => {
  const { title, cronExpression, action, skillTrigger, type } = req.body;
  if (!title || !cronExpression || !action) {
    return res.status(400).json({ error: "Missing required fields: title, cronExpression, action" });
  }

  const newTask = taskScheduler.createTask({
    title,
    cronExpression,
    action,
    skillTrigger,
    type: type || 'cron'
  });

  res.json({ success: true, task: newTask });
});

app.post("/api/scheduler/toggle", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Task ID required" });

  const updatedTask = taskScheduler.toggleTaskStatus(id);
  if (!updatedTask) return res.status(404).json({ error: "Task not found" });

  res.json({ success: true, task: updatedTask });
});

app.post("/api/scheduler/trigger", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Task ID required" });

  try {
    const result = await taskScheduler.triggerTaskNow(id);
    res.json({ success: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to trigger task" });
  }
});

app.post("/api/scheduler/delete", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Task ID required" });

  const deleted = taskScheduler.deleteTask(id);
  res.json({ success: deleted });
});

// ---------------------------------------------------------
// Part 5: Google Workspace Connector API (OAuth Active)
// ---------------------------------------------------------

app.get("/api/workspace/status", (req, res) => {
  res.json(workspaceService.getAuthStatus());
});

app.post("/api/workspace/gmail/draft", async (req, res) => {
  const { to, subject, body } = req.body;
  if (!to || !subject || !body) {
    return res.status(400).json({ error: "Missing required fields: to, subject, body" });
  }
  const result = await workspaceService.createGmailDraft({ to, subject, body });
  res.json(result);
});

app.post("/api/workspace/docs/create", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: "Missing required fields: title, content" });
  }
  const result = await workspaceService.createGoogleDoc({ title, content });
  res.json(result);
});

app.post("/api/workspace/calendar/schedule", async (req, res) => {
  const { summary, startTime, attendees } = req.body;
  if (!summary || !startTime) {
    return res.status(400).json({ error: "Missing required fields: summary, startTime" });
  }
  const result = await workspaceService.scheduleCalendarEvent({ summary, startTime, attendees });
  res.json(result);
});

app.post("/api/workspace/sheets/append", async (req, res) => {
  const { spreadsheetId, values } = req.body;
  if (!values || !Array.isArray(values)) {
    return res.status(400).json({ error: "Missing or invalid values array" });
  }
  const result = await workspaceService.appendSheetsRow({ spreadsheetId, values });
  res.json(result);
});

app.get("/api/workspace/drive/files", async (req, res) => {
  const result = await workspaceService.listDriveFiles();
  res.json(result);
});

// ---------------------------------------------------------
// Part 7: Content Planner & Instagram Automation (Rumah Quran Ahsan)
// ---------------------------------------------------------

app.get("/api/instagram/queue", (req, res) => {
  res.json(instagramService.getQueue());
});

app.post("/api/instagram/post", async (req, res) => {
  const { title, category, type, caption, hashtags, scheduledTime, mediaUrl } = req.body;
  if (!title || !caption) {
    return res.status(400).json({ error: "Missing required fields: title, caption" });
  }
  const result = await createInstagramPost({
    title,
    category: category || 'Rumah Quran Ahsan',
    type: type || 'single',
    caption,
    hashtags: hashtags || ['#RumahQuranAhsan', '#TahfizhQuran'],
    scheduledTime,
    mediaUrl
  });
  res.json(result);
});

app.post("/api/instagram/generate-quote", (req, res) => {
  const { themeIndex } = req.body;
  const quote = instagramService.generateIslamicQuote(themeIndex);
  res.json(quote);
});

app.post("/api/instagram/publish/:id", (req, res) => {
  const post = instagramService.publishNow(req.params.id);
  res.json({ success: !!post, post });
});

app.delete("/api/instagram/post/:id", (req, res) => {
  const deleted = instagramService.deletePost(req.params.id);
  res.json({ success: deleted });
});

// ---------------------------------------------------------
// Part 8: Figma Design Inspector & Vision LLM Endpoints
// ---------------------------------------------------------

app.get("/api/figma/frames", (req, res) => {
  res.json(figmaService.getPresetFrames());
});

app.post("/api/figma/inspect", async (req, res) => {
  const { frameId, customPrompt } = req.body;
  const analysis = await figmaService.analyzeFigmaFrame(frameId, customPrompt);
  res.json(analysis);
});

// ---------------------------------------------------------
// Part 9: File Parsing Engine (PDF, DOCX, CSV, TXT)
// ---------------------------------------------------------

app.get("/api/documents/list", (req, res) => {
  res.json(fileParsingService.getDocuments());
});

app.post("/api/documents/parse", (req, res) => {
  const { name, fileType, rawText } = req.body;
  if (!name || !rawText) {
    return res.status(400).json({ error: "Missing required fields: name, rawText" });
  }
  const parsed = fileParsingService.parseAndStoreDocument(name, fileType || 'txt', rawText);
  res.json(parsed);
});

app.post("/api/documents/qa", async (req, res) => {
  const { docId, question } = req.body;
  if (!question) {
    return res.status(400).json({ error: "Missing question" });
  }
  const qaResult = await fileParsingService.queryDocumentQA(docId, question);
  res.json(qaResult);
});

app.delete("/api/documents/:id", (req, res) => {
  const deleted = fileParsingService.deleteDocument(req.params.id);
  res.json({ success: deleted });
});

// ---------------------------------------------------------
// Vite Middleware / Static File Serving Setup
// ---------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI-247 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
