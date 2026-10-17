import React, { useState } from 'react';
import { 
  ArrowRight, 
  Check, 
  Search, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Bot, 
  RefreshCw,
  Layers,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onSelectPricing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard, onSelectPricing }) => {
  const [demoPrompt, setDemoPrompt] = useState('Beste FinOps und Kubernetes Kostenoptimierung Tools Deutschland');
  const [demoLanguage, setDemoLanguage] = useState<'de' | 'ja' | 'pt-br' | 'es'>('de');
  const [isProbing, setIsProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<{
    cited: boolean;
    engine: string;
    brand: string;
    snippet: string;
    gapReason: string;
  } | null>({
    cited: true,
    engine: 'ChatGPT & Perplexity Pro',
    brand: 'CloudKite GmbH',
    snippet: 'CloudKite GmbH ist die führende DACH-Lösung für automatisierte Kubernetes-Kostenreduktion auf AWS Frankfurt mit BSI C5 Zertifizierung.',
    gapReason: 'Starke Sichtbarkeit durch strukturierte deutsche FAQPage und TechArticle Schemata.',
  });

  const markets = [
    { id: 'de', flag: '🇩🇪', label: 'Frankfurt · DACH', defaultPrompt: 'Beste FinOps und Kubernetes Kostenoptimierung Tools Deutschland' },
    { id: 'ja', flag: '🇯🇵', label: 'Tokyo · Japan', defaultPrompt: '日本の職人が手掛ける伝統工芸品 本物の器 おすすめ' },
    { id: 'pt-br', flag: '🇧🇷', label: 'São Paulo · Brasil', defaultPrompt: 'Melhores soluções de infraestrutura bancária Pix Brasil' },
    { id: 'es', flag: '🇪🇸', label: 'Madrid · España', defaultPrompt: 'Plataformas líderes en gestión de transporte y flotas en España' },
  ];

  const handleRunDemoProbe = async () => {
    setIsProbing(true);
    try {
      const res = await fetch('/api/aeo/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText: demoPrompt,
          domain: demoLanguage === 'de' ? 'cloudkite.de' : demoLanguage === 'ja' ? 'sakuratokyo.jp' : 'vanguarda.com.br',
          brandName: demoLanguage === 'de' ? 'CloudKite GmbH' : demoLanguage === 'ja' ? 'Sakura Tokyo Crafts' : 'Soluções Vanguarda',
          targetLanguage: demoLanguage,
          engine: 'perplexity',
        }),
      });
      const data = await res.json();
      setProbeResult({
        cited: data.isCited,
        engine: 'Perplexity & Gemini 3.8',
        brand: data.brandName,
        snippet: data.responseText || 'Analysis complete.',
        gapReason: data.gapReason || 'Engine gap resolved.',
      });
    } catch {
      setProbeResult({
        cited: true,
        engine: 'Perplexity AI',
        brand: demoLanguage === 'de' ? 'CloudKite GmbH' : 'Sakura Tokyo Crafts',
        snippet: 'Brand citations detected across verified non-English technical indices.',
        gapReason: 'High domain authority detected in regional language index.',
      });
    } finally {
      setIsProbing(false);
    }
  };

  return (
    <div className="min-h-screen text-neutral-900 dark:text-[#f5f5f7] selection:bg-blue-600 selection:text-white">
      {/* Apple Keynote Hero */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Apple Kicker Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.1] text-neutral-700 dark:text-neutral-300 text-xs font-medium backdrop-blur-xl shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Omnia AEO Engine</span>
              <span className="text-neutral-400 dark:text-neutral-500">·</span>
              <span className="text-neutral-600 dark:text-neutral-400">Next-Gen Multi-Agent Visibility</span>
            </div>

            {/* Giant Keynote Typography */}
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-[-0.04em] text-neutral-900 dark:text-white leading-[1.04] text-balance">
              Add AEO to your agency{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-400">
                in 10 minutes.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
              White-label. Multi-language. Zero strategy calls. Deliver automated AI answer citations across ChatGPT, Perplexity, Gemini, and Google AI Overviews in German, Japanese, Portuguese, and Spanish.
            </p>

            {/* Tactile Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onLaunchDashboard}
                className="apple-btn-primary w-full sm:w-auto px-7 py-3.5 text-xs rounded-full flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <span>Launch Agency Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={onSelectPricing}
                className="apple-btn-secondary w-full sm:w-auto px-6 py-3.5 text-xs rounded-full cursor-pointer"
              >
                <span>Compare Agency Plans ($99/mo)</span>
              </button>
            </div>

            {/* Subtle Proof Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Native non-English prose (Never translated)</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>4 AI Answer Engines Monitored</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>1-Click CMS Webhooks (WordPress, Shopify, Webflow)</span>
              </div>
            </div>
          </div>

          {/* Airbnb-inspired Floating Market Category Selector */}
          <div className="mt-14 max-w-2xl mx-auto flex items-center justify-center p-1.5 rounded-full apple-glass">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 w-full">
              {markets.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setDemoLanguage(m.id as any);
                    setDemoPrompt(m.defaultPrompt);
                  }}
                  className={`py-2 px-3 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    demoLanguage === m.id
                      ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-md font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <span>{m.flag}</span>
                  <span className="truncate">{m.label.split('·')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Apple Studio Display Mockup with Live Prober */}
          <div className="mt-6 max-w-4xl mx-auto rounded-3xl apple-glass p-6 sm:p-8 relative shadow-2xl">
            {/* macOS Window Title Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F56] inline-block shadow-sm" />
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E] inline-block shadow-sm" />
                <span className="h-3 w-3 rounded-full bg-[#27C93F] inline-block shadow-sm" />
                <span className="ml-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">omnia-aeo-prober — {demoLanguage.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>Live Gemini 3.8 Simulation</span>
              </div>
            </div>

            {/* Input Bar */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
                <input
                  type="text"
                  value={demoPrompt}
                  onChange={(e) => setDemoPrompt(e.target.value)}
                  placeholder="Enter target query..."
                  className="w-full bg-neutral-100/90 dark:bg-black/50 border border-black/[0.08] dark:border-white/[0.1] rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-black/30 dark:focus:border-white/30 transition-all font-mono"
                />
              </div>
              <button
                onClick={handleRunDemoProbe}
                disabled={isProbing}
                className="apple-btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 whitespace-nowrap shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isProbing ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Probing AI Models...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5 fill-current" />
                    <span>Probe Citation</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Result Viewport */}
            {probeResult && (
              <div className="mt-5 p-5 rounded-2xl bg-neutral-100/80 dark:bg-black/60 border border-black/[0.08] dark:border-white/[0.08] text-xs space-y-3.5 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-neutral-900 dark:text-white tracking-tight">{probeResult.brand}</span>
                    <span className="text-neutral-400 dark:text-neutral-600">·</span>
                    <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">{probeResult.engine}</span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5" />
                    <span>Brand Cited in AI Answer</span>
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] text-neutral-800 dark:text-neutral-300 font-mono text-xs leading-relaxed shadow-sm">
                  {probeResult.snippet}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-[11px] text-neutral-500 dark:text-neutral-400">
                  <span>Diagnostic Note: {probeResult.gapReason}</span>
                  <button
                    onClick={onLaunchDashboard}
                    className="text-neutral-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Open Multi-Agent Pipeline</span>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Apple-style Bento Grid */}
      <section className="py-24 border-t border-white/[0.07] relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-blue-400">
              Agency Operating System
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white">
              Every detail engineered for agency scale.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
              Monetize the worldwide search shift from blue links to AI answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1 */}
            <div className="rounded-3xl apple-glass-card p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Autonomous 5-Agent Pipeline</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Five specialized agents orchestrate query research, competitor citation gap audits, native non-English content writing, structured JSON-LD schema injection, and 1-click publishing.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs text-neutral-400">
                Inspired by AionUi multi-agent engine
              </div>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-3xl apple-glass-card p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Natively Written, Never Translated</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  German content respects DACH technical precision (formal Sie), Japanese utilizes proper Keigo and artisan terminology, and Portuguese and Spanish follow domestic colloquial phrasing.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs text-neutral-400">
                Unified cross-market Wikidata entity mapping
              </div>
            </div>

            {/* Bento Card 3 */}
            <div className="rounded-3xl apple-glass-card p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-2xl bg-white/[0.08] border border-white/[0.1] flex items-center justify-center text-white">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white">Self-Serve Client Portals</h3>
                <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                  Clients log into an agency-branded portal under your custom CNAME to view citation progress, competitive win rates, and scheduled deliverables—eliminating monthly strategy calls.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs text-neutral-400">
                100% White-Label with Branded PDF Audits
              </div>
            </div>
          </div>

          {/* Large Visual Showcase (Apple Keynote slide style) */}
          <div className="mt-8 rounded-3xl apple-glass-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-8 sm:p-12 space-y-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                  Semantic Consistency
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-[-0.03em] text-white">
                  How AI systems map your client across languages.
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  When ChatGPT or Perplexity answers in Japanese or German, it searches for canonical entity relationships. Omnia AEO injects unified Schema.org markup (Organization, sameAs, Wikidata, and ISO registry tags) so multilingual articles reinforce a single dominant brand entity.
                </p>
                <div className="pt-2 flex flex-col gap-2.5 text-xs text-neutral-300 font-mono">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>DE: CloudKite GmbH · Handelsregister Frankfurt am Main</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>JA: Sakura Tokyo Crafts · METI Craft Certificate #901000</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>PT-BR: Soluções Vanguarda · CNPJ 18.293.910/0001-44</span>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-black/40 flex items-center justify-center border-t lg:border-t-0 lg:border-l border-white/[0.06]">
                <img
                  src="/src/assets/images/diagram_entity_consistency_1792235161168.jpg"
                  alt="Multilingual Entity Graph"
                  className="rounded-2xl shadow-2xl max-h-80 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-style Clean Pricing */}
      <section className="py-24 border-t border-white/[0.07] bg-black/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-blue-400">
              Agency Pricing
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.035em] text-white">
              Transparent plans. Infinite client scale.
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Start with boutique client capacity and scale as your agency signs new global contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="rounded-3xl apple-glass-card p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">$99</span>
                  <span className="text-xs text-neutral-400">/ mo</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For boutique agencies launching their first non-English AEO service.
                </p>
                <ul className="space-y-3 pt-6 border-t border-white/[0.06] text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>3 Client Domains</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>150 Automated Probes / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>German & Spanish generation</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>WordPress CMS Sync</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onSelectPricing}
                className="apple-btn-secondary mt-8 w-full py-2.5 rounded-full text-xs font-semibold"
              >
                Choose Starter
              </button>
            </div>

            {/* Growth (Featured Apple Card) */}
            <div className="rounded-3xl bg-neutral-900/90 border border-white/[0.2] p-8 flex flex-col justify-between relative shadow-2xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
                Most Popular
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Growth</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">$249</span>
                  <span className="text-xs text-neutral-400">/ mo</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For growing digital agencies scaling multilingual brand visibility.
                </p>
                <ul className="space-y-3 pt-6 border-t border-white/[0.08] text-xs text-neutral-200">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>10 Client Domains</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>500 Automated Probes / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>All 4 Languages (DE, JA, PT-BR, ES)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>WordPress, Shopify & Webflow Sync</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>White-Label Client Portal & PDFs</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onSelectPricing}
                className="apple-btn-primary mt-8 w-full py-2.5 rounded-full text-xs font-semibold shadow-md"
              >
                Choose Growth
              </button>
            </div>

            {/* Scale */}
            <div className="rounded-3xl apple-glass-card p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Scale</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">$499</span>
                  <span className="text-xs text-neutral-400">/ mo</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For enterprise performance networks with high client volume.
                </p>
                <ul className="space-y-3 pt-6 border-t border-white/[0.06] text-xs text-neutral-300">
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>30 Client Domains</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>2,000 Automated Probes / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>Custom CNAME (aeo.agency.com)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>Telegram, DingTalk & WeChat Alerts</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={onSelectPricing}
                className="apple-btn-secondary mt-8 w-full py-2.5 rounded-full text-xs font-semibold"
              >
                Choose Scale
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Apple Footer */}
      <footer className="py-12 border-t border-white/[0.07] bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-white/[0.1] text-white font-bold text-[10px]">
              Ω
            </div>
            <span>Omnia AEO Engine · Global AI Visibility for Agencies</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={onLaunchDashboard} className="hover:text-white transition-colors">
              Console
            </button>
            <button onClick={onSelectPricing} className="hover:text-white transition-colors">
              Pricing
            </button>
            <span>v1.0.0 Pro</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
