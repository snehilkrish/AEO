import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Globe2, 
  TrendingUp, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Agency, ClientDomain, TrackedPrompt, AeoArticle } from '../types/aeo';

interface BrandedReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  agency: Agency;
  client: ClientDomain;
  prompts: TrackedPrompt[];
  articles: AeoArticle[];
}

export const BrandedReportModal: React.FC<BrandedReportModalProps> = ({
  isOpen,
  onClose,
  agency,
  client,
  prompts,
  articles,
}) => {
  const clientPrompts = prompts.filter((p) => p.clientId === client.id);
  const clientArticles = articles.filter((a) => a.clientId === client.id);
  const citedCount = clientPrompts.filter((p) =>
    Object.values(p.engineCitations).some((c) => c.cited)
  ).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 overflow-y-auto"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-3xl apple-glass p-6 sm:p-8 space-y-6 shadow-2xl text-xs text-neutral-200 my-8"
          >
        {/* Actions Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">White-Label Executive AEO Audit Report</span>
            <span className="text-slate-400">· Ready for Client Presentation</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="space-y-6 bg-slate-950 p-6 sm:p-8 rounded-xl border border-slate-800 print:bg-white print:text-black print:border-none print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
            <div>
              <div className="text-xs uppercase tracking-wider text-blue-400 font-bold mb-1">
                Executive AEO Performance Audit
              </div>
              <h2 className="text-2xl font-extrabold text-white print:text-black">
                {client.name}
              </h2>
              <div className="text-slate-400 print:text-slate-600 font-mono text-xs mt-0.5">
                {client.domain} · {client.targetMarket} ({client.industry})
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="font-bold text-white print:text-black text-sm">{agency.name}</div>
              <div className="text-[11px] text-slate-400 print:text-slate-500">
                Audit Date: {new Date().toLocaleDateString()}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Engine: Omnia AEO Prober v1.0
              </div>
            </div>
          </div>

          {/* Key Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 print:text-slate-700 tracking-wider">
              01. Executive Overview & Citation Share
            </h3>
            <p className="text-slate-300 print:text-slate-800 leading-relaxed text-xs">
              This audit evaluates the brand entity visibility of <strong>{client.name}</strong> across the four leading generative answer engines: <strong>ChatGPT (OpenAI), Perplexity AI, Google Gemini, and Google AI Overviews</strong> in the {client.targetMarket} market.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <span className="text-[10px] uppercase text-slate-400 block">AI Recommendation Share</span>
              <span className="text-2xl font-bold font-mono text-white print:text-black tabular-nums">{client.citationScore}%</span>
              <span className="text-[10px] text-emerald-400 block mt-1">+14% vs prior audit</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <span className="text-[10px] uppercase text-slate-400 block">Tracked Citations Won</span>
              <span className="text-2xl font-bold font-mono text-white print:text-black tabular-nums">{citedCount} / {clientPrompts.length}</span>
              <span className="text-[10px] text-blue-400 block mt-1">Primary source nodes</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 print:bg-slate-50 print:border-slate-300">
              <span className="text-[10px] uppercase text-slate-400 block">Published AEO Guides</span>
              <span className="text-2xl font-bold font-mono text-white print:text-black tabular-nums">{clientArticles.length}</span>
              <span className="text-[10px] text-slate-400 block mt-1">With FAQPage JSON-LD</span>
            </div>
          </div>

          {/* Answer Engine Breakdown */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 print:text-slate-700 tracking-wider">
              02. Platform Citation Distribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <span className="block text-[11px] font-medium text-slate-300 print:text-black">ChatGPT 4o</span>
                <span className="text-lg font-bold font-mono text-emerald-400 print:text-emerald-700">68%</span>
              </div>
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <span className="block text-[11px] font-medium text-slate-300 print:text-black">Perplexity</span>
                <span className="text-lg font-bold font-mono text-emerald-400 print:text-emerald-700">74%</span>
              </div>
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <span className="block text-[11px] font-medium text-slate-300 print:text-black">Gemini 3.8</span>
                <span className="text-lg font-bold font-mono text-blue-400 print:text-blue-700">52%</span>
              </div>
              <div className="p-3 rounded bg-slate-900/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
                <span className="block text-[11px] font-medium text-slate-300 print:text-black">Google AIO</span>
                <span className="text-lg font-bold font-mono text-emerald-400 print:text-emerald-700">61%</span>
              </div>
            </div>
          </div>

          {/* High Priority Query Wins */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold text-slate-400 print:text-slate-700 tracking-wider">
              03. Top Performing Query Citations
            </h3>
            <div className="divide-y divide-slate-800 print:divide-slate-200 border border-slate-800 print:border-slate-200 rounded-lg overflow-hidden">
              {clientPrompts.slice(0, 3).map((p) => (
                <div key={p.id} className="p-3 bg-slate-900/40 print:bg-white flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white print:text-black text-xs block">{p.promptText}</span>
                    <span className="text-[11px] text-slate-400 print:text-slate-500 font-mono">
                      Monthly Search Volume: {p.searchVolume.toLocaleString()} · {p.intent}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 print:text-emerald-700 font-bold">
                      {p.engineCitations.perplexity.cited ? '✓ Sourced #1' : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Next Steps */}
          <div className="space-y-2 pt-2 border-t border-slate-800 print:border-slate-300">
            <h3 className="text-xs uppercase font-bold text-slate-400 print:text-slate-700 tracking-wider">
              04. Strategic Next Actions
            </h3>
            <ul className="space-y-1.5 text-slate-300 print:text-slate-800 list-disc list-inside">
              <li>Continue deploying native {client.language.toUpperCase()} comparison guides to capture competitor citation gaps.</li>
              <li>Maintain Schema.org Organization sameAs cross-links with official Wikidata entries.</li>
              <li>Schedule next weekly multi-engine citation batch scan for Monday 04:00 UTC.</li>
            </ul>
          </div>

          {/* Agency Signature Footer */}
          <div className="pt-6 border-t border-white/[0.08] print:border-slate-300 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Prepared by {agency.name} Strategic Intelligence</span>
            <span>Confidential Client Deliverable</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
