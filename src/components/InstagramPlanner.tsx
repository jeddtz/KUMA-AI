import React, { useState, useEffect } from 'react';
import { 
  Instagram, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Clock, 
  Send, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  Image as ImageIcon, 
  Tag, 
  ShieldAlert,
  Share2,
  Bookmark
} from 'lucide-react';
import { InstagramPostPayload, IslamicQuoteTheme } from '../services/instagram';

export const InstagramPlanner: React.FC = () => {
  const [queue, setQueue] = useState<InstagramPostPayload[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'queue' | 'generator'>('queue');

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Rumah Quran Ahsan' | 'Executive AI-247' | 'Motivation' | 'Tajweed & Tahfizh'>('Rumah Quran Ahsan');
  const [type, setType] = useState<'reel' | 'carousel' | 'single' | 'story'>('single');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('#RumahQuranAhsan #TahfizhQuran #MurajaahDaily #IslamicQuotes');
  const [scheduledTime, setScheduledTime] = useState(new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16));
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80');

  // Generated Quote State
  const [generatedQuote, setGeneratedQuote] = useState<IslamicQuoteTheme | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await fetch('/api/instagram/queue');
      const data = await res.json();
      setQueue(data);
    } catch (err) {
      console.error('Failed to fetch Instagram queue:', err);
    }
  };

  const handleGenerateQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/instagram/generate-quote', { method: 'POST' });
      const data: IslamicQuoteTheme = await res.json();
      setGeneratedQuote(data);

      // Pre-fill form with generated Islamic quote
      setTitle(`Ayat & Reflections: ${data.theme}`);
      setCategory('Rumah Quran Ahsan');
      setCaption(`✨ ${data.theme} - Rumah Quran Ahsan ✨\n\n"${data.verseOrHadith}"\n\nMeaning: ${data.translation}\n\nReflection:\n${data.reflection}\n\nMari jadikan Al-Qur'an sebagai pedoman harian kita.`);
      setHashtags(data.suggestedHashtags.map(h => `#${h.replace(/^#/, '')}`).join(' '));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !caption) return;
    setLoading(true);
    try {
      const tagsArray = hashtags.split(/\s+/).filter(Boolean);
      const res = await fetch('/api/instagram/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          type,
          caption,
          hashtags: tagsArray,
          scheduledTime,
          mediaUrl
        })
      });
      await res.json();
      fetchQueue();
      // Reset form
      setTitle('');
      setCaption('');
      setActiveTab('queue');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishNow = async (id: string) => {
    setLoading(true);
    try {
      await fetch(`/api/instagram/publish/${id}`, { method: 'POST' });
      fetchQueue();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await fetch(`/api/instagram/post/${id}`, { method: 'DELETE' });
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="instagram-planner-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-pink-950 text-pink-300 border border-pink-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                PART 7 IMPLEMENTATION
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> RUMAH QURAN AHSAN
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Instagram className="w-5 h-5 text-pink-400" />
              Content Planner & Instagram Automation (Rumah Quran Ahsan)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Automated daily Instagram post pipeline for Rumah Quran Ahsan. Generates Quranic quotes, Tahfizh motivation, Tajweed tips, and schedules releases directly.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGenerateQuote}
              disabled={loading}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-pink-950/50 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-pink-200" />
              <span>Generate Quranic Quote</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Generator (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Post Creator Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-400" />
                Create Instagram Content
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Post Scheduler</span>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Post Title / Topic</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Tips Tartil Al-Qur'an Bagi Pemula"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Category</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="Rumah Quran Ahsan">Rumah Quran Ahsan</option>
                    <option value="Tajweed & Tahfizh">Tajweed & Tahfizh</option>
                    <option value="Motivation">Motivation</option>
                    <option value="Executive AI-247">Executive AI-247</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400">Type</label>
                  <select
                    value={type}
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                  >
                    <option value="single">Single Post</option>
                    <option value="carousel">Carousel Slide</option>
                    <option value="reel">Instagram Reel</option>
                    <option value="story">Story</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Caption & Reflection</label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write instagram caption..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500 font-sans leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Hashtags</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-pink-400 font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Scheduled Time</label>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">Image Poster URL</label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-pink-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{loading ? 'Adding to Queue...' : 'Add to Content Planner Queue'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Interactive Content Board & Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Active Queue Board */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-bold text-white">Rumah Quran Ahsan Content Queue</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                {queue.length} Scheduled Posts
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {queue.map((post) => (
                <div key={post.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 relative hover:border-slate-700 transition-all">
                  
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="bg-pink-950 border border-pink-800 text-pink-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                      <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full">
                        {post.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.status === 'published' ? (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Published
                        </span>
                      ) : (
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" /> Scheduled
                        </span>
                      )}

                      <button
                        onClick={() => post.id && handleDeletePost(post.id)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-all cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="flex gap-4">
                    {post.mediaUrl && (
                      <div className="w-20 h-20 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shrink-0">
                        <img 
                          src={post.mediaUrl} 
                          alt={post.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}

                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{post.title}</h4>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>
                      <div className="text-[10px] font-mono text-pink-400 truncate pt-0.5">
                        {Array.isArray(post.hashtags) ? post.hashtags.join(' ') : post.hashtags}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Schedule Footer */}
                  <div className="flex items-center justify-between border-t border-slate-900 pt-2 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {post.scheduledTime ? new Date(post.scheduledTime).toLocaleString() : 'Immediate Queue'}
                    </span>

                    {post.status !== 'published' && (
                      <button
                        onClick={() => post.id && handlePublishNow(post.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Publish Now</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Standby & Meta API Instructions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Meta Graph API Direct Publishing Connection
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                Standby + Queue Ready
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Posts are managed in the AI-247 Rumah Quran Ahsan planner queue. To sync live automated posting to Instagram, define <code className="text-pink-300 bg-slate-950 px-1 py-0.5 rounded">INSTAGRAM_ACCESS_TOKEN</code> and <code className="text-pink-300 bg-slate-950 px-1 py-0.5 rounded">INSTAGRAM_ACCOUNT_ID</code> in <code className="text-slate-200">.env</code>.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
