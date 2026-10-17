export type TargetLanguage = 'de' | 'ja' | 'pt-br' | 'es';

export type EngineType = 'chatgpt' | 'perplexity' | 'gemini' | 'googleAio';

export type PlanTier = 'starter' | 'growth' | 'scale';

export interface EngineCitationStatus {
  cited: boolean;
  rank: number; // 0 if not cited, 1-5 if cited
  snippet: string;
  sentiment: 'positive' | 'neutral' | 'negative' | 'absent';
  sources?: string[];
  lastChecked: string;
}

export interface TrackedPrompt {
  id: string;
  clientId: string;
  promptText: string;
  language: TargetLanguage;
  intent: 'commercial' | 'informational' | 'transactional' | 'navigational';
  searchVolume: number;
  engineCitations: {
    chatgpt: EngineCitationStatus;
    perplexity: EngineCitationStatus;
    gemini: EngineCitationStatus;
    googleAio: EngineCitationStatus;
  };
  lastProbedAt: string;
  citationGapScore: number; // 0-100 (higher = bigger opportunity to win citation)
  targetCompetitor?: string;
  status: 'active' | 'paused' | 'analyzing';
}

export interface ClientDomain {
  id: string;
  agencyId: string;
  name: string;
  domain: string;
  language: TargetLanguage;
  targetMarket: string;
  industry: string;
  citationScore: number; // percentage 0-100%
  promptsCount: number;
  promptsLimit: number;
  monthlyProbesCount: number;
  entityMap: {
    canonicalName: string;
    wikidataUri: string;
    sameAsUrls: string[];
    localRegistrations: Record<string, string>;
  };
  cmsConfig: {
    provider: 'wordpress' | 'shopify' | 'webflow';
    endpointUrl: string;
    autoPublish: boolean;
    lastSyncedAt?: string;
  };
  systemPrompt: string;
  activePipelineStatus: 'idle' | 'researching' | 'generating' | 'publishing';
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor: string;
  customDomain?: string;
  planTier: PlanTier;
  clientSeatsLimit: number;
  includedMonthlyProbes: number;
  stripeCustomerId: string;
  stripeSubscriptionStatus: 'active' | 'trialing' | 'past_due';
  createdDate: string;
  channels: {
    telegramEnabled: boolean;
    telegramChatId?: string;
    dingTalkEnabled: boolean;
    weChatEnabled: boolean;
    webhookUrl?: string;
  };
}

export interface AeoArticle {
  id: string;
  clientId: string;
  title: string;
  slug: string;
  language: TargetLanguage;
  status: 'draft' | 'optimized' | 'published';
  targetPrompts: string[];
  summary: string;
  contentMarkdown: string;
  schemaJsonLd: Record<string, any>;
  entityConsistency: {
    canonicalEntity: string;
    wikidataUri: string;
    sameAs: string[];
    crossMarketEntities: Record<string, string>;
  };
  cmsTarget: 'wordpress' | 'shopify' | 'webflow';
  publishedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeDoc {
  id: string;
  clientId: string;
  title: string;
  type: 'url' | 'document' | 'manual';
  content: string;
  chunksCount: number;
  tokenCount: number;
  updatedAt: string;
}

export interface UsageMetric {
  month: string;
  probesUsed: number;
  probesLimit: number;
  articlesGenerated: number;
  tokensConsumed: number;
  overageFees: number;
}
