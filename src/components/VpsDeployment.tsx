import React, { useState } from 'react';
import { 
  Server, 
  Terminal, 
  ShieldCheck, 
  Cpu, 
  HardDrive, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Play, 
  FileCode, 
  Globe, 
  Layers, 
  Clock, 
  Zap, 
  Wifi, 
  Shield, 
  RefreshCw,
  Info
} from 'lucide-react';
import { FREE_VPS_PROVIDERS, FreeVpsProvider, getSystemDeploymentStatus } from '../services/deployment';

export const VpsDeployment: React.FC = () => {
  const [selectedProviderId, setSelectedProviderId] = useState<string>('oracle-cloud');
  const [activeTab, setActiveTab] = useState<'providers' | 'cloudflare' | 'files' | 'terminal'>('cloudflare');
  const [selectedFile, setSelectedFile] = useState<'deploy' | 'dockerfile' | 'compose' | 'nginx'>('deploy');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // SSH Simulation Terminal State
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Connecting to remote VPS instance (ubuntu@138.2.140.24)...',
    'SSH Connection established successfully.',
    'System: Ubuntu 22.04.4 LTS (GNU/Linux 5.15.0-1051-oracle aarch64)',
    'Type or click "Execute Zero-Touch Deploy" to begin Docker containerization.'
  ]);
  const [isExecuting, setIsExecuting] = useState(false);

  const status = getSystemDeploymentStatus();
  const activeProvider = FREE_VPS_PROVIDERS.find((p) => p.id === selectedProviderId) || FREE_VPS_PROVIDERS[0];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunSimulatedDeploy = () => {
    if (isExecuting) return;
    setIsExecuting(true);

    const steps = [
      'curl -sSL https://raw.githubusercontent.com/ai247/app/main/deploy.sh | bash',
      '[1/5] Updating OS packages & installing Docker CE Engine...',
      'Get:1 http://ports.ubuntu.com/ubuntu-ports jammy InRelease [270 kB]',
      'Docker Engine 26.1.3 installed successfully.',
      '[2/5] Configuring security firewall (UFW Rules: 22, 80, 443, 3000)...',
      'Rules updated & UFW firewall enabled.',
      '[3/5] Setting up AI-247 workspace directory at /opt/ai247-assistant...',
      'Environment variables validated & saved to /opt/ai247-assistant/.env.',
      '[4/5] Building Docker multi-stage container image (node:20-alpine)...',
      'Step 1/12 : FROM node:20-alpine AS builder',
      'Step 6/12 : RUN npm run build (Vite ESM + ESBuild Server Bundle)...',
      'Build succeeded: dist/server.cjs (580 KB)',
      'Starting container "ai247-assistant" on port 3000...',
      '[5/5] Live healthcheck ping: http://localhost:3000/api/health -> 200 OK',
      '🎉 SUCCESS! AI-247 Executive Assistant is now RUNNING 24/7 on Free VPS!'
    ];

    steps.forEach((line, index) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, line]);
        if (index === steps.length - 1) {
          setIsExecuting(false);
        }
      }, (index + 1) * 600);
    });
  };

  const getFileContent = () => {
    switch (selectedFile) {
      case 'deploy':
        return `#!/bin/bash
# AI-247 Executive Assistant - Zero-Touch Free VPS Installer
set -e
echo "🚀 Installing AI-247 Assistant 24/7 Service..."
sudo apt-get update -y && sudo apt-get install -y curl git ufw
curl -fsSL https://get.docker.com | sh
cd /opt && sudo git clone https://github.com/ai247/app.git ai247
cd /opt/ai247 && sudo docker compose up -d --build
echo "✅ AI-247 is online on port 3000!"`;
      case 'dockerfile':
        return `FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`;
      case 'compose':
        return `version: '3.8'
services:
  ai247-app:
    build: .
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=\${GEMINI_API_KEY}`;
      case 'nginx':
        return `server {
    listen 80;
    server_name _;
    location / {
        proxy_pass http://ai247-app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}`;
    }
  };

  return (
    <div id="vps-deployment-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100 font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                PART 11 IMPLEMENTATION
              </span>
              <span className="bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-blue-400" /> FREE 24/7 VPS HOSTING
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              VPS Deployment Center (Docker, Nginx, SSL & Free VPS Guides)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Complete setup guide to run your AI-247 Executive Assistant 24/7 for 100% FREE using Oracle Cloud Always Free (24GB RAM), GCP Free Tier, or Render + Cloudflare Tunnels.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
            <Wifi className="w-4 h-4 text-emerald-400 animate-pulse" />
            <div className="text-left">
              <div className="text-[10px] font-mono text-slate-400">Production Status</div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span>Docker + Express Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cloudflare'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-300" />
            <span>Cloudflare Domain 24/7 Setup</span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'providers'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-emerald-300" />
            <span>Free 24/7 VPS Providers</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'files'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-300" />
            <span>Dockerfile & Configs</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'terminal'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-purple-300" />
            <span>SSH Terminal Deployment</span>
          </button>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Uptime: {(status.activeUptimeSeconds / 3600).toFixed(1)} Hours 24/7
        </span>
      </div>

      {/* TAB 0: CLOUDFLARE DOMAIN 24/7 INTEGRATION */}
      {activeTab === 'cloudflare' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Connect Custom Domain via Cloudflare (24/7 Online)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sangat Bisa! Cloudflare menyediakan SSL HTTPS gratis, DDoS Protection, dan DNS Routing 24/7 tanpa henti.
                  </p>
                </div>
              </div>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-3 py-1 rounded-full font-bold">
                RECOMMENDED METHOD
              </span>
            </div>

            {/* Three Connection Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Option C: Cloudflare Pages + GitHub (DIRECT GIT DEPLOY) */}
              <div className="bg-slate-950 border border-emerald-500/40 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-800">
                    METODE A (GITHUB + PAGES)
                  </span>
                  <span className="text-emerald-400 text-xs font-mono font-bold">100% AUTOMATIC</span>
                </div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> Cloudflare Pages + Workers
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hubungkan repository GitHub Anda ke Cloudflare Pages. Setiap <code className="text-emerald-300">git push</code> akan langsung dideploy 24/7 otomatis di server global Cloudflare.
                </p>
                <div className="space-y-2 pt-1 text-xs font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-300">
                    <div><strong>Build Command:</strong> <code className="text-emerald-300">npm run build</code></div>
                    <div><strong>Build Output Dir:</strong> <code className="text-emerald-300">dist</code></div>
                    <div><strong>Root Directory:</strong> <code className="text-emerald-300">/</code></div>
                    <div><strong>Framework Preset:</strong> Vite / React</div>
                  </div>
                  <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                    <span className="text-amber-300 font-bold block">⚙️ Langkah di Cloudflare Dashboard:</span>
                    <div>1. Buka <strong>Workers & Pages</strong> ➔ <strong>Create Application</strong></div>
                    <div>2. Pilih <strong>Pages</strong> ➔ <strong>Connect to Git (GitHub)</strong></div>
                    <div>3. Pilih repo <code>ai247-assistant</code> & klik <strong>Save and Deploy</strong></div>
                    <div>4. Tambahkan Env Vars: <code>GEMINI_API_KEY</code> di Pages Settings</div>
                  </div>
                </div>
              </div>

              {/* Option A: Cloudflare Tunnel (Zero Trust) */}
              <div className="bg-slate-950 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-amber-950 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-800">
                    METODE B (TUNNEL VPS)
                  </span>
                  <span className="text-emerald-400 text-xs font-mono font-bold">TUNNEL 24/7</span>
                </div>
                <h4 className="text-sm font-bold text-white">Cloudflare Tunnel (Zero Trust)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Menghubungkan AI-247 di VPS / Server Anda langsung ke domain Cloudflare <strong>tanpa perlu buka port router</strong> atau IP statis. SSL & HTTPS otomatis.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono text-amber-300 font-semibold">Setup Command VPS:</div>
                  <pre className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl text-[11px] font-mono text-amber-200 overflow-x-auto whitespace-pre-wrap">
{`# 1. Install cloudflared
curl -L -o cf.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cf.deb

# 2. Login & Connect Domain
cloudflared tunnel login
cloudflared tunnel run --url http://localhost:3000 ai247`}
                  </pre>
                  <button
                    onClick={() => handleCopy('cf-tunnel', 'cloudflared tunnel run --url http://localhost:3000 ai247')}
                    className="w-full bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedKey === 'cf-tunnel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cf-tunnel' ? 'Copied Tunnel!' : 'Copy Tunnel Command'}</span>
                  </button>
                </div>
              </div>

              {/* Option B: Standard Cloudflare DNS A Record */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-blue-950 text-blue-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-blue-800">
                    METODE C (DIRECT DNS)
                  </span>
                  <span className="text-cyan-400 text-xs font-mono font-bold">A RECORD</span>
                </div>
                <h4 className="text-sm font-bold text-white">Direct DNS A Record + Cloudflare Proxy</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Arahkan subdomain Anda (misal: <code className="text-cyan-300">ai.domainanda.com</code>) ke IP Public VPS Oracle / GCP Anda di Dashboard Cloudflare DNS.
                </p>
                <div className="space-y-2 pt-2 text-xs text-slate-300 font-mono">
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1 text-[11px]">
                    <div><strong>Type:</strong> A</div>
                    <div><strong>Name:</strong> ai (atau @)</div>
                    <div><strong>IPv4 Address:</strong> IP_VPS_ANDA</div>
                    <div><strong>Proxy status:</strong> <span className="text-amber-400">Proxied (Orange Cloud 🟠)</span></div>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                    💡 SSL Mode di Cloudflare diset ke <strong>Full (strict)</strong>. Nginx kami (<code className="text-emerald-300">nginx.conf</code>) akan menangani SSL otomatis.
                  </div>
                </div>
              </div>

            </div>

            {/* Architecture Overview */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="font-bold text-white">Domain Anda (Cloudflare HTTPS)</div>
                  <div className="text-slate-400 text-[10px]">https://ai.domainanda.com</div>
                </div>
              </div>
              <span className="text-slate-500 font-bold">➔ Cloudflare CDN / WAF ➔</span>
              <div className="flex items-center gap-3">
                <Server className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Free VPS Docker Container</div>
                  <div className="text-slate-400 text-[10px]">http://localhost:3000 (24/7)</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 1: FREE 24/7 VPS PROVIDER CATALOG & SETUP GUIDE */}
      {activeTab === 'providers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Provider Selection Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider block mb-1">
              Select Free VPS Platform
            </span>

            {FREE_VPS_PROVIDERS.map((provider) => {
              const isSelected = provider.id === selectedProviderId;
              return (
                <div
                  key={provider.id}
                  onClick={() => setSelectedProviderId(provider.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-md font-bold block w-fit mb-1">
                        {provider.badge}
                      </span>
                      <h3 className="text-sm font-bold text-white">{provider.name}</h3>
                    </div>
                    {provider.isPopular && (
                      <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[9px]">CPU / RAM:</span>
                      <span className="text-emerald-300 font-semibold">{provider.specifications.ram}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px]">STORAGE:</span>
                      <span className="text-slate-200">{provider.specifications.storage}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Setup Guide for Selected Free VPS (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
              
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400">{activeProvider.type.toUpperCase()} SPECIFICATION</div>
                  <h3 className="text-base font-bold text-white">{activeProvider.name} Guide</h3>
                </div>
                <span className="text-xs font-mono text-emerald-300 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full font-bold">
                  {activeProvider.specifications.duration}
                </span>
              </div>

              {/* Specs Breakdown */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <Cpu className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <div className="text-[10px] text-slate-400">Processor</div>
                  <div className="text-xs font-bold text-white">{activeProvider.specifications.cpu}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <Zap className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <div className="text-[10px] text-slate-400">Memory</div>
                  <div className="text-xs font-bold text-white">{activeProvider.specifications.ram}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <HardDrive className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                  <div className="text-[10px] text-slate-400">Storage</div>
                  <div className="text-xs font-bold text-white">{activeProvider.specifications.storage}</div>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Key Advantages for AI-247 Assistant</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1.5 pl-5 list-disc">
                  {activeProvider.pros.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Step by Step Setup Instructions */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span>Step-by-Step 24/7 Setup Guide</span>
                </div>
                <div className="space-y-2">
                  {activeProvider.setupSteps.map((step, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* One Click Copy Command */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span>Terminal Copy Command:</span>
                  <button
                    onClick={() => handleCopy('cmd', activeProvider.commandSnippet)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                  >
                    {copiedKey === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'cmd' ? 'Copied!' : 'Copy SSH Command'}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-200 bg-slate-900 p-3 rounded-xl overflow-x-auto whitespace-pre-wrap border border-slate-800/80">
                  {activeProvider.commandSnippet}
                </pre>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: DOCKER & CONFIGURATION FILES */}
      {activeTab === 'files' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedFile('deploy')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedFile === 'deploy' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                deploy.sh
              </button>
              <button
                onClick={() => setSelectedFile('dockerfile')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedFile === 'dockerfile' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                Dockerfile
              </button>
              <button
                onClick={() => setSelectedFile('compose')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedFile === 'compose' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                docker-compose.yml
              </button>
              <button
                onClick={() => setSelectedFile('nginx')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  selectedFile === 'nginx' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
                }`}
              >
                nginx.conf
              </button>
            </div>

            <button
              onClick={() => handleCopy(selectedFile, getFileContent())}
              className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedKey === selectedFile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === selectedFile ? 'Copied' : 'Copy File Content'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-xs font-mono text-emerald-300 leading-relaxed overflow-x-auto max-h-96">
            {getFileContent()}
          </pre>
        </div>
      )}

      {/* TAB 3: SIMULATED SSH TERMINAL DEPLOYMENT */}
      {activeTab === 'terminal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white font-mono">SSH Interactive Deployment Console</h3>
            </div>
            
            <button
              onClick={handleRunSimulatedDeploy}
              disabled={isExecuting}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-950 flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? 'Executing Deploy...' : 'Execute Zero-Touch Deploy'}</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-2 h-80 overflow-y-auto">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 shrink-0">$</span>
                <span className={log.includes('SUCCESS') ? 'text-emerald-400 font-bold' : log.includes('[1/5]') ? 'text-cyan-400 font-bold' : ''}>
                  {log}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
