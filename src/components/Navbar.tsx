import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown, ExternalLink, FileText, ArrowRight, Sparkles, Sun, Moon } from 'lucide-react';
import { Agency, ClientDomain } from '../types/aeo';

export type ViewMode = 'agency_dashboard' | 'pipeline' | 'tracker' | 'content' | 'rag' | 'client_portal' | 'billing' | 'admin' | 'landing';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  agency: Agency;
  clients: ClientDomain[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  onOpenReportModal: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  agency,
  clients,
  selectedClientId,
  onSelectClient,
  onOpenReportModal,
  theme,
  onToggleTheme,
}) => {
  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const isClientPortal = currentView === 'client_portal';
  const isLanding = currentView === 'landing';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] dark:border-white/[0.07] bg-white/80 dark:bg-black/75 backdrop-blur-2xl transition-all">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Apple-inspired minimalism) */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={() => onSelectView('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white dark:bg-white/[0.08] border border-black/[0.1] dark:border-white/[0.14] font-bold text-xs tracking-tighter group-hover:scale-105 transition-all">
              Ω
            </div>
            <span className="text-sm font-semibold tracking-[-0.025em] text-neutral-900 dark:text-white whitespace-nowrap">
              {isClientPortal ? `${agency.name}` : 'Omnia AEO'}
            </span>
          </button>

          {!isLanding && !isClientPortal && (
            <div className="hidden lg:flex items-center gap-2 border-l border-black/[0.08] dark:border-white/[0.08] pl-4">
              <div className="relative">
                <select
                  value={selectedClientId}
                  onChange={(e) => onSelectClient(e.target.value)}
                  className="appearance-none bg-black/[0.04] hover:bg-black/[0.07] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] rounded-full py-1 pl-3 pr-7 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-all focus:outline-none cursor-pointer tracking-tight"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                      {c.name} · {c.language.toUpperCase()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-2 h-3 w-3 text-neutral-500 dark:text-neutral-400" />
              </div>
            </div>
          )}
        </div>

        {/* Zone 2: Centered Floating Navigation Pills (Airbnb & Apple inspired) */}
        <nav className="hidden md:flex items-center p-1 bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] rounded-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.7)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          {isLanding ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSelectView('landing')}
                className="px-3.5 py-1 text-xs rounded-full font-medium transition-all text-neutral-900 dark:text-white bg-white dark:bg-white/[0.12] shadow-sm cursor-pointer"
              >
                Overview
              </button>
              <button
                onClick={() => onSelectView('agency_dashboard')}
                className="px-3.5 py-1 text-xs rounded-full font-medium transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => onSelectView('pipeline')}
                className="px-3.5 py-1 text-xs rounded-full font-medium transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                Agents
              </button>
              <button
                onClick={() => onSelectView('billing')}
                className="px-3.5 py-1 text-xs rounded-full font-medium transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                Pricing
              </button>
            </div>
          ) : isClientPortal ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSelectView('client_portal')}
                className="px-3.5 py-1 text-xs rounded-full font-medium transition-all text-neutral-900 dark:text-white bg-white dark:bg-white/[0.12] shadow-sm cursor-pointer"
              >
                AI Visibility
              </button>
              <button
                onClick={() => onSelectView('tracker')}
                className="px-3.5 py-1 text-xs rounded-full font-medium transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                Prompts
              </button>
              <button
                onClick={() => onSelectView('content')}
                className="px-3.5 py-1 text-xs rounded-full font-medium transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
              >
                Deliverables
              </button>
              <button
                onClick={() => onSelectView('agency_dashboard')}
                className="px-3.5 py-1 text-xs rounded-full font-medium transition-all text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Agency Hub</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectView('agency_dashboard')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentView === 'agency_dashboard'
                    ? 'text-neutral-900 dark:text-white bg-white dark:bg-white/[0.12] shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Overview
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectView('pipeline')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentView === 'pipeline'
                    ? 'text-neutral-900 dark:text-white bg-white dark:bg-white/[0.12] shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Pipeline
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectView('tracker')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentView === 'tracker'
                    ? 'text-neutral-900 dark:text-white bg-white dark:bg-white/[0.12] shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Tracker
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectView('content')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentView === 'content'
                    ? 'text-neutral-900 dark:text-white bg-white dark:bg-white/[0.12] shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Content & Schema
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectView('rag')}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap cursor-pointer ${
                  currentView === 'rag'
                    ? 'text-neutral-900 dark:text-white bg-white dark:bg-white/[0.12] shadow-sm'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                Knowledge RAG
              </motion.button>
            </div>
          )}
        </nav>

        {/* Zone 3: Tactile Action Controls (Apple Button System & Theme Toggle) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Apple Light/Dark Mode Switcher */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.08] dark:hover:bg-white/[0.14] text-neutral-700 dark:text-neutral-200 transition-all cursor-pointer text-xs font-medium"
            title={theme === 'dark' ? 'Switch to Light theme (current: Dark)' : 'Switch to Dark theme (current: Light)'}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span className="hidden sm:inline text-[11px] font-medium text-neutral-300">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5 text-neutral-700" />
                <span className="hidden sm:inline text-[11px] font-medium text-neutral-600">Dark</span>
              </>
            )}
          </motion.button>

          {!isLanding && !isClientPortal && (
            <button
              onClick={onOpenReportModal}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] rounded-full transition-all cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400" />
              <span>Audit PDF</span>
            </button>
          )}

          {isLanding ? (
            <button
              onClick={() => onSelectView('agency_dashboard')}
              className="apple-btn-primary px-4 py-1.5 text-xs rounded-full shadow-sm whitespace-nowrap cursor-pointer"
            >
              Open Console
            </button>
          ) : isClientPortal ? (
            <div className="text-right">
              <span className="block text-xs font-semibold text-neutral-900 dark:text-white tracking-tight">{selectedClient.name}</span>
              <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">{selectedClient.domain}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectView('client_portal')}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-black/[0.04] hover:bg-black/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.08] rounded-full transition-all cursor-pointer"
                title="Preview what client sees"
              >
                <ExternalLink className="h-3 w-3 text-neutral-500 dark:text-neutral-400" />
                <span>Client View</span>
              </button>
              <button
                onClick={() => onSelectView('billing')}
                className="apple-btn-primary px-3.5 py-1.5 text-xs rounded-full shadow-sm whitespace-nowrap cursor-pointer"
              >
                Agency Hub
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
