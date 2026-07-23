import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Play, 
  Pause, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Terminal, 
  Server, 
  Database, 
  AlertCircle,
  FileText,
  Zap,
  Check
} from 'lucide-react';
import { ScheduledTask } from '../types';

export const TaskScheduler: React.FC = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [redisConnected, setRedisConnected] = useState(false);
  const [queueName, setQueueName] = useState('ai-247-cron-jobs');
  const [loading, setLoading] = useState(true);
  const [selectedTaskForLogs, setSelectedTaskForLogs] = useState<ScheduledTask | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Form State for New Task
  const [newTitle, setNewTitle] = useState('');
  const [newCron, setNewCron] = useState('0 08 * * *');
  const [newAction, setNewAction] = useState('');
  const [newSkillTrigger, setNewSkillTrigger] = useState('/email');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.tasks) {
        setTasks(data.tasks);
        setRedisConnected(data.redisConnected);
        if (data.queue) setQueueName(data.queue);
      }
    } catch (err) {
      console.error('Failed to fetch scheduled tasks:', err);
    } fontally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (id: string) => {
    try {
      const res = await fetch('/api/scheduler/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
        showBanner(`Task status updated: ${data.task.status.toUpperCase()}`);
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleTriggerTask = async (id: string) => {
    try {
      showBanner('Executing task trigger now...');
      const res = await fetch('/api/scheduler/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
        showBanner(`Task executed successfully! Output logged.`);
      }
    } catch (err) {
      console.error('Failed to trigger task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const res = await fetch('/api/scheduler/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showBanner('Task deleted from scheduler queue.');
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAction) return;

    try {
      const res = await fetch('/api/scheduler/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          cronExpression: newCron,
          action: newAction,
          skillTrigger: newSkillTrigger,
          type: 'cron'
        })
      });
      const data = await res.json();
      if (data.success && data.task) {
        setTasks((prev) => [...prev, data.task]);
        setIsCreating(false);
        setNewTitle('');
        setNewAction('');
        showBanner('New scheduled task created in queue.');
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const showBanner = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const scheduledCount = tasks.filter((t) => t.status === 'scheduled').length;
  const pausedCount = tasks.filter((t) => t.status === 'paused').length;

  return (
    <div id="task-scheduler-container" className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold">
                PART 4 IMPLEMENTATION
              </span>
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> ACTIVE
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              Persistent Task Scheduler (BullMQ + Redis)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              24/7 background worker queue orchestrating scheduled email blasts, Notion syncs, and Instagram content releases with persistent execution logs.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={fetchTasks}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Queue</span>
            </button>

            <button
              onClick={() => setIsCreating(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Scheduled Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-4 py-2.5 rounded-2xl text-xs font-mono flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        </div>
      )}

      {/* Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Total Jobs</span>
            <div className="text-lg font-bold text-white font-mono">{tasks.length}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Active Cron Jobs</span>
            <div className="text-lg font-bold text-emerald-400 font-mono">{scheduledCount}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-800 flex items-center justify-center shrink-0">
            <Pause className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Paused Jobs</span>
            <div className="text-lg font-bold text-amber-400 font-mono">{pausedCount}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 flex items-center justify-center shrink-0">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase">Queue Engine</span>
            <div className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${redisConnected ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
              {redisConnected ? 'BullMQ (Redis Connected)' : 'BullMQ In-Memory Worker'}
            </div>
          </div>
        </div>

      </div>

      {/* New Task Creator Modal / Form */}
      {isCreating && (
        <form onSubmit={handleCreateTask} className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-5 space-y-4 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" /> Schedule New Automated Job
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Job Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Daily Executive Sync Email"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Cron Schedule Expression</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCron}
                  onChange={(e) => setNewCron(e.target.value)}
                  placeholder="0 08 * * *"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                />
                <select
                  onChange={(e) => setNewCron(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-2 focus:outline-none"
                >
                  <option value="0 08 * * *">Daily 08:00 AM</option>
                  <option value="0 */6 * * *">Every 6 Hours</option>
                  <option value="0 23 * * *">Nightly 11:00 PM</option>
                  <option value="0 06 * * 1">Every Mon 06:00 AM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Action Description</label>
              <input
                type="text"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Draft and send executive status email..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-400">Skill Handler Trigger</label>
              <select
                value={newSkillTrigger}
                onChange={(e) => setNewSkillTrigger(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none"
              >
                <option value="/email">/email (Google Gmail)</option>
                <option value="/docs">/docs (Google Docs)</option>
                <option value="/schedule">/schedule (Google Calendar)</option>
                <option value="/sheets">/sheets (Google Sheets)</option>
                <option value="/notion">/notion (Notion Sync)</option>
                <option value="/instagram">/instagram (Instagram Planner)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2 rounded-xl transition-all shadow-md shadow-emerald-950 cursor-pointer"
            >
              Add Job to Scheduler Queue
            </button>
          </div>
        </form>
      )}

      {/* Scheduled Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            Background Job Queue ({tasks.length})
          </h3>
          <span className="text-[11px] font-mono text-slate-500">BullMQ Queue: {queueName}</span>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    task.status === 'scheduled' 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      : task.status === 'paused'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-blue-950 text-blue-300 border-blue-800'
                  }`}>
                    {task.status.toUpperCase()}
                  </span>

                  <span className="font-mono text-xs font-bold text-cyan-300 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded">
                    {task.cronExpression}
                  </span>

                  {task.skillTrigger && (
                    <span className="font-mono text-[11px] text-indigo-300 bg-indigo-950/80 border border-indigo-800 px-2 py-0.5 rounded">
                      {task.skillTrigger}
                    </span>
                  )}

                  <h4 className="text-sm font-bold text-white">{task.title}</h4>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{task.action}</p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
                  <span>Next: {new Date(task.nextRunAt).toLocaleString()}</span>
                  {task.lastRunAt && <span>Last: {new Date(task.lastRunAt).toLocaleString()}</span>}
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                
                {/* Instant Trigger */}
                <button
                  onClick={() => handleTriggerTask(task.id)}
                  title="Run Job Immediately"
                  className="bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800 p-2 rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Run Now</span>
                </button>

                {/* Pause / Resume */}
                <button
                  onClick={() => handleToggleTask(task.id)}
                  title={task.status === 'scheduled' ? 'Pause Job' : 'Resume Job'}
                  className={`p-2 rounded-xl text-xs flex items-center gap-1 border transition-all cursor-pointer ${
                    task.status === 'scheduled'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800 hover:bg-amber-900'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900'
                  }`}
                >
                  {task.status === 'scheduled' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{task.status === 'scheduled' ? 'Pause' : 'Resume'}</span>
                </button>

                {/* View Logs */}
                <button
                  onClick={() => setSelectedTaskForLogs(task)}
                  title="View Execution Logs"
                  className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 p-2 rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logs</span>
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  title="Delete Job"
                  className="bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/80 p-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Execution Logs Modal */}
      {selectedTaskForLogs && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Execution Logs: {selectedTaskForLogs.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTaskForLogs(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5 font-mono text-xs text-emerald-400 max-h-60 overflow-y-auto">
              {selectedTaskForLogs.logs && selectedTaskForLogs.logs.length > 0 ? (
                selectedTaskForLogs.logs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed border-b border-slate-900/50 pb-1">
                    {log}
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic">No execution logs recorded yet.</div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedTaskForLogs(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
