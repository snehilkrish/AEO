import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { 
  TrendingUp, 
  Globe2, 
  AlertTriangle, 
  Calendar, 
  Plus, 
  ExternalLink, 
  Bot, 
  Zap, 
  Check, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { Agency, ClientDomain, TrackedPrompt } from '../types/aeo';

// Apple fluid spring & stagger animation variants
const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const appleSpringCardVariants: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 320,
      damping: 26,
    },
  },
};

const listItemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

interface DashboardOverviewProps {
  agency: Agency;
  clients: ClientDomain[];
  prompts: TrackedPrompt[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onNavigateTo: (view: 'pipeline' | 'tracker' | 'content' | 'rag' | 'client_portal' | 'billing') => void;
  onAddClient: (newClient: Partial<ClientDomain>) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  agency,
  clients,
  prompts,
  selectedClientId,
  onSelectClient,
  onNavigateTo,
  onAddClient,
}) => {
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientDomain, setNewClientDomain] = useState('');
  const [newClientLanguage, setNewClientLanguage] = useState<'de' | 'ja' | 'pt-br' | 'es'>('de');
  const [newClientIndustry, setNewClientIndustry] = useState('');
  const [newClientCms, setNewClientCms] = useState<'wordpress' | 'shopify' | 'webflow'>('wordpress');

  const avgCitationRate = Math.round(
    clients.reduce((acc, c) => acc + c.citationScore, 0) / (clients.length || 1)
  );
  const totalPrompts = clients.reduce((acc, c) => acc + c.promptsCount, 0);
  const criticalGapsCount = prompts.filter((p) => p.citationGapScore >= 60).length;

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName || !newClientDomain) return;

    onAddClient({
      name: newClientName,
      domain: newClientDomain.replace(/^https?:\/\//, ''),
      language: newClientLanguage,
      industry: newClientIndustry || 'B2B Software & E-Commerce',
      targetMarket: newClientLanguage === 'de' ? 'DACH Region' : newClientLanguage === 'ja' ? 'Japan' : newClientLanguage === 'pt-br' ? 'Brazil' : 'Spain',
      citationScore: 25,
      promptsCount: 12,
      promptsLimit: 500,
      monthlyProbesCount: 15,
      entityMap: {
        canonicalName: newClientName,
        wikidataUri: 'https://www.wikidata.org/wiki/Q' + Math.floor(1000000 + Math.random() * 9000000),
        sameAsUrls: [`https://${newClientDomain}`],
        localRegistrations: {},
      },
      cmsConfig: {
        provider: newClientCms,
        endpointUrl: `https://${newClientDomain}/api/aeo-webhook`,
        autoPublish: false,
      },
      systemPrompt: `You are the AEO strategist for ${newClientName}. Maintain native fluency and entity consistency.`,
      activePipelineStatus: 'idle',
    });

    setShowAddClientModal(false);
    setNewClientName('');
    setNewClientDomain('');
    setNewClientIndustry('');
  };

  return (
    <div className="space-y-10">
      {/* Apple-style Top Bar & Breadcrumb */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            <span>Portfolio Intelligence</span>
            <span className="text-neutral-600">·</span>
            <span className="text-white font-medium">{agency.name}</span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400 capitalize">{agency.planTier} Plan ({clients.length}/{agency.clientSeatsLimit} Seats)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white">
            Overview
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigateTo('client_portal')}
            className="apple-btn-secondary px-4 py-2 text-xs rounded-full flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="h-3.5 w-3.5 text-neutral-400" />
            <span>Client View</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAddClientModal(true)}
            className="apple-btn-primary px-4 py-2 text-xs rounded-full flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 text-black" />
            <span>Add Client Domain</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Apple Health / Watch style KPI Cards with Staggered Entrance */}
      <motion.div 
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* KPI 1 */}
        <motion.div 
          variants={appleSpringCardVariants}
          whileHover={{ y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          whileTap={{ scale: 0.985 }}
          className="rounded-3xl apple-glass-card p-6 flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium">Citation Share</span>
            <div className="h-7 w-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white font-mono tracking-tight tabular-nums">{avgCitationRate}%</span>
              <span className="text-xs font-semibold text-emerald-400">+11.4% MoM</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-normal">Across ChatGPT, Perplexity & Gemini</p>
          </div>
        </motion.div>

        {/* KPI 2 */}
        <motion.div 
          variants={appleSpringCardVariants}
          whileHover={{ y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          whileTap={{ scale: 0.985 }}
          className="rounded-3xl apple-glass-card p-6 flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium">Active Prompts</span>
            <div className="h-7 w-7 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Globe2 className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white font-mono tracking-tight tabular-nums">{totalPrompts}</span>
              <span className="text-xs text-neutral-500 font-mono">/ 2,000 capacity</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-normal">German, Japanese, Portuguese, Spanish</p>
          </div>
        </motion.div>

        {/* KPI 3 */}
        <motion.div 
          variants={appleSpringCardVariants}
          whileHover={{ y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          whileTap={{ scale: 0.985 }}
          className="rounded-3xl apple-glass-card p-6 flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium">Citation Gaps</span>
            <div className="h-7 w-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white font-mono tracking-tight tabular-nums">{criticalGapsCount}</span>
              <span className="text-xs font-semibold text-amber-400">High Opportunity</span>
            </div>
            <p className="text-[11px] text-neutral-400 font-normal">Ready for autonomous article creation</p>
          </div>
        </motion.div>

        {/* KPI 4 */}
        <motion.div 
          variants={appleSpringCardVariants}
          whileHover={{ y: -4, scale: 1.015, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          whileTap={{ scale: 0.985 }}
          className="rounded-3xl apple-glass-card p-6 flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="font-medium">Weekly Cron</span>
            <div className="h-7 w-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-white tracking-tight">Monday 04:00 UTC</div>
            <p className="text-[11px] text-neutral-400 font-normal">Automated batch scan scheduled</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Airbnb-style Client Domain Cards with Fluid Motion */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Managed Client Domains</h2>
            <p className="text-xs text-neutral-400 mt-0.5">Switch active focus and execute autonomous agent workflows.</p>
          </div>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => onNavigateTo('pipeline')}
            className="text-xs text-white hover:text-neutral-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Open Multi-Agent Pipeline</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {clients.map((client) => {
            const isSelected = client.id === selectedClientId;
            return (
              <motion.div
                key={client.id}
                variants={appleSpringCardVariants}
                whileHover={{ 
                  y: -3, 
                  scale: 1.008, 
                  transition: { type: 'spring', stiffness: 380, damping: 26 } 
                }}
                whileTap={{ scale: 0.99 }}
                onClick={() => onSelectClient(client.id)}
                className={`cursor-pointer rounded-3xl p-6 transition-colors duration-200 ${
                  isSelected
                    ? 'bg-neutral-900/90 border border-white/[0.25] shadow-2xl ring-1 ring-white/10'
                    : 'apple-glass-card hover:border-white/[0.15]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg tracking-tight">{client.name}</h3>
                      <span className="text-[10px] font-mono uppercase bg-white/[0.08] text-neutral-300 px-2 py-0.5 rounded-full border border-white/[0.08]">
                        {client.language}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
                          Active Focus
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-neutral-400 flex items-center gap-2 font-mono">
                      <span>{client.domain}</span>
                      <span className="text-neutral-600">·</span>
                      <span className="font-sans text-neutral-400">{client.targetMarket}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-3xl font-bold font-mono text-white tabular-nums tracking-tight">
                      {client.citationScore}%
                    </div>
                    <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Citation Score</div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="block text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Tracked Queries</span>
                    <span className="font-mono font-medium text-neutral-200">{client.promptsCount} / {client.promptsLimit}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">CMS Integration</span>
                    <span className="capitalize font-mono text-neutral-200">{client.cmsConfig.provider}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Entity Mapping</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span>Wikidata Bound</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between text-xs pt-4 border-t border-white/[0.06]">
                  <span className="text-[11px] text-neutral-400">
                    Industry: {client.industry}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectClient(client.id);
                      onNavigateTo('tracker');
                    }}
                    className="text-xs text-white hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>View Prompts</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* High-Impact Citation Gaps Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-3xl apple-glass-card p-8 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span>Highest Impact Citation Gaps to Win</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">Queries where competitors currently own the generative AI answer.</p>
          </div>
          <button
            onClick={() => onNavigateTo('tracker')}
            className="text-xs text-white hover:text-neutral-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>View All ({prompts.length})</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="divide-y divide-white/[0.06]"
        >
          {prompts
            .filter((p) => p.citationGapScore >= 50)
            .slice(0, 4)
            .map((p) => (
              <motion.div 
                key={p.id} 
                variants={listItemVariants}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs group"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase bg-white/[0.08] text-neutral-300 px-2 py-0.5 rounded-full border border-white/[0.06]">
                      {p.language}
                    </span>
                    <span className="font-medium text-white group-hover:text-blue-300 transition-colors">
                      {p.promptText}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-3">
                    <span>Vol: {p.searchVolume.toLocaleString()} / mo</span>
                    <span>·</span>
                    <span>Dominant Rival: {p.targetCompetitor || 'Market Portal'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-amber-400 text-sm">{p.citationGapScore}/100</span>
                    <span className="block text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Gap Opportunity</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      onSelectClient(p.clientId);
                      onNavigateTo('pipeline');
                    }}
                    className="apple-btn-secondary px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    <span>Run Pipeline</span>
                  </motion.button>
                </div>
              </motion.div>
            ))}
        </motion.div>
      </motion.div>

      {/* Add Client Domain Modal with Apple Fluid Sheet Presentation */}
      <AnimatePresence>
        {showAddClientModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setShowAddClientModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl apple-glass p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h3 className="text-xl font-bold tracking-tight text-white">Add Client Domain</h3>
                <button
                  onClick={() => setShowAddClientModal(false)}
                  className="text-neutral-400 hover:text-white text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="space-y-5 text-xs">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1.5">Company / Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zenit Medizintechnik GmbH"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-3 text-white focus:outline-none focus:border-white/30 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1.5">Client Root Domain</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. zenit-medizintechnik.de"
                    value={newClientDomain}
                    onChange={(e) => setNewClientDomain(e.target.value)}
                    className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-3 text-white focus:outline-none focus:border-white/30 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 font-medium mb-1.5">Target Language Market</label>
                    <select
                      value={newClientLanguage}
                      onChange={(e: any) => setNewClientLanguage(e.target.value)}
                      className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="de">German (DACH)</option>
                      <option value="ja">Japanese (Japan)</option>
                      <option value="pt-br">Portuguese (Brazil)</option>
                      <option value="es">Spanish (Spain/LATAM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-medium mb-1.5">Target CMS</label>
                    <select
                      value={newClientCms}
                      onChange={(e: any) => setNewClientCms(e.target.value)}
                      className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="wordpress">WordPress (REST API)</option>
                      <option value="shopify">Shopify (Blog Engine)</option>
                      <option value="webflow">Webflow (CMS API)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1.5">Industry / Niche</label>
                  <input
                    type="text"
                    placeholder="e.g. Medical Imaging Devices & Regulatory Compliance"
                    value={newClientIndustry}
                    onChange={(e) => setNewClientIndustry(e.target.value)}
                    className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-3 text-white focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddClientModal(false)}
                    className="px-5 py-2.5 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="apple-btn-primary px-6 py-2.5 rounded-full text-xs font-semibold shadow-md cursor-pointer"
                  >
                    Create Client & Initialize AEO
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
