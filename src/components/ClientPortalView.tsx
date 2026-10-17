import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  TrendingUp, 
  Globe, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Download,
  Sparkles,
  Layers
} from 'lucide-react';
import { Agency, ClientDomain, TrackedPrompt, AeoArticle } from '../types/aeo';

interface ClientPortalViewProps {
  agency: Agency;
  client: ClientDomain;
  prompts: TrackedPrompt[];
  articles: AeoArticle[];
  onOpenReportModal: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  agency,
  client,
  prompts,
  articles,
  onOpenReportModal,
}) => {
  const clientPrompts = prompts.filter((p) => p.clientId === client.id);
  const clientArticles = articles.filter((a) => a.clientId === client.id);

  const citedPromptsCount = clientPrompts.filter((p) =>
    Object.values(p.engineCitations).some((c) => c.cited)
  ).length;

  return (
    <div className="space-y-8">
      {/* Client Facing Top Hero / White Label Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl border border-white/[0.1] bg-gradient-to-r from-neutral-900/90 via-neutral-900/80 to-blue-950/30 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl backdrop-blur-2xl"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Client Intelligence Portal</span>
            <span aria-hidden="true">·</span>
            <span className="text-blue-400">{agency.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300">Target Market: {client.targetMarket}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {client.name} — Answer Engine Visibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time tracking of how generative AI systems (ChatGPT, Perplexity, Gemini, Google AI Overviews) recommend your brand to enterprise decision-makers in {client.targetMarket}.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenReportModal}
          className="apple-btn-primary px-5 py-2.5 text-xs font-semibold rounded-full flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          <span>Download Audit PDF</span>
        </motion.button>
      </motion.div>

      {/* KPI Cards with Staggered Entrance */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 },
          },
        }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 16, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 26 } },
          }}
          whileHover={{ y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          className="rounded-3xl apple-glass-card p-6 cursor-default"
        >
          <span className="text-xs text-neutral-400 font-medium block mb-1">Global AI Recommendation Share</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white font-mono tracking-tight tabular-nums">{client.citationScore}%</span>
            <span className="text-xs font-semibold text-emerald-400">+14% vs Last Month</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 font-normal">
            Probed across high-intent domestic industry queries
          </p>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 16, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 26 } },
          }}
          whileHover={{ y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          className="rounded-3xl apple-glass-card p-6 cursor-default"
        >
          <span className="text-xs text-neutral-400 font-medium block mb-1">Citations Won in Answers</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white font-mono tracking-tight tabular-nums">
              {citedPromptsCount} <span className="text-sm font-normal text-neutral-400">/ {clientPrompts.length}</span>
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 font-normal">
            Queries where your domain is actively sourced as primary citation
          </p>
        </motion.div>

        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 16, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 26 } },
          }}
          whileHover={{ y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          className="rounded-3xl apple-glass-card p-6 cursor-default"
        >
          <span className="text-xs text-neutral-400 font-medium block mb-1">AEO Content Deliverables</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white font-mono tracking-tight tabular-nums">{clientArticles.length}</span>
            <span className="text-xs text-neutral-400">Native Guides Published</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2 font-normal">
            Connected CMS: <span className="uppercase font-mono text-neutral-300 font-semibold">{client.cmsConfig.provider}</span>
          </p>
        </motion.div>
      </motion.div>

      {/* Engine Citation Breakdown */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Answer Engine Share by Platform</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">ChatGPT 4o</span>
            <span className="text-2xl font-bold text-white font-mono">68%</span>
            <span className="text-[11px] text-emerald-400 block">Top 2 Sourced</span>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Perplexity Pro</span>
            <span className="text-2xl font-bold text-white font-mono">74%</span>
            <span className="text-[11px] text-emerald-400 block">Top Citation Node</span>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Gemini 3.8</span>
            <span className="text-2xl font-bold text-white font-mono">52%</span>
            <span className="text-[11px] text-blue-400 block">Growing Share</span>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-center space-y-1">
            <span className="text-xs text-slate-400 font-semibold block">Google AI Overviews</span>
            <span className="text-2xl font-bold text-white font-mono">61%</span>
            <span className="text-[11px] text-emerald-400 block">Featured Snippets</span>
          </div>
        </div>
      </div>

      {/* Deliverables Showcase */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">Published AEO Content & Schemas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientArticles.map((art) => (
            <div key={art.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                  {art.language} Native
                </span>
                <span className="text-emerald-400 font-semibold text-[11px]">✓ Published to Site</span>
              </div>
              <h4 className="font-bold text-white text-sm line-clamp-2">{art.title}</h4>
              <p className="text-slate-300 leading-relaxed line-clamp-2">{art.summary}</p>

              {art.publishedUrl && (
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400">
                  <span>Target CMS: {art.cmsTarget.toUpperCase()}</span>
                  <a
                    href={art.publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline font-mono flex items-center gap-1"
                  >
                    <span>View Live</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Branding */}
      <div className="text-center py-6 text-xs text-slate-400 border-t border-slate-800/80">
        <span>Answer Engine Intelligence powered by </span>
        <span className="font-semibold text-slate-300">{agency.name}</span>
        <span> · Custom domain: {agency.customDomain || 'aeo.agency.com'}</span>
      </div>
    </div>
  );
};
