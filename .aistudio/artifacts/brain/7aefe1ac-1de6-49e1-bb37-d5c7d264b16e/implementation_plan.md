# Omnia AEO - White-Label Multilingual Answer Engine Optimization Platform

Omnia AEO is an enterprise-grade, multi-agent Answer Engine Optimization (AEO) platform built specifically for marketing and digital agencies to monitor, win, and scale client citations across ChatGPT, Perplexity, Gemini, and Google AI Overviews in high-value non-English markets (German, Japanese, Portuguese BR, Spanish).

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural direction and foundational parameters have been calibrated based on user choices:
> - **Brand Identity**: Omnia AEO — Global AI Visibility Platform with custom white-label capabilities for agencies.
> - **Citation Engine**: Real-time server-side Gemini simulation and prompt probing across 4 answer engine personas (ChatGPT, Perplexity, Gemini, Google AIO).
> - **Pre-seeded Accounts**: Agency "Apex Digital" with two live enterprise client profiles: **CloudKite GmbH** (German B2B Cloud Optimization - `cloudkite.de`) and **Sakura Tokyo Crafts** (Japanese artisanal direct-to-consumer - `sakuratokyo.jp`).

---

## 1. Overview & Core Concept

### What It Does
Omnia AEO automates the entire Answer Engine Optimization workflow for agency clients in non-English territories:
1. **Prompt & Citation Tracker**: Probes target queries across ChatGPT, Perplexity, Gemini, and Google AI Overviews to calculate citation share, brand sentiment, snippet rankings, and gap opportunities.
2. **Multi-Agent AEO Pipeline**: Orchestrates specialized autonomous agents:
   - *Prompt Researcher*: Discovers high-intent queries where AI models recommend solutions in target languages.
   - *Citation Gap Auditor*: Pinpoints why competitors are cited instead of the client (source authority, freshness, schema absence).
   - *Multilingual Native Content Creator*: Synthesizes native, culturally nuanced content in German, Japanese, Portuguese (BR), and Spanish (not translated, but natively structured with persistent cross-market entity mapping).
   - *Structured Schema Architect*: Generates and validates JSON-LD (FAQPage, Organization, TechArticle, Product, Speakable) to anchor semantic understanding.
   - *CMS Webhook Publisher*: Connects with 1-click sync to WordPress (REST API), Shopify (Blog API), and Webflow (CMS API).
3. **White-Label Agency System**: Custom domain branding, agency logo/color injection, client-facing shareable portal URLs, role-based access, and exportable PDF executive audit reports.
4. **Interactive RAG Knowledge Base**: Per-client document ingestion (guidelines, product catalogs, entity facts) for grounded prompt simulations.
5. **Billing & Usage Management**: Stripe agency subscriptions ($99 Starter, $249 Growth, $499 Scale) with seat limits and metered generation overages.
6. **High-Converting Landing Page**: Agency-focused hero ("Add AEO to your agency in 10 minutes. White-label. Multi-language. No strategy calls.") with interactive live probe simulator.

### Target Audience
- SEO, growth, and digital performance agencies handling international accounts.
- Localization teams and enterprise brands expanding into DACH (Germany/Austria/Switzerland), Japan, LATAM (Brazil), and Spain/Hispanophone markets.

---

## 2. User Experience & Visual Design

Following the universal `frontend-design` constitution and the SaaS/Dashboard reference (`references/3_saas_dashboard.md`):

### Aesthetic Direction
- **Theme**: Enterprise B2B precision, clean obsidian/slate neutral canvas with crisp high-contrast layout, subtle 1px structural hairline borders (`border-slate-800`), and focused cobalt/indigo accents (`#3B82F6` / `#2563EB`).
- **Zero-Pill Discipline**: Metadata displayed as clean unboxed text with subtle typographic separators (`·` or `/`). No pill-sandwich cards or spurious glowing status dots.
- **Top Bar Contract**: Clean 3-zone header with single-line wordmark, single-line navigation links (`whitespace-nowrap shrink-0`), and single action button.
- **Tabular Rigor**: Tabular figures (`tabular-nums`) and monospace typography for citation percentages, prompt counts, and billing metrics.

### Key User Views & Flows
```
┌────────────────────────────────────────────────────────────────────────┐
│                        Omnia AEO Navigation Bar                        │
│ [Omnia AEO]  ·  Dashboard  ·  Multi-Agent Pipeline  ·  Tracker  ·  KB │
├──────────────┬─────────────────────────────────────────────────────────┤
│ Sidebar Nav  │ Main Workspace Area                                     │
│ ───────────  │ ───────────────────                                     │
│ • Agency Hub │ [ Agency / Client Selector: Apex Digital > CloudKite ] │
│ • Clients (2)│                                                         │
│ • Pipelines  │ ┌───────────────────────┬─────────────────────────────┐ │
│ • Tracker    │ │ AI Citation Share     │ Citation Gaps Identified    │ │
│ • Content RAG│ │ 44.8% (+12.4% MoM)    │ 38 high-opportunity queries │ │
│ • Client UI  │ └───────────────────────┴─────────────────────────────┘ │
│ • Billing    │                                                         │
│ • Admin View │ Active Pipelines · Live Prober · Schema & CMS Push      │
└──────────────┴─────────────────────────────────────────────────────────┘
```

1. **Agency Executive Dashboard**: High-level KPIs, client portfolio status, citation win-rate, automated cron scheduling indicator, and quick-action launcher.
2. **Multi-Agent AEO Pipeline View**: Visual pipeline showing the 5-stage agent flow (Research → Gap Audit → Multilingual Generation → Schema Injection → CMS Push) with live execution controls.
3. **Citation & Prompt Tracker**: Comprehensive table of up to 500 prompts with filtering by language (DE, JA, PT-BR, ES), engine status (ChatGPT, Perplexity, Gemini, Google AIO), citation rank, and live "Probe Now" runner.
4. **Multi-Language Content Engine**: Editor with native entity consistency check, side-by-side linguistic comparison, JSON-LD preview, and CMS publish webhook triggers.
5. **Interactive RAG & Live Assistant**: Per-client knowledge base with file/text upload, chunk preview, and streaming chat assistant for prompt testing.
6. **White-Label Client Portal Mode**: Client perspective with agency branding ("Powered by Apex Digital"), no internal agency tooling, shareable direct view link.
7. **Stripe Billing & Metered Usage**: Tier switcher ($99 / $249 / $499), client seat allocation, overage calculator, and test checkout simulation.
8. **Platform Admin View**: Cross-agency overview, token usage breakdown, aggregate citation metrics, and tenant inspection.
9. **Agency Landing Page**: "Add AEO to your agency in 10 minutes" marketing page with live probe widget, tier cards, and conversion modal.

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side Vite API Proxy Integration**: Implement full API endpoints directly via Vite dev server middleware and an Express backend (`server.ts`). This guarantees instant zero-setup local execution while fully conforming to AI Studio's port 3000 requirement.
- **Server-Side Gemini 3.8 Flash SDK**: All AI agent execution, multilingual generation, RAG embedding, and streaming chat run server-side via `@google/genai` with `process.env.GEMINI_API_KEY`.
- **Entity Consistency Mapping**: Cross-lingual entity graph keeping canonical brand identity, wikidata links, sameAs schema relations, and product specifications synchronized across DE, JA, PT-BR, and ES.
- **Real-Time Client Storage + Local Persistence**: Seeded with real-world German & Japanese client profiles in persistent storage with export/import capabilities.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Client Layer (React 19)                       │
│  Agency Dashboard  │  Client Portal  │  Multi-Agent UI  │  Tracker     │
│  Knowledge RAG     │  Billing Panel  │  Agency Landing  │  Admin View  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / Server-Sent Events
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Server Layer (Express / Vite Middleware)              │
│  /api/aeo/probe          → Real-time answer engine citation probe      │
│  /api/aeo/pipeline       → Multi-agent content & schema generator     │
│  /api/aeo/chat-stream    → Streaming LLM with client system prompt    │
│  /api/aeo/rag            → Document chunking & semantic retrieval      │
│  /api/aeo/publish        → Webhook triggers for WP / Shopify / Webflow │
│  /api/billing/stripe     → Subscription & overage simulation           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                       AI & External Services                           │
│  @google/genai (Gemini 3.8 Flash) · Citation Scraper Engine            │
│  Cross-Engine Simulation (ChatGPT, Perplexity, Gemini, Google AIO)     │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models
- **Agency**: `id`, `name`, `slug`, `logoUrl`, `primaryColor`, `customDomain`, `planTier`, `clientLimit`, `stripeCustomerId`.
- **ClientDomain**: `id`, `agencyId`, `name`, `domain`, `language` (de, ja, pt-br, es), `targetMarket`, `industry`, `entityMap`, `cmsConfig`.
- **TrackedPrompt**: `id`, `clientId`, `promptText`, `language`, `intent`, `searchVolume`, `engineCitations` (ChatGPT, Perplexity, Gemini, Google AIO), `lastProbedAt`, `citationGapScore`.
- **AeoArticle**: `id`, `clientId`, `title`, `slug`, `language`, `content`, `schemaJsonLd`, `status` (draft, optimized, published), `cmsTarget`, `targetPrompts`.
- **KnowledgeDocument**: `id`, `clientId`, `title`, `sourceUrl`, `chunks`, `tokenCount`, `updatedAt`.
- **UsageRecord**: `agencyId`, `month`, `probesUsed`, `tokensUsed`, `articlesGenerated`, `overageFees`.

---

## 5. Verification Plan

1. **Compilation**: Run `compile_applet` to verify zero TypeScript or bundler errors.
2. **API Verification**: Verify server endpoints (`/api/aeo/probe`, `/api/aeo/pipeline`, `/api/aeo/chat-stream`, `/api/aeo/rag`) respond correctly with Gemini integration.
3. **Multi-Agent Pipeline**: Trigger automated generation for both CloudKite GmbH (German) and Sakura Tokyo Crafts (Japanese), verifying native vocabulary, schema markup, and CMS push formatting.
4. **Citation Tracker**: Execute real-time prompt probing across simulated engine personas and verify gap analysis calculations.
5. **White-Label & Portal Mode**: Test toggle between Agency Owner view, Client Portal view (tokenized), and Super Admin view.
6. **Landing Page & Billing**: Verify responsive landing page layout, interactive demo widget, and Stripe subscription simulation.
7. **Documentation**: Provide a comprehensive `README.md` covering architecture, environment variables, deployment instructions (Vercel & Railway), and agency onboarding workflows.
