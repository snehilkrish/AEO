import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';
import { Agency, PlanTier, UsageMetric } from '../types/aeo';

interface BillingPanelProps {
  agency: Agency;
  usage: UsageMetric;
  onUpdateTier: (tier: PlanTier) => void;
}

export const BillingPanel: React.FC<BillingPanelProps> = ({
  agency,
  usage,
  onUpdateTier,
}) => {
  const [selectedTier, setSelectedTier] = useState<PlanTier>(agency.planTier);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const plans = [
    {
      id: 'starter' as PlanTier,
      name: 'Agency Starter',
      price: 99,
      seats: 3,
      probes: 150,
      description: 'Ideal for small agencies onboarding their first DACH or Japan accounts.',
      features: [
        '3 Client Domains',
        '150 Probes / month',
        'German & Spanish generation',
        'WordPress CMS integration',
        'Standard email reports',
      ],
    },
    {
      id: 'growth' as PlanTier,
      name: 'Agency Growth',
      price: 249,
      seats: 10,
      probes: 500,
      description: 'The standard choice for digital growth & SEO agencies scaling multi-market AEO.',
      features: [
        '10 Client Domains',
        '500 Probes / month',
        'All 4 Languages (DE, JA, PT-BR, ES)',
        'WordPress, Shopify & Webflow Sync',
        'White-Label Client Portal & Custom Logo',
        'Custom Branded PDF Reports',
      ],
      isPopular: true,
    },
    {
      id: 'scale' as PlanTier,
      name: 'Agency Scale',
      price: 499,
      seats: 30,
      probes: 2000,
      description: 'For high-volume performance networks delivering multi-language AI visibility.',
      features: [
        '30 Client Domains',
        '2,000 Probes / month',
        'Custom CNAME (aeo.youragency.com)',
        'Multi-Channel Alerts (Telegram, DingTalk, WeChat)',
        'Dedicated IP scraping proxies',
        'Custom SLA & Priority Queue',
      ],
    },
  ];

  const handleSimulateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutProcessing(true);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planTier: selectedTier,
          agencyName: agency.name,
        }),
      });
      await res.json();
      setCheckoutComplete(true);
      onUpdateTier(selectedTier);
    } catch {
      setCheckoutComplete(true);
      onUpdateTier(selectedTier);
    } finally {
      setCheckoutProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Agency Subscription & Usage</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-blue-400">{agency.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-400">Stripe Active</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Subscription & Usage Metering
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage agency client seats, plan tiers, and usage-based automated citation probing quotas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            Customer ID: {agency.stripeCustomerId}
          </span>
        </div>
      </div>

      {/* Metered Usage Overview with Staggered Entrance */}
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
        {/* Probes Usage */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 16, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 26 } },
          }}
          whileHover={{ y: -3, scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          className="rounded-3xl apple-glass-card p-6 space-y-3 cursor-default"
        >
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">Automated AI Probes Quota</span>
            <span className="font-mono text-white font-semibold">{usage.probesUsed} / {usage.probesLimit}</span>
          </div>
          <div className="h-2 w-full bg-black/50 border border-white/[0.08] rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (usage.probesUsed / usage.probesLimit) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-neutral-400">
            Probing across ChatGPT, Perplexity, Gemini, and Google AIO. Additional probes billed at $0.15/probe.
          </p>
        </motion.div>

        {/* Content Generation Quota */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 16, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 26 } },
          }}
          whileHover={{ y: -3, scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          className="rounded-3xl apple-glass-card p-6 space-y-3 cursor-default"
        >
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">Articles & Schemas Synthesized</span>
            <span className="font-mono text-emerald-400 font-bold">{usage.articlesGenerated}</span>
          </div>
          <div className="h-2 w-full bg-black/50 border border-white/[0.08] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '40%' }} />
          </div>
          <p className="text-[11px] text-neutral-400">
            Native multilingual creation and JSON-LD schema generation in DE, JA, PT-BR, ES.
          </p>
        </motion.div>

        {/* Current Period Bill */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 16, scale: 0.98 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 26 } },
          }}
          whileHover={{ y: -3, scale: 1.01, transition: { type: 'spring', stiffness: 400, damping: 25 } }}
          className="rounded-3xl apple-glass-card p-6 space-y-2 cursor-default"
        >
          <span className="text-xs text-neutral-400 block font-medium">Current Billing Period Spend</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
              ${agency.planTier === 'starter' ? 99 : agency.planTier === 'growth' ? 249 : 499}
            </span>
            <span className="text-xs text-neutral-400">/ month</span>
          </div>
          <span className="text-[11px] text-emerald-400 block font-medium">
            ✓ Zero overage fees this cycle ($0.00)
          </span>
        </motion.div>
      </motion.div>

      {/* Plan Tiers Selection */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white tracking-tight">Available Agency Tiers</h3>
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.09, delayChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {plans.map((plan) => {
            const isCurrent = agency.planTier === plan.id;
            return (
              <motion.div
                key={plan.id}
                variants={{
                  hidden: { opacity: 0, y: 22, scale: 0.97 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 340, damping: 26 } },
                }}
                whileHover={{ y: -6, scale: 1.015, transition: { type: 'spring', stiffness: 380, damping: 25 } }}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-colors duration-200 ${
                  plan.isPopular
                    ? 'border border-blue-500/50 bg-neutral-900/90 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/30'
                    : isCurrent
                    ? 'border border-emerald-500/40 bg-neutral-900/80 ring-1 ring-emerald-500/30'
                    : 'apple-glass-card hover:border-white/[0.15]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white tracking-tight">{plan.name}</h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                        Current Plan
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white font-mono tracking-tight">${plan.price}</span>
                    <span className="text-xs text-neutral-400">/ mo</span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed">{plan.description}</p>

                  <ul className="space-y-2.5 pt-4 border-t border-white/[0.08] text-xs text-neutral-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedTier(plan.id);
                    setShowCheckoutModal(true);
                    setCheckoutComplete(false);
                  }}
                  className={`mt-6 w-full py-2.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                    isCurrent
                      ? 'apple-btn-secondary'
                      : plan.isPopular
                      ? 'apple-btn-primary shadow-md'
                      : 'apple-btn-secondary'
                  }`}
                >
                  {isCurrent ? 'Modify Subscription' : `Upgrade to ${plan.name}`}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Invoice History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Recent Stripe Invoices</h3>
        <div className="divide-y divide-slate-800 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400">INV-2026-10-01</span>
              <span className="text-slate-300">Growth Plan (10 Client Seats)</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-white">$249.00</span>
              <span className="text-emerald-400 font-semibold text-[11px]">Paid</span>
              <button className="text-blue-400 hover:underline flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>PDF</span>
              </button>
            </div>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-slate-400">INV-2026-09-01</span>
              <span className="text-slate-300">Growth Plan (10 Client Seats)</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono font-bold text-white">$249.00</span>
              <span className="text-emerald-400 font-semibold text-[11px]">Paid</span>
              <button className="text-blue-400 hover:underline flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Interactive Checkout Modal with Apple Spring Presentation */}
      <AnimatePresence>
        {showCheckoutModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowCheckoutModal(false)}
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
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                  <h3 className="text-base font-bold text-white tracking-tight">Stripe Checkout Simulation</h3>
                </div>
                <button onClick={() => setShowCheckoutModal(false)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
              </div>

              {checkoutComplete ? (
                <div className="py-6 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Plan Upgraded Successfully!</h4>
                  <p className="text-neutral-400 leading-relaxed text-xs">
                    Your agency account has been updated to <span className="font-semibold text-white uppercase">{selectedTier}</span>. Client seats and probe quotas have been expanded.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowCheckoutModal(false)}
                    className="apple-btn-primary mt-4 px-6 py-2 rounded-full font-semibold cursor-pointer shadow-md"
                  >
                    Return to Dashboard
                  </motion.button>
                </div>
              ) : (
                <form onSubmit={handleSimulateCheckout} className="space-y-4">
                  <div className="p-3.5 bg-black/50 border border-white/[0.08] rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Selected Tier</span>
                      <span className="font-bold text-white uppercase">{selectedTier} Plan</span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[11px]">Monthly Total</span>
                      <span className="font-mono font-bold text-white text-sm">
                        ${selectedTier === 'starter' ? 99 : selectedTier === 'growth' ? 249 : 499}.00
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-neutral-300 font-medium mb-1">Card Number (Test Mode)</label>
                      <input
                        type="text"
                        disabled
                        value="4242 •••• •••• 4242"
                        className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-2.5 text-neutral-300 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-neutral-300 font-medium mb-1">Expires</label>
                        <input
                          type="text"
                          disabled
                          value="12 / 28"
                          className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-2.5 text-neutral-300 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-neutral-300 font-medium mb-1">CVC</label>
                        <input
                          type="text"
                          disabled
                          value="888"
                          className="w-full bg-black/60 border border-white/[0.1] rounded-xl p-2.5 text-neutral-300 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(false)}
                      className="px-4 py-2 text-neutral-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={checkoutProcessing}
                      className="apple-btn-primary px-5 py-2 text-xs font-semibold rounded-full flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {checkoutProcessing ? (
                        <>
                          <RefreshCw className="h-3.5 w-3.5 animate-spin text-black" />
                          <span>Confirming with Stripe...</span>
                        </>
                      ) : (
                        <span>Confirm & Activate Subscription</span>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
