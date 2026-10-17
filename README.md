# Omnia AEO — White-Label Multi-Agent Answer Engine Optimization Platform for Agencies

> **"Add AEO to your agency in 10 minutes. White-label. Multi-language. No strategy calls."**

Omnia AEO is an enterprise-grade, multi-agent Answer Engine Optimization (AEO) platform designed for digital marketing and performance agencies. It automates monitoring, citation gap analysis, content creation, structured schema injection, and CMS publishing across **ChatGPT, Perplexity, Gemini, and Google AI Overviews** in high-value non-English markets: **German (DACH), Japanese (JA), Brazilian Portuguese (PT-BR), and Spanish (ES)**.

---

## 1. Why Omnia AEO Exists

- **The Problem with Current Solutions**:
  - Existing AEO agencies (e.g. AEO Engine at $80K MRR) sell done-for-you services at $1,597–$2,997/month, but are strictly English-only and require high-touch human strategy calls.
  - Self-serve tools like AirOps focus almost exclusively on ChatGPT and English prompts, ignoring the massive citation shifts happening in Europe, Japan, and Latin America.
- **The Omnia Advantage**:
  - **100% White-Label**: Run under your agency's brand and custom CNAME (`aeo.youragency.com`).
  - **Native Multi-Language**: Content is generated natively with localized idioms and technical depth—never cheap translations.
  - **Entity Consistency**: Unified Schema.org entity bindings (Wikidata URI, sameAs, ISO identifiers) so answer engines map multilingual pages to the same corporate entity.
  - **Zero Strategy Calls**: Clients access a self-serve intelligence dashboard to view real-time citation win-rates and scheduled deliverables.

---

## 2. Technical Stack & Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS (v4) with enterprise typography (`Plus Jakarta Sans` & `JetBrains Mono`).
- **Backend**: Express + Vite Dev Middleware (`server.ts`) for unified full-stack execution on port 3000.
- **AI Core**: `@google/genai` (Gemini 3.8 Flash) for live citation probing, RAG embeddings, and multi-agent content generation.
- **Multi-Engine Prober**: Real-time probing of ChatGPT, Perplexity, Gemini, and Google AI Overviews.
- **Persistence & Seeding**: Pre-seeded with agency **Apex Digital** and two client domains:
  - **CloudKite GmbH** (`cloudkite.de`): German B2B Cloud FinOps & Kubernetes Infrastructure.
  - **Sakura Tokyo Crafts** (`sakuratokyo.jp`): Japanese traditional artisanal ceramics & tea ware D2C.
- **Billing**: Stripe subscription engine with tiers ($99 Starter, $249 Growth, $499 Scale) + metered overage tracking.

---

## 3. Environment Variables

Create a `.env` file in the root directory (based on `.env.example`):

```bash
# ==========================================
# Google Gemini API (Required for Multi-Agent & Probing)
# ==========================================
GEMINI_API_KEY="your-gemini-api-key"

# ==========================================
# Stripe Billing (Test & Production Keys)
# ==========================================
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ==========================================
# CMS Webhook & Publishing Keys (Optional per client)
# ==========================================
WORDPRESS_APP_USERNAME="agency_aeo_bot"
WORDPRESS_APP_PASSWORD="xxxx xxxx xxxx xxxx"
SHOPIFY_ACCESS_TOKEN="shpat_..."
WEBFLOW_API_TOKEN="wfl_..."

# ==========================================
# Application URL & Port
# ==========================================
PORT=3000
APP_URL="http://localhost:3000"
```

---

## 4. Local Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full-Stack Server
```bash
npm run dev
```
The server will boot at `http://localhost:3000`, running both the Express backend API (`/api/*`) and the Vite React frontend.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 5. Multi-Agent AEO Pipeline

Omnia AEO orchestrates five specialized agents (reusable pattern inspired by AionUi):

1. **Agent 1: Prompt Researcher**:
   Discovers high-intent commercial and informational queries where answer engines formulate product recommendations in the target language.
2. **Agent 2: Citation Gap Auditor**:
   Probes ChatGPT, Perplexity, Gemini, and Google AIO to check if the client is cited. Analyzes why competitor domains win the citation.
3. **Agent 3: Native Multilingual Creator**:
   Writes native, high-authority articles in German, Japanese, Portuguese, or Spanish. Incorporates comparison tables, direct answer snippets, and verified domestic data.
4. **Agent 4: Schema Architect**:
   Generates verified JSON-LD structured data (`TechArticle`, `Product`, and `FAQPage`) with `sameAs` links pointing to the brand's canonical entity graph.
5. **Agent 5: CMS Publisher**:
   Formats the post payload and pushes it via 1-click webhook to WordPress (REST API), Shopify (Blog Engine), or Webflow (CMS Collections).

---

## 6. How to Onboard a New Agency & Client

### Step 1: Set Up Agency Profile
1. In the **Agency Hub**, navigate to **Settings / White-Label**.
2. Upload your agency logo and set your brand primary color.
3. Configure your custom CNAME (e.g. `aeo.youragency.com`).

### Step 2: Add Client Domain
1. In the **Agency Dashboard**, click **"+ Add Client Domain"**.
2. Enter the client's company name (e.g. *CloudKite GmbH*) and primary domain (*cloudkite.de*).
3. Select the primary target language market (`German (DACH)`, `Japanese (JA)`, `Portuguese (BR)`, or `Spanish (ES)`).
4. Select the target CMS (`WordPress`, `Shopify`, or `Webflow`) and input the webhook endpoint.

### Step 3: Ingest Knowledge Base (RAG)
1. Navigate to **Knowledge RAG**.
2. Upload the client's brand guidelines, product specs, or whitepapers.
3. Edit the **Client System Prompt** to tailor the model's tone of voice (e.g. formal German *Sie* or Japanese *Keigo*).

### Step 4: Add Target Prompts & Run Initial Audit
1. Go to **Citation Tracker** and add up to 500 target queries (or import via CSV).
2. Click **"Probe Citation"** or trigger the automated weekly cron scan.
3. Gaps will automatically populate the Multi-Agent Pipeline queue.

### Step 5: Deliver the Self-Serve Client Portal
1. Click **"Client View"** to preview the client's portal.
2. Share the white-labeled link with your client. They can track visibility trends, citations won, and published articles without needing monthly status calls.

---

## 7. Deployment Guide

### Deploying to Railway (Full-Stack Recommended)
1. Fork or push this repository to GitHub.
2. Create a new project in [Railway](https://railway.app) from your GitHub repo.
3. Add the following environment variables in Railway:
   - `GEMINI_API_KEY`: Your Gemini API key.
   - `PORT`: `3000`.
   - `NODE_ENV`: `production`.
4. Railway will automatically detect `package.json`, run `npm run build`, and execute `npm run start`.

### Deploying to Vercel
1. In Vercel, import the repository.
2. Set Framework Preset to **Vite**.
3. Add `GEMINI_API_KEY` in **Project Settings > Environment Variables**.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.

---

## 8. License

Apache 2.0. Built for agencies scaling global Answer Engine Optimization.
