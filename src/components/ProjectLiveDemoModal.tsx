import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Monitor, Tablet, Smartphone, RotateCcw, ExternalLink, 
  Github, CheckCircle2, Play, Sparkles, Terminal, 
  TrendingUp, DollarSign, Users, Zap, RefreshCw,
  Copy, Check, FileText, ShieldCheck, Cpu, Code2
} from 'lucide-react';
import { Project } from '../types';

interface ProjectLiveDemoModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function ProjectLiveDemoModal({ project, isOpen, onClose }: ProjectLiveDemoModalProps) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [activeTab, setActiveTab] = useState<'demo' | 'telemetry' | 'specs'>('demo');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Simulation state for Apex
  const [apexTimeframe, setApexTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('30d');
  const [apexRevenue, setApexRevenue] = useState(128450);
  const [apexTransactions, setApexTransactions] = useState(1429);
  const [apexAlert, setApexAlert] = useState<string | null>(null);

  // Simulation state for Scribe
  const [scribePrompt, setScribePrompt] = useState('Summarize architecture review and key deliverables.');
  const [scribeOutput, setScribeOutput] = useState<string | null>(null);
  const [isScribeLoading, setIsScribeLoading] = useState(false);

  // Generic simulation
  const [simSuccess, setSimSuccess] = useState(false);
  const [logs, setLogs] = useState<Array<{ time: string; text: string; ok?: boolean }>>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && project) {
      const now = new Date().toLocaleTimeString();
      setLogs([
        { time: now, text: `Mounted interactive sandbox for "${project.title}"`, ok: true },
        { time: now, text: `Framework: React + Vite • Mode: Live Virtual DOM`, ok: true },
        { time: now, text: `Network connected • Latency 16ms`, ok: true }
      ]);
      setSimSuccess(false);
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), text: `Sandbox reloaded • Cache cleared`, ok: true }
      ]);
    }, 500);
  };

  const handleApexSale = () => {
    const amount = Math.floor(Math.random() * 200) + 49;
    setApexRevenue(prev => prev + amount);
    setApexTransactions(prev => prev + 1);
    setApexAlert(`+$${amount}.00 New Customer Order`);
    setLogs(prev => [
      ...prev,
      { time: new Date().toLocaleTimeString(), text: `Stripe webhook received: payment_intent.succeeded (+$${amount})`, ok: true }
    ]);
    setTimeout(() => setApexAlert(null), 3000);
  };

  const handleRunScribe = () => {
    setIsScribeLoading(true);
    setScribeOutput(null);
    setLogs(prev => [
      ...prev,
      { time: new Date().toLocaleTimeString(), text: `Processing semantic analysis (${scribePrompt.length} chars)...` }
    ]);
    setTimeout(() => {
      setIsScribeLoading(false);
      setScribeOutput(
        `• Core Architecture: Event-driven microservices achieved 99.98% availability.\n• Performance: P95 latency reduced by 42ms with edge caching.\n• Action Item: Deploy Redis replica cluster and verify automated failover.`
      );
      setLogs(prev => [
        ...prev,
        { time: new Date().toLocaleTimeString(), text: `AI summarization complete in 380ms`, ok: true }
      ]);
    }, 750);
  };

  const handleGenericSim = () => {
    setSimSuccess(true);
    setLogs(prev => [
      ...prev,
      { time: new Date().toLocaleTimeString(), text: `Simulated live data stream for ${project.title} • 200 OK`, ok: true }
    ]);
  };

  const isApex = project.title.toLowerCase().includes('apex');
  const isScribe = project.title.toLowerCase().includes('scribe');

  const getContainerWidth = () => {
    if (device === 'mobile') return 'max-w-[390px] border-[5px] border-slate-800 rounded-[36px]';
    if (device === 'tablet') return 'max-w-[720px] border-[3px] border-slate-800 rounded-[24px]';
    return 'w-full rounded-2xl border border-white/10';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-100"
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-950/90 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Play className="w-4 h-4 fill-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-tight">{project.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400">{project.category} • Interactive Demonstration</p>
            </div>
          </div>

          {/* Viewport switch */}
          <div className="flex items-center gap-1 bg-slate-900 border border-white/10 p-1 rounded-xl">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                device === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                device === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-all ${
                device === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Reload sandbox"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-950/60 border-b border-white/5 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('demo')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'demo' ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Demonstration</span>
            </button>
            <button
              onClick={() => setActiveTab('telemetry')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'telemetry' ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console Logs ({logs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'specs' ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Architecture & Tech</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive Simulator Active</span>
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40 flex items-center justify-center min-h-[460px]">
          {activeTab === 'demo' && (
            <div className={`transition-all duration-300 flex flex-col bg-slate-900 overflow-hidden shadow-2xl ${getContainerWidth()} h-[540px]`}>
              {/* Simulated browser address bar */}
              <div className="px-4 py-2 bg-slate-950 border-b border-white/10 flex items-center gap-2 text-[11px] select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 px-3 py-0.5 rounded-md bg-slate-900 border border-white/10 flex items-center gap-1.5 text-slate-400 font-mono truncate">
                  <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">https://demo.portfolio.dev/{project.id}</span>
                </div>
              </div>

              {/* Interactive body */}
              <div className="flex-1 overflow-y-auto p-5 bg-slate-900 text-slate-100 flex flex-col justify-between">
                {isApex ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div>
                        <h4 className="font-bold text-white text-base">Apex Revenue Stream</h4>
                        <p className="text-xs text-slate-400">Interactive financial performance dashboard</p>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-white/10 text-xs">
                        {(['24h', '7d', '30d', '1y'] as const).map(tf => (
                          <button
                            key={tf}
                            onClick={() => setApexTimeframe(tf)}
                            className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                              apexTimeframe === tf ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {tf.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence>
                      {apexAlert && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2"
                        >
                          <Zap className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                          <span>{apexAlert}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span>Total Revenue</span>
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-xl font-black text-white">${apexRevenue.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>+14.8% growth</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span>Transactions</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div className="text-xl font-black text-white">{apexTransactions.toLocaleString()}</div>
                        <div className="text-[10px] text-indigo-400 font-semibold mt-1">99.98% Success</div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                          <span>Active Subscribers</span>
                          <Users className="w-3.5 h-3.5 text-violet-400" />
                        </div>
                        <div className="text-xl font-black text-white">1,084</div>
                        <div className="text-[10px] text-violet-400 font-semibold mt-1">Avg MRR: $118/mo</div>
                      </div>
                    </div>

                    {/* Chart simulator */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-white/10">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-bold text-slate-300">Revenue Velocity Chart</span>
                        <span className="text-[10px] text-slate-500 font-mono">Live Sync</span>
                      </div>
                      <div className="h-24 flex items-end gap-1.5 pt-2">
                        {[45, 60, 52, 78, 90, 70, 85, 95, 110, 130, 120, 140].map((val, idx) => (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                            <div 
                              className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t group-hover:from-indigo-400 group-hover:to-violet-400 transition-all duration-300 relative"
                              style={{ height: `${(val / 140) * 100}%` }}
                            />
                            <span className="text-[8px] font-mono text-slate-500">M{idx + 1}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-300">Test live payment webhook flow</span>
                      <button
                        onClick={handleApexSale}
                        className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Simulate Sale ($49 - $249)</span>
                      </button>
                    </div>
                  </div>
                ) : isScribe ? (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-white/10 flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">Scribe AI Document Assistant</h4>
                        <p className="text-xs text-slate-400">Intelligent summarization and action tracker</p>
                      </div>
                      <span className="text-xs font-mono text-violet-400">Model: Gemini Flash</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-violet-400" />
                        <span>Input Document Text</span>
                      </label>
                      <textarea
                        rows={3}
                        value={scribePrompt}
                        onChange={(e) => setScribePrompt(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500 font-sans"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleRunScribe}
                          disabled={isScribeLoading || !scribePrompt.trim()}
                          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-600/30 disabled:opacity-50"
                        >
                          {isScribeLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Run AI Summarization</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-950/80 rounded-xl border border-white/10">
                      <span className="text-xs font-bold text-slate-300 block mb-2">Simulated AI Output:</span>
                      {scribeOutput ? (
                        <div className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line p-2.5 bg-slate-900 rounded-lg border border-white/5">
                          {scribeOutput}
                        </div>
                      ) : (
                        <div className="py-6 text-center text-slate-500 text-xs">
                          Click "Run AI Summarization" to trigger simulated live AI output.
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-bold text-white text-lg">{project.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <span className="text-xs font-bold text-indigo-400 block mb-1">Architecture Highlights</span>
                        <p className="text-xs text-slate-300">Clean modular structure, real-time reactive state, and sub-second load times.</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5">
                        <span className="text-xs font-bold text-emerald-400 block mb-1">Interactive Sandbox</span>
                        <p className="text-xs text-slate-300">Full device responsive rendering with simulated live backend event stream.</p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-bold text-white block">Run Live Diagnostic Test</span>
                        <span className="text-[11px] text-slate-400">Emulate end-to-end component interaction flow.</span>
                      </div>
                      <button
                        onClick={handleGenericSim}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold cursor-pointer transition-all shrink-0"
                      >
                        Execute Flow
                      </button>
                    </div>

                    {simSuccess && (
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Interactive test completed with 0 errors! Check the Console Logs tab.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'telemetry' && (
            <div className="w-full max-w-3xl bg-slate-950 rounded-2xl border border-white/10 p-5 font-mono text-xs shadow-2xl h-[460px] flex flex-col">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="font-bold text-slate-300">Live Demonstration Console</span>
                <button
                  onClick={() => setLogs([])}
                  className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  Clear Logs
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-[11px]">
                    <span className="text-slate-500 shrink-0">[{log.time}]</span>
                    <span className={log.ok ? 'text-emerald-400 font-bold' : 'text-indigo-400 font-bold'}>
                      {log.ok ? 'SUCCESS' : 'INFO'}
                    </span>
                    <span className="text-slate-300 break-all">{log.text}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-500">
                <span>Process: #{project.id}-runner</span>
                <span className="text-emerald-400 font-semibold">Ready</span>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="w-full max-w-3xl bg-slate-900 rounded-2xl border border-white/10 p-6 space-y-4 max-h-[460px] overflow-y-auto text-xs">
              <div>
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <span>Technical Stack & Integration</span>
                </h4>
                <p className="text-slate-400 mt-1">Core packages and architecture used in {project.title}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {project.tags.map(t => (
                  <span key={t} className="px-3 py-1 bg-slate-800 text-indigo-300 rounded-lg font-mono border border-indigo-500/20">
                    {t}
                  </span>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-slate-400">Sample Implementation</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`// ${project.title} live module\nexport const ${project.title.replace(/\s+/g, '')} = () => <InteractiveDemo />;`);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-indigo-200 font-mono text-[11px] overflow-x-auto">
                  {`import { ${project.title.replace(/\s+/g, '')} } from '@app/projects';\n\n// Mount with responsive viewport and live event stream\n<${project.title.replace(/\s+/g, '')} mode="interactive" telemetry={true} />`}
                </pre>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                {project.github && project.github !== '#' && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white"
                  >
                    <Github className="w-4 h-4" />
                    <span>View GitHub Repository</span>
                  </a>
                )}
                {project.demo && project.demo !== '#' && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open External Live URL</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Demonstrating: <strong className="text-white">{project.title}</strong> ({project.category})
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all cursor-pointer"
          >
            Close Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
