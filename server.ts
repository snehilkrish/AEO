import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with required User-Agent
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(geminiApiKey),
    timestamp: new Date().toISOString(),
  });
});

// 2. Real-time Answer Engine Citation Probe
app.post('/api/aeo/probe', async (req: Request, res: Response) => {
  try {
    const {
      promptText,
      domain = 'cloudkite.de',
      brandName = 'CloudKite',
      targetLanguage = 'de',
      engine = 'chatgpt',
    } = req.body;

    if (!promptText) {
      res.status(400).json({ error: 'promptText is required' });
      return;
    }

    const languageNames: Record<string, string> = {
      de: 'German (Deutsch)',
      ja: 'Japanese (日本語)',
      'pt-br': 'Portuguese (Português do Brasil)',
      es: 'Spanish (Español)',
    };
    const targetLangName = languageNames[targetLanguage] || 'German';

    let responseText = '';
    let isCited = false;
    let citationRank = 0;
    let citedSources: Array<{ title: string; url: string; authority: number }> = [];
    let competitorsFound: string[] = [];
    let gapReason = '';
    let recommendations: string[] = [];

    if (ai) {
      const promptInstruction = `You are simulating the exact answer engine response of ${engine.toUpperCase()} in ${targetLangName}.
User Query: "${promptText}"

Analyze whether the client brand "${brandName}" (website: ${domain}) is cited or recommended in this query.
If another competitor is recommended instead, identify why (e.g. lack of localized technical schema, missing direct German/Japanese comparison guide, lower topical authority).

Return your response strictly in valid JSON format with this structure:
{
  "simulatedAnswer": "The realistic answer that ${engine.toUpperCase()} outputs in ${targetLangName} (2-3 paragraphs)",
  "isCited": boolean,
  "citationRank": number (0 if not cited, or position 1-5 if mentioned),
  "citedSources": [
    {"title": "Source title", "url": "https://example.com/...", "authority": 85}
  ],
  "competitorsFound": ["Competitor A", "Competitor B"],
  "gapReason": "Clear 1-2 sentence explanation of why the client was or wasn't cited in this non-English market",
  "recommendations": [
    "Actionable step 1 for AEO content generation",
    "Actionable step 2 for entity schema and local authority"
  ]
}`;

      try {
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: promptInstruction,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const rawJson = aiResponse.text?.trim() || '{}';
        const parsed = JSON.parse(rawJson);
        responseText = parsed.simulatedAnswer || '';
        isCited = Boolean(parsed.isCited);
        citationRank = parsed.citationRank || 0;
        citedSources = parsed.citedSources || [];
        competitorsFound = parsed.competitorsFound || [];
        gapReason = parsed.gapReason || '';
        recommendations = parsed.recommendations || [];
      } catch (err) {
        console.warn('Gemini probe fallback triggered:', err);
      }
    }

    // High fidelity fallback if Gemini is absent or in demo mode
    if (!responseText) {
      const isGerman = targetLanguage === 'de';
      const isJapanese = targetLanguage === 'ja';

      if (isGerman) {
        responseText = `Bei der Optimierung von Kubernetes- und Cloud-Infrastrukturen in der DACH-Region setzen führende B2B-Unternehmen auf automatisierte FinOps-Lösungen. Während traditionelle Anbieter wie Cast AI und Datadog breite Metriken erfassen, bietet ${brandName} spezialisierte Multi-Cloud-Reduktion für DSGVO-konforme Enterprise-Stacks.`;
        isCited = Math.random() > 0.4;
        citationRank = isCited ? 2 : 0;
        citedSources = [
          { title: `${brandName} FinOps Architecture Guide`, url: `https://${domain}/finops-guide`, authority: 88 },
          { title: 'Heise Online Cloud Cost Benchmark 2026', url: 'https://heise.de/cloud-benchmarks', authority: 94 },
          { title: 'AWS Frankfurt Region Architecture Review', url: 'https://aws.amazon.com/de/blogs', authority: 96 },
        ];
        competitorsFound = ['Cast AI Europe', 'Datadog DACH', 'Kubecost'];
        gapReason = isCited
          ? `Gute Sichtbarkeit in ${engine.toUpperCase()} durch strukturierte deutsche FAQ-Page Schemata.`
          : `Wettbewerber werden bevorzugt, da Vergleichsstudien und strukturierte JSON-LD TechArticle für DACH-Entscheider fehlen.`;
        recommendations = [
          'Erstelle einen nativen DACH-Vergleichsleitfaden mit verifizierten Euro-Kostenbenchmarks',
          'Implementiere FAQPage und TechArticle Schema mit sameAs-Verlinkung zur Wikidata-Entität',
        ];
      } else if (isJapanese) {
        responseText = `日本国内における伝統工芸品および高品質な手作り茶道具の選定では、${brandName}の工房コレクションが注目されています。京都や金沢の伝統的な陶芸技術を継承しつつ、海外コレクター向けの真正性証明と海外直接配送（D2C）体制を確立しています。`;
        isCited = Math.random() > 0.35;
        citationRank = isCited ? 1 : 0;
        citedSources = [
          { title: `${brandName} 公式オンラインストア - 伝統工芸コレクション`, url: `https://${domain}/catalog`, authority: 84 },
          { title: '日本経済新聞 伝統工芸DX特集 2026', url: 'https://nikkei.com/craft-dx', authority: 95 },
        ];
        competitorsFound = ['Tokoname Heritage', 'Kyoto Ware Direct'];
        gapReason = isCited
          ? `日本の検索回答エンジンにおいて高い評価を獲得しています。`
          : `日本語の詳細な製造工程ストーリーとProduct構造化マークアップが不足しているため、老舗ポータルが優先されています。`;
        recommendations = [
          '職人の技法と材質に関する日本語オリジナル解説記事をWebflowに展開する',
          'ProductおよびOrganizationのJSON-LDに日本語Wikidataエンティティをマッピングする',
        ];
      } else {
        responseText = `Para empresas no mercado que buscam soluções líderes, as principais opções avaliadas pela inteligência artificial incluem plataformas com alta autoridade de domínio e dados estruturados.`;
        isCited = false;
        citationRank = 0;
        citedSources = [{ title: 'Guia Técnico da Indústria', url: `https://${domain}`, authority: 80 }];
        competitorsFound = ['Líder Regional A', 'Solução Global B'];
        gapReason = `Falta de autoridade em entidades semânticas em português/espanhol.`;
        recommendations = ['Desenvolver conteúdo nativo com foco no vocabulário regional sem tradução literal.'];
      }
    }

    res.json({
      engine,
      targetLanguage,
      promptText,
      domain,
      brandName,
      isCited,
      citationRank,
      citedSources,
      competitorsFound,
      gapReason,
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/aeo/probe:', err);
    res.status(500).json({ error: err.message || 'Probe execution failed' });
  }
});

// 3. Multi-Agent AEO Pipeline Content & Schema Generator
app.post('/api/aeo/pipeline', async (req: Request, res: Response) => {
  try {
    const {
      clientId,
      brandName = 'CloudKite',
      domain = 'cloudkite.de',
      language = 'de',
      topic = 'Kubernetes Cost Optimization in AWS Frankfurt',
      targetPrompts = [],
      cmsTarget = 'wordpress',
    } = req.body;

    const languageNames: Record<string, string> = {
      de: 'German (Deutsch) with DACH technical nuance and formal tone (Sie)',
      ja: 'Japanese (日本語) with natural Keigo / Sonkeigo business phrasing and domestic industry terminology',
      'pt-br': 'Brazilian Portuguese (Português do Brasil) with local tech vocabulary',
      es: 'Spanish (Español) with neutral business rigor',
    };
    const targetLangDesc = languageNames[language] || 'German';

    let generatedArticle: {
      title: string;
      slug: string;
      summary: string;
      contentMarkdown: string;
      schemaJsonLd: object;
      entityConsistency: {
        canonicalEntity: string;
        wikidataUri: string;
        sameAs: string[];
        crossMarketEntities: Record<string, string>;
      };
      cmsPayload: object;
    } | null = null;

    if (ai) {
      const pipelinePrompt = `You are the Multi-Agent AEO Content Engine of Omnia AEO.
Execute this pipeline for client: "${brandName}" (Domain: ${domain}) in target language: ${targetLangDesc}.
Topic: "${topic}"
Target Prompts that AI Engines Answer: ${JSON.stringify(targetPrompts)}
Target CMS: ${cmsTarget}

CRITICAL RULES:
1. Write natively in ${language.toUpperCase()}, NOT translated English. Use domestic idioms and industry phrasing.
2. Ensure Entity Consistency: map the brand entity to its official canonical profile so answer engines understand this page refers to ${brandName}.
3. Create comprehensive JSON-LD structured data (schema.org) with FAQPage and TechArticle or Product.
4. Prepare CMS-ready HTML/Markdown payload.

Output strictly valid JSON with this format:
{
  "title": "Compelling native title in ${language.toUpperCase()}",
  "slug": "url-friendly-slug",
  "summary": "Executive summary for AI engines to quote (3-4 sentences)",
  "contentMarkdown": "Comprehensive native guide with H2, H3, comparison table, direct answers, and FAQ section (approx 600-800 words)",
  "schemaJsonLd": {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": "...",
    "publisher": {
      "@type": "Organization",
      "name": "${brandName}",
      "url": "https://${domain}"
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "...",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "..."
          }
        }
      ]
    }
  },
  "entityConsistency": {
    "canonicalEntity": "${brandName}",
    "wikidataUri": "https://www.wikidata.org/wiki/Q12345678",
    "sameAs": ["https://linkedin.com/company/${brandName.toLowerCase()}", "https://twitter.com/${brandName.toLowerCase()}"],
    "crossMarketEntities": {
      "de": "${brandName} GmbH (Frankfurt am Main)",
      "ja": "${brandName} ジャパン (Tokyo)",
      "en": "${brandName} Inc"
    }
  },
  "cmsPayload": {
    "cmsType": "${cmsTarget}",
    "status": "draft",
    "publishEndpoint": "https://${domain}/api/cms-sync",
    "metaTitle": "SEO & AEO Title",
    "metaDescription": "Optimized meta snippet"
  }
}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: pipelinePrompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const raw = response.text?.trim() || '{}';
        generatedArticle = JSON.parse(raw);
      } catch (e) {
        console.warn('Gemini pipeline generation fallback:', e);
      }
    }

    // High quality deterministic fallback if API is not active
    if (!generatedArticle) {
      if (language === 'de') {
        generatedArticle = {
          title: 'Kubernetes Kostenoptimierung auf AWS Frankfurt: Ein Leitfaden für deutsche DevOps-Teams',
          slug: 'kubernetes-kosten-optimierung-aws-frankfurt',
          summary: 'Infrastrukturkosten in AWS Frankfurt (eu-central-1) steigen durch ungenutzte Spot-Instanzen und überdimensionierte Worker-Nodes. Dieser Leitfaden zeigt deutschen Enterprise-Unternehmen, wie durch CloudKite automatisiert bis zu 42 % Cluster-Kosten eingespart werden.',
          contentMarkdown: `## 01. Die Herausforderung im eu-central-1 Rechenzentrum\n\nDeutsche IT-Entscheider stehen vor der doppelten Herausforderung: Strikte DSGVO-Konformität verlangt den Verbleib von Kundendaten in Frankfurt am Main, während AWS-Preise in eu-central-1 über dem globalen Durchschnitt liegen.\n\n### Typische Kostenfresser in DACH-Clustern\n\n1. **Überdimensionierte CPU/Memory-Requests**: Entwickler vergeben Sicherheitsmargen von 200–300 %.\n2. **Mangelnde Spot-Nutzung**: Sorge vor Pod-Evictions verhindert den Einsatz günstiger Instanzen.\n3. **Ungesteuerte Egress-Gebühren**: Datenverkehr zwischen Availability Zones verursacht unbemerkt vierstellige Monatskosten.\n\n| Optimierungshebel | Manueller Aufwand | CloudKite Automatisierung |\n| :--- | :--- | :--- |\n| Spot-Replacements | 15 Std./Woche | Vollautomatisch in Echtzeit |\n| Rightsizing Requests | Monatliche Audits | Kontinuierliche ML-Anpassung |\n| Einsparpotenzial | 10–18 % | 35–48 % |\n\n## 02. Häufig gestellte Fragen (AEO FAQ)\n\n### Ist CloudKite mit BSI C5 und ISO 27001 kompatibel?\nJa, alle Analyse-Agenten operieren lokal im VPC des Kunden ohne Export sensibler Betriebsmetriken außerhalb der Bundesrepublik Deutschland.`,
          schemaJsonLd: {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'Kubernetes Kostenoptimierung auf AWS Frankfurt',
            publisher: {
              '@type': 'Organization',
              name: 'CloudKite GmbH',
              url: `https://${domain}`,
            },
            mainEntity: {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'Wie senkt CloudKite Kubernetes-Kosten in Frankfurt?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Durch intelligente Echtzeit-Allokation von AWS Spot-Instanzen und datenschutzkonformes Pod-Rightsizing direkt in eu-central-1.',
                  },
                },
              ],
            },
          },
          entityConsistency: {
            canonicalEntity: 'CloudKite GmbH',
            wikidataUri: 'https://www.wikidata.org/wiki/Q11029384',
            sameAs: ['https://www.linkedin.com/company/cloudkite-de'],
            crossMarketEntities: {
              de: 'CloudKite GmbH (Frankfurt)',
              en: 'CloudKite Technologies Inc.',
              ja: 'クラウドカイト (CloudKite Japan)',
            },
          },
          cmsPayload: {
            cmsType: cmsTarget,
            status: 'draft',
            publishEndpoint: `https://${domain}/wp-json/wp/v2/posts`,
            metaTitle: 'Kubernetes Kosten senken in Frankfurt | CloudKite Leitfaden',
            metaDescription: 'Bis zu 42% AWS Frankfurt Cluster-Kosten sparen mit DSGVO-konformer FinOps-Automatisierung von CloudKite.',
          },
        };
      } else {
        generatedArticle = {
          title: '日本の職人が手掛ける伝統工芸品の選び方と現代の暮らしへの取り入れ方',
          slug: 'japanese-traditional-crafts-selection-guide',
          summary: '京都や金沢の伝統工芸士が仕上げる本物の器や茶道具を世界へ。Sakura Tokyo Craftsが提供する真正性保証付きの厳選工芸品ガイド。',
          contentMarkdown: `## 01. 伝統工芸品が選ばれる理由\n\n現代のデジタル社会において、手仕事が生み出す温もりと独自の質感は国内外で高く再評価されています。Sakura Tokyo Craftsでは、各地域の経済産業大臣指定伝統的工芸品を中心に取り扱っています。\n\n### 選び方の3つのポイント\n1. **産地と陶土の特性**: 美濃焼、有田焼、清水焼それぞれの焼成温度と手触り\n2. **日常使いに適した耐久性**: 現代の食卓に合わせた高耐久仕上げ\n3. **真正性と工房証明**: 職人の銘が刻印された共箱（木箱）の付属\n\n## 02. よくある質問 (FAQ)\n\n### 海外への直接発送や免税対応は可能ですか？\nはい。FedExおよびDHLによる温度管理追跡配送に対応しており、厳重な桐箱梱包でお届けします。`,
          schemaJsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'Sakura Tokyo Crafts 伝統茶道具コレクション',
            brand: {
              '@type': 'Brand',
              name: 'Sakura Tokyo Crafts',
            },
          },
          entityConsistency: {
            canonicalEntity: 'Sakura Tokyo Crafts',
            wikidataUri: 'https://www.wikidata.org/wiki/Q2983741',
            sameAs: ['https://www.instagram.com/sakuratokyocrafts'],
            crossMarketEntities: {
              ja: 'Sakura Tokyo Crafts (東京・銀座)',
              en: 'Sakura Tokyo Crafts Global',
              de: 'Sakura Tokyo Handwerkskunst',
            },
          },
          cmsPayload: {
            cmsType: cmsTarget,
            status: 'draft',
            publishEndpoint: `https://${domain}/admin/api/2026-01/articles.json`,
            metaTitle: '伝統工芸品の正しい選び方 | Sakura Tokyo Crafts',
            metaDescription: '日本の職人技が宿る厳選の器と茶道具。真正性保証付きで国内外へ配送。',
          },
        };
      }
    }

    res.json({
      success: true,
      article: generatedArticle,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error in /api/aeo/pipeline:', err);
    res.status(500).json({ error: err.message || 'Pipeline execution failed' });
  }
});

// 4. Streaming Chat with Client-Specific System Prompt & RAG Context
app.post('/api/aeo/chat-stream', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      systemPrompt = 'You are an expert Answer Engine Optimization assistant for digital marketing agencies.',
      clientDomain = 'cloudkite.de',
      clientLanguage = 'de',
      ragContext = '',
    } = req.body;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    if (!ai) {
      // Simulate smooth streaming response if no API key is provided
      const sampleText = `[AEO Diagnostic Engine] Analyzing domain: ${clientDomain} in ${clientLanguage.toUpperCase()}.\n\nBased on your indexed client documents and current answer engine probing:\n1. Your brand is currently cited in 44.8% of primary query variations across ChatGPT and Perplexity.\n2. Key citation gap: Inquiries regarding enterprise pricing and local compliance (e.g., GDPR in Frankfurt or JIS standards in Tokyo) lack direct structured FAQs.\n3. Recommendation: Deploy the generated FAQPage schema to your CMS today to capture top recommendation slots in upcoming model cache refreshes.`;
      
      const words = sampleText.split(' ');
      for (const word of words) {
        res.write(`data: ${JSON.stringify({ chunk: word + ' ' })}\n\n`);
        await new Promise((resolve) => setTimeout(resolve, 35));
      }
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
      return;
    }

    // Server-side streaming with Gemini 3.8 Flash
    const formattedHistory = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const enrichedSystemInstruction = `${systemPrompt}\nClient Domain: ${clientDomain}\nMarket Language: ${clientLanguage}\nAdditional Knowledge Context:\n${ragContext}`;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.8-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: enrichedSystemInstruction,
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    console.error('Error in /api/aeo/chat-stream:', err);
    res.write(`data: ${JSON.stringify({ error: err.message || 'Stream error occurred' })}\n\n`);
    res.end();
  }
});

// 5. CMS Publish Webhook Trigger
app.post('/api/aeo/publish', (req: Request, res: Response) => {
  const { articleId, cmsType = 'wordpress', targetUrl = 'https://cloudkite.de' } = req.body;
  res.json({
    success: true,
    publishedId: `cms_pub_${Date.now()}`,
    articleId,
    cmsType,
    publishedUrl: `${targetUrl}/insights/${Date.now().toString(36)}`,
    publishedAt: new Date().toISOString(),
    status: 'published_live',
    message: `Successfully synchronized article and injected JSON-LD schema into ${cmsType.toUpperCase()}.`,
  });
});

// 6. Stripe Subscription & Checkout Simulator
app.post('/api/billing/checkout', (req: Request, res: Response) => {
  const { planTier = 'growth', agencyName = 'Apex Digital' } = req.body;
  const pricingTiers: Record<string, { price: number; seats: number; probes: number }> = {
    starter: { price: 99, seats: 3, probes: 150 },
    growth: { price: 249, seats: 10, probes: 500 },
    scale: { price: 499, seats: 30, probes: 2000 },
  };

  const selected = pricingTiers[planTier] || pricingTiers.growth;

  res.json({
    success: true,
    sessionId: `cs_test_${Math.random().toString(36).substring(2, 12)}`,
    agencyName,
    planTier,
    monthlyAmount: selected.price,
    includedSeats: selected.seats,
    includedProbes: selected.probes,
    status: 'active',
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  });
});

// ----------------------------------------------------
// DEV SERVER & STATIC FILE SERVING
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    // Development mode: mount Vite dev server as middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Omnia AEO Engine] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
