import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  Bot,
  Play,
  ArrowUpDown,
  X
} from 'lucide-react';
import { ClientDomain, TrackedPrompt, TargetLanguage, EngineType } from '../types/aeo';
import { CitationTrendsChart } from './CitationTrendsChart';

interface PromptTrackerProps {
  client: ClientDomain;
  prompts: TrackedPrompt[];
  onUpdatePrompt: (prompt: TrackedPrompt) => void;
  onAddPrompt: (newPrompt: Partial<TrackedPrompt>) => void;
  onRunPipelineForPrompt: (promptText: string) => void;
}

export const PromptTracker: React.FC<PromptTrackerProps> = ({
  client,
  prompts,
  onUpdatePrompt,
  onAddPrompt,
  onRunPipelineForPrompt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'cited' | 'gap'>('all');
  const [probingId, setProbingId] = useState<string | null>(null);
  const [inspectPrompt, setInspectPrompt] = useState<TrackedPrompt | null>(null);
  const [inspectEngine, setInspectEngine] = useState<EngineType>('perplexity');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptIntent, setNewPromptIntent] = useState<'commercial' | 'informational' | 'transactional'>('commercial');
  const [newPromptVolume, setNewPromptVolume] = useState<number>(1500);

  // Filter client prompts
  const clientPrompts = prompts.filter((p) => p.clientId === client.id);

  const filteredPrompts = clientPrompts.filter((p) => {
    const matchesSearch = p.promptText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = filterLanguage === 'all' || p.language === filterLanguage;
    const isCitedAny = Object.values(p.engineCitations).some((c) => c.cited);
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'cited'
        ? isCitedAny
        : !isCitedAny || p.citationGapScore >= 50;

    return matchesSearch && matchesLang && matchesStatus;
  });

  const handleRunSingleProbe = async (prompt: TrackedPrompt, engine: EngineType = 'perplexity') => {
    setProbingId(prompt.id);
    try {
      const res = await fetch('/api/aeo/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: prompt.promptText,
          domain: client.domain,
          brandName: client.name,
          targetLanguage: prompt.language,
          engine,
        }),
      });

      const data = await res.json();
      const updatedPrompt: TrackedPrompt = {
        ...prompt,
        lastProbedAt: new Date().toISOString(),
        engineCitations: {
          ...prompt.engineCitations,
          [engine]: {
            cited: data.isCited,
            rank: data.citationRank || 0,
            snippet: data.responseText?.slice(0, 160) || 'Verified citation response.',
            sentiment: data.isCited ? 'positive' : 'absent',
            sources: data.citedSources?.map((s: any) => s.url) || [],
            lastChecked: new Date().toISOString(),
          },
        },
        citationGapScore: data.isCited ? Math.max(5, prompt.citationGapScore - 25) : Math.min(95, prompt.citationGapScore + 15),
      };

      onUpdatePrompt(updatedPrompt);
      if (inspectPrompt?.id === prompt.id) {
        setInspectPrompt(updatedPrompt);
      }
    } catch (e) {
      console.error('Probe failed:', e);
    } finally {
      setProbingId(null);
    }
  };

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptText) return;

    onAddPrompt({
      clientId: client.id,
      promptText: newPromptText,
      language: client.language,
      intent: newPromptIntent,
      searchVolume: newPromptVolume,
      lastProbedAt: new Date().toISOString(),
      citationGapScore: 70,
      status: 'active',
      engineCitations: {
        chatgpt: { cited: false, rank: 0, snippet: 'Awaiting scheduled probe', sentiment: 'absent', lastChecked: new Date().toISOString() },
        perplexity: { cited: false, rank: 0, snippet: 'Awaiting scheduled probe', sentiment: 'absent', lastChecked: new Date().toISOString() },
        gemini: { cited: false, rank: 0, snippet: 'Awaiting scheduled probe', sentiment: 'absent', lastChecked: new Date().toISOString() },
        googleAio: { cited: false, rank: 0, snippet: 'Awaiting scheduled probe', sentiment: 'absent', lastChecked: new Date().toISOString() },
      },
    });

    setShowAddModal(false);
    setNewPromptText('');
  };

  return (
    <div className="space-y-6">
      {/* Header with fluid entrance */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800"
      >
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Citation Radar</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-400">{client.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">{clientPrompts.length} / 500 Monitored Prompts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1.5">
            Prompt & Citation Tracker
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor client brand and domain citations across ChatGPT, Perplexity, Gemini, and Google AI Overviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddModal(true)}
            className="apple-btn-primary px-4 py-2 text-xs rounded-full flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-black" />
            <span>Track New Prompt</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Historical Citation Trends & Sentiment Visualizer (Recharts) with motion card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <CitationTrendsChart client={client} />
      </motion.div>

      {/* Filter and Search Bar (Airbnb pill bar style) with fluid entrance */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2 bg-white/[0.02] border border-white/[0.08] rounded-full text-xs apple-glass"
      >
        <div className="relative flex-1 pl-2">
          <Search className="absolute left-4 top-2.5 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${client.name} queries...`}
            className="w-full bg-transparent border-none py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none font-medium"
          />
        </div>

        <div className="flex items-center gap-2 pr-1">
          <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/[0.08] rounded-full">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus('all')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterStatus === 'all' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({clientPrompts.length})
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus('gap')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterStatus === 'gap' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Citation Gaps
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterStatus('cited')}
              className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterStatus === 'cited' ? 'bg-white text-black font-semibold shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Cited Wins
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* High Density Prompts Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl apple-glass-card overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-neutral-400 font-semibold tracking-wider uppercase text-[10px]">
                <th className="py-3.5 px-5">Tracked Target Query</th>
                <th className="py-3.5 px-3">Search Vol</th>
                <th className="py-3.5 px-3 text-center">ChatGPT</th>
                <th className="py-3.5 px-3 text-center">Perplexity</th>
                <th className="py-3.5 px-3 text-center">Gemini</th>
                <th className="py-3.5 px-3 text-center">Google AIO</th>
                <th className="py-3.5 px-3 text-right">Gap Opportunity</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] font-sans">
              {filteredPrompts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No prompts found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPrompts.map((p) => {
                  const isProbing = probingId === p.id;
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-slate-900/80 transition-colors group cursor-pointer"
                      onClick={() => setInspectPrompt(p)}
                    >
                      {/* Query Text */}
                      <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            {p.language}
                          </span>
                          <span className="font-medium text-white truncate block">
                            {p.promptText}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                          <span className="capitalize">{p.intent}</span>
                          <span aria-hidden="true">·</span>
                          <span>Last probed: {new Date(p.lastProbedAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Volume */}
                      <td className="py-3.5 px-3 font-mono tabular-nums text-slate-300">
                        {p.searchVolume.toLocaleString()}
                      </td>

                      {/* ChatGPT */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded ${
                            p.engineCitations.chatgpt.cited
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-bold'
                              : 'bg-slate-950 text-slate-400'
                          }`}
                        >
                          {p.engineCitations.chatgpt.cited ? `#${p.engineCitations.chatgpt.rank}` : '—'}
                        </span>
                      </td>

                      {/* Perplexity */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded ${
                            p.engineCitations.perplexity.cited
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-bold'
                              : 'bg-slate-950 text-slate-400'
                          }`}
                        >
                          {p.engineCitations.perplexity.cited ? `#${p.engineCitations.perplexity.rank}` : '—'}
                        </span>
                      </td>

                      {/* Gemini */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded ${
                            p.engineCitations.gemini.cited
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-bold'
                              : 'bg-slate-950 text-slate-400'
                          }`}
                        >
                          {p.engineCitations.gemini.cited ? `#${p.engineCitations.gemini.rank}` : '—'}
                        </span>
                      </td>

                      {/* Google AIO */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`inline-block font-mono text-[11px] px-2 py-0.5 rounded ${
                            p.engineCitations.googleAio.cited
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80 font-bold'
                              : 'bg-slate-950 text-slate-400'
                          }`}
                        >
                          {p.engineCitations.googleAio.cited ? `#${p.engineCitations.googleAio.rank}` : '—'}
                        </span>
                      </td>

                      {/* Gap Opportunity Score */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-mono tabular-nums font-bold text-xs">
                          <span
                            className={
                              p.citationGapScore >= 70
                                ? 'text-amber-400'
                                : p.citationGapScore >= 40
                                ? 'text-blue-400'
                                : 'text-emerald-400'
                            }
                          >
                            {p.citationGapScore}%
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRunSingleProbe(p, 'perplexity')}
                            disabled={isProbing}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Probe live engine now"
                          >
                            <RefreshCw className={`h-3.5 w-3.5 ${isProbing ? 'animate-spin text-blue-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => onRunPipelineForPrompt(p.promptText)}
                            className="px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors flex items-center gap-1"
                          >
                            <Bot className="h-3 w-3" />
                            <span>Fix Gap</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Prompt Deep Inspection Modal with Apple Spring Presentation */}
      <AnimatePresence>
        {inspectPrompt && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setInspectPrompt(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl rounded-3xl apple-glass p-6 sm:p-8 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase bg-white/[0.08] text-neutral-300 px-2 py-0.5 rounded-full border border-white/[0.08]">
                    {inspectPrompt.language} Query Diagnostic
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight mt-1.5">{inspectPrompt.promptText}</h3>
                </div>
                <button
                  onClick={() => setInspectPrompt(null)}
                  className="text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Engine Selector */}
              <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 text-xs">
                <span className="text-neutral-400">View Engine Answer:</span>
                {(['chatgpt', 'perplexity', 'gemini', 'googleAio'] as EngineType[]).map((eng) => (
                  <button
                    key={eng}
                    onClick={() => setInspectEngine(eng)}
                    className={`px-3 py-1 rounded-full font-medium transition-colors uppercase text-[11px] cursor-pointer ${
                      inspectEngine === eng ? 'bg-white text-black font-semibold shadow-sm' : 'bg-white/[0.06] text-neutral-400 hover:text-white'
                    }`}
                  >
                    {eng}
                  </button>
                ))}
              </div>

              {/* Engine Diagnostic Snapshot */}
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-black/50 border border-white/[0.08]">
                  <div>
                    <span className="text-neutral-400 block text-[11px]">Citation Status</span>
                    <span
                      className={`font-semibold ${
                        inspectPrompt.engineCitations[inspectEngine].cited ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {inspectPrompt.engineCitations[inspectEngine].cited
                        ? `✓ Cited at Position #${inspectPrompt.engineCitations[inspectEngine].rank}`
                        : '⚠ Brand not cited in AI answer'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-400 block text-[11px]">Last Checked</span>
                    <span className="font-mono text-neutral-300">
                      {new Date(inspectPrompt.engineCitations[inspectEngine].lastChecked).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-black/50 border border-white/[0.08] rounded-2xl space-y-2">
                  <span className="text-neutral-400 text-[11px] uppercase font-semibold">Answer Snippet Preview:</span>
                  <p className="text-neutral-200 leading-relaxed font-mono text-xs">
                    {inspectPrompt.engineCitations[inspectEngine].snippet}
                  </p>
                </div>

                {inspectPrompt.engineCitations[inspectEngine].sources && inspectPrompt.engineCitations[inspectEngine].sources!.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-neutral-400 text-[11px] uppercase font-semibold">Sources Cited by Engine:</span>
                    <div className="space-y-1">
                      {inspectPrompt.engineCitations[inspectEngine].sources!.map((s, i) => (
                        <div key={i} className="text-blue-400 font-mono text-[11px] truncate">
                          • {s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRunSingleProbe(inspectPrompt, inspectEngine)}
                  className="apple-btn-secondary px-3.5 py-2 text-xs rounded-full flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Re-probe {inspectEngine.toUpperCase()}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setInspectPrompt(null);
                    onRunPipelineForPrompt(inspectPrompt.promptText);
                  }}
                  className="apple-btn-primary px-4 py-2 text-xs font-semibold rounded-full flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Bot className="h-3.5 w-3.5" />
                  <span>Generate Optimized Content & Schema</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Track New Prompt Modal with Apple Spring Presentation */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowAddModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl apple-glass p-7 space-y-5 shadow-2xl text-xs"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="text-base font-bold text-white tracking-tight">Track New Target Prompt</h3>
                <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleCreatePrompt} className="space-y-4">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Target Query / Prompt Text</label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${client.language === 'de' ? 'Beste Kubernetes FinOps Tools DACH' : '有田焼 現代作家 急須 おすすめ'}`}
                    value={newPromptText}
                    onChange={(e) => setNewPromptText(e.target.value)}
                    className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Search Intent</label>
                    <select
                      value={newPromptIntent}
                      onChange={(e: any) => setNewPromptIntent(e.target.value)}
                      className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-2.5 text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="commercial">Commercial</option>
                      <option value="informational">Informational</option>
                      <option value="transactional">Transactional</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1">Estimated Monthly Vol</label>
                    <input
                      type="number"
                      value={newPromptVolume}
                      onChange={(e) => setNewPromptVolume(parseInt(e.target.value) || 500)}
                      className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-2.5 text-white focus:outline-none focus:border-white/30 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-neutral-400 hover:text-white cursor-pointer">
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit" 
                    className="apple-btn-primary px-5 py-2 text-xs font-semibold rounded-full shadow-md cursor-pointer"
                  >
                    Start Tracking
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
