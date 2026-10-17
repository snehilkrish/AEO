import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, ViewMode } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardOverview } from './components/DashboardOverview';
import { MultiAgentPipeline } from './components/MultiAgentPipeline';
import { PromptTracker } from './components/PromptTracker';
import { ContentEngine } from './components/ContentEngine';
import { KnowledgeBaseRAG } from './components/KnowledgeBaseRAG';
import { ClientPortalView } from './components/ClientPortalView';
import { BillingPanel } from './components/BillingPanel';
import { AdminConsole } from './components/AdminConsole';
import { BrandedReportModal } from './components/BrandedReportModal';

import { 
  initialAgency, 
  initialClients, 
  initialPrompts, 
  initialArticles, 
  initialKnowledgeDocs, 
  initialUsageMetric 
} from './data/mockData';
import { 
  Agency, 
  ClientDomain, 
  TrackedPrompt, 
  AeoArticle, 
  KnowledgeDoc, 
  UsageMetric, 
  PlanTier 
} from './types/aeo';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('landing');
  const [agency, setAgency] = useState<Agency>(initialAgency);
  const [clients, setClients] = useState<ClientDomain[]>(initialClients);
  const [selectedClientId, setSelectedClientId] = useState<string>('client_cloudkite');
  const [prompts, setPrompts] = useState<TrackedPrompt[]>(initialPrompts);
  const [articles, setArticles] = useState<AeoArticle[]>(initialArticles);
  const [usage, setUsage] = useState<UsageMetric>(initialUsageMetric);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Theme Management (Light Theme by Default, Dark Theme as Option)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('omnia_aeo_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light'; // Default is strictly light theme as requested
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    try {
      localStorage.setItem('omnia_aeo_theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Handler: Add new client domain
  const handleAddClient = (newClientData: Partial<ClientDomain>) => {
    const newClient: ClientDomain = {
      id: `client_${Date.now()}`,
      agencyId: agency.id,
      name: newClientData.name || 'New Client GmbH',
      domain: newClientData.domain || 'example.de',
      language: newClientData.language || 'de',
      targetMarket: newClientData.targetMarket || 'DACH Region',
      industry: newClientData.industry || 'Technology',
      citationScore: 20,
      promptsCount: 1,
      promptsLimit: 500,
      monthlyProbesCount: 1,
      entityMap: newClientData.entityMap || {
        canonicalName: newClientData.name || 'New Client',
        wikidataUri: 'https://www.wikidata.org/wiki/Q1000001',
        sameAsUrls: [],
        localRegistrations: {},
      },
      cmsConfig: newClientData.cmsConfig || {
        provider: 'wordpress',
        endpointUrl: `https://${newClientData.domain}/api/aeo`,
        autoPublish: false,
      },
      systemPrompt: `You are the AEO strategist for ${newClientData.name}.`,
      activePipelineStatus: 'idle',
    };

    setClients((prev) => [...prev, newClient]);
    setSelectedClientId(newClient.id);
  };

  // Handler: Update tracked prompt after live probe
  const handleUpdatePrompt = (updatedPrompt: TrackedPrompt) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === updatedPrompt.id ? updatedPrompt : p))
    );
    // increment usage metric
    setUsage((prev) => ({
      ...prev,
      probesUsed: prev.probesUsed + 1,
    }));
  };

  // Handler: Add new prompt to monitor
  const handleAddPrompt = (newPromptData: Partial<TrackedPrompt>) => {
    const newPrompt: TrackedPrompt = {
      id: `p_${Date.now()}`,
      clientId: newPromptData.clientId || selectedClientId,
      promptText: newPromptData.promptText || 'New query',
      language: newPromptData.language || selectedClient.language,
      intent: newPromptData.intent || 'commercial',
      searchVolume: newPromptData.searchVolume || 1000,
      lastProbedAt: new Date().toISOString(),
      citationGapScore: 65,
      status: 'active',
      engineCitations: newPromptData.engineCitations || {
        chatgpt: { cited: false, rank: 0, snippet: 'Awaiting scheduled probe', sentiment: 'absent', lastChecked: new Date().toISOString() },
        perplexity: { cited: false, rank: 0, snippet: 'Awaiting scheduled probe', sentiment: 'absent', lastChecked: new Date().toISOString() },
        gemini: { cited: false, rank: 0, snippet: 'Awaiting scheduled probe', sentiment: 'absent', lastChecked: new Date().toISOString() },
        googleAio: { cited: false, rank: 0, snippet: 'Awaiting scheduled probe', sentiment: 'absent', lastChecked: new Date().toISOString() },
      },
    };

    setPrompts((prev) => [newPrompt, ...prev]);
    setClients((prev) =>
      prev.map((c) => (c.id === selectedClientId ? { ...c, promptsCount: c.promptsCount + 1 } : c))
    );
  };

  // Handler: Navigate to pipeline with prefilled prompt
  const handleRunPipelineForPrompt = (_promptText: string) => {
    setCurrentView('pipeline');
  };

  // Handler: Add newly generated article
  const handleArticleGenerated = (newArticle: AeoArticle) => {
    setArticles((prev) => [newArticle, ...prev]);
    setUsage((prev) => ({
      ...prev,
      articlesGenerated: prev.articlesGenerated + 1,
    }));
  };

  // Handler: Publish article to CMS
  const handlePublishArticle = async (articleId: string) => {
    try {
      const art = articles.find((a) => a.id === articleId);
      if (!art) return;

      const res = await fetch('/api/aeo/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          cmsType: art.cmsTarget,
          targetUrl: `https://${selectedClient.domain}`,
        }),
      });
      const data = await res.json();

      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleId
            ? { ...a, status: 'published', publishedUrl: data.publishedUrl }
            : a
        )
      );
    } catch {
      setArticles((prev) =>
        prev.map((a) =>
          a.id === articleId
            ? { ...a, status: 'published', publishedUrl: `https://${selectedClient.domain}/insights/${articleId}` }
            : a
        )
      );
    }
  };

  // Handler: Ingest new knowledge doc
  const handleAddDoc = (newDocData: Partial<KnowledgeDoc>) => {
    const newDoc: KnowledgeDoc = {
      id: `kb_${Date.now()}`,
      clientId: newDocData.clientId || selectedClientId,
      title: newDocData.title || 'Untitled Doc',
      type: newDocData.type || 'document',
      content: newDocData.content || '',
      chunksCount: newDocData.chunksCount || 4,
      tokenCount: newDocData.tokenCount || 500,
      updatedAt: new Date().toISOString(),
    };
    setDocs((prev) => [newDoc, ...prev]);
  };

  // Handler: Update client system prompt
  const handleUpdateSystemPrompt = (prompt: string) => {
    setClients((prev) =>
      prev.map((c) => (c.id === selectedClientId ? { ...c, systemPrompt: prompt } : c))
    );
  };

  // Handler: Update agency tier
  const handleUpdateTier = (tier: PlanTier) => {
    const seatLimits: Record<PlanTier, number> = {
      starter: 3,
      growth: 10,
      scale: 30,
    };
    setAgency((prev) => ({
      ...prev,
      planTier: tier,
      clientSeatsLimit: seatLimits[tier],
    }));
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] dark:bg-[#000000] text-[#1d1d1f] dark:text-[#f5f5f7] flex flex-col font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        agency={agency}
        clients={clients}
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentView === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <LandingPage
                onLaunchDashboard={() => setCurrentView('agency_dashboard')}
                onSelectPricing={() => setCurrentView('billing')}
              />
            </motion.div>
          ) : (
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8"
            >
              {currentView === 'agency_dashboard' && (
                <DashboardOverview
                  agency={agency}
                  clients={clients}
                  prompts={prompts}
                  selectedClientId={selectedClientId}
                  onSelectClient={setSelectedClientId}
                  onNavigateTo={setCurrentView}
                  onAddClient={handleAddClient}
                />
              )}

              {currentView === 'pipeline' && (
                <MultiAgentPipeline
                  client={selectedClient}
                  prompts={prompts}
                  onArticleGenerated={handleArticleGenerated}
                />
              )}

              {currentView === 'tracker' && (
                <PromptTracker
                  client={selectedClient}
                  prompts={prompts}
                  onUpdatePrompt={handleUpdatePrompt}
                  onAddPrompt={handleAddPrompt}
                  onRunPipelineForPrompt={handleRunPipelineForPrompt}
                />
              )}

              {currentView === 'content' && (
                <ContentEngine
                  client={selectedClient}
                  articles={articles}
                  onOpenPipeline={() => setCurrentView('pipeline')}
                  onPublishArticle={handlePublishArticle}
                />
              )}

              {currentView === 'rag' && (
                <KnowledgeBaseRAG
                  client={selectedClient}
                  docs={docs}
                  onAddDoc={handleAddDoc}
                  onUpdateSystemPrompt={handleUpdateSystemPrompt}
                />
              )}

              {currentView === 'client_portal' && (
                <ClientPortalView
                  agency={agency}
                  client={selectedClient}
                  prompts={prompts}
                  articles={articles}
                  onOpenReportModal={() => setIsReportModalOpen(true)}
                />
              )}

              {currentView === 'billing' && (
                <BillingPanel
                  agency={agency}
                  usage={usage}
                  onUpdateTier={handleUpdateTier}
                />
              )}

              {currentView === 'admin' && (
                <AdminConsole
                  agencies={[agency]}
                  clients={clients}
                  prompts={prompts}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Switcher / Agency Utility Strip (Apple Glass Capsule) */}
      {currentView !== 'landing' && (
        <div className="border-t border-black/[0.06] dark:border-white/[0.06] bg-white/80 dark:bg-black/75 backdrop-blur-2xl py-3 px-4 text-xs text-neutral-600 dark:text-neutral-400 transition-colors">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span>Agency: <strong className="text-neutral-900 dark:text-white font-medium">{agency.name}</strong></span>
              <span className="text-neutral-300 dark:text-neutral-600">·</span>
              <span>Active Focus: <strong className="text-neutral-900 dark:text-white font-medium">{selectedClient.name}</strong> <span className="font-mono text-neutral-500">({selectedClient.domain})</span></span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('admin')}
                className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'admin' ? 'text-neutral-900 dark:text-white font-semibold' : ''}`}
              >
                Super-Admin View
              </button>
              <span className="text-neutral-300 dark:text-neutral-600">·</span>
              <button
                onClick={() => setCurrentView('client_portal')}
                className={`hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'client_portal' ? 'text-neutral-900 dark:text-white font-semibold' : ''}`}
              >
                Client Portal Preview
              </button>
              <span className="text-neutral-300 dark:text-neutral-600">·</span>
              <button
                onClick={() => setCurrentView('landing')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Marketing Overview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Branded Executive Report Modal */}
      <BrandedReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        agency={agency}
        client={selectedClient}
        prompts={prompts}
        articles={articles}
      />
    </div>
  );
}
