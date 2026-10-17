import React, { useState } from 'react';
import { 
  FileText, 
  Globe2, 
  Code2, 
  Share2, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Copy,
  Layers,
  Sparkles,
  Bot
} from 'lucide-react';
import { ClientDomain, AeoArticle } from '../types/aeo';

interface ContentEngineProps {
  client: ClientDomain;
  articles: AeoArticle[];
  onOpenPipeline: () => void;
  onPublishArticle: (articleId: string) => void;
}

export const ContentEngine: React.FC<ContentEngineProps> = ({
  client,
  articles,
  onOpenPipeline,
  onPublishArticle,
}) => {
  const clientArticles = articles.filter((a) => a.clientId === client.id);
  const [selectedArticleId, setSelectedArticleId] = useState<string>(
    clientArticles[0]?.id || ''
  );
  const [activeTab, setActiveTab] = useState<'content' | 'schema' | 'entities'>('content');
  const [copied, setCopied] = useState(false);

  const selectedArticle = clientArticles.find((a) => a.id === selectedArticleId) || clientArticles[0];

  const handleCopySchema = () => {
    if (!selectedArticle) return;
    navigator.clipboard.writeText(JSON.stringify(selectedArticle.schemaJsonLd, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Content & Entity Repository</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-blue-400">{client.name}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono uppercase">{client.language}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Multilingual Content & Schema Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Native, non-translated content mapped to unified global entity profiles for maximum citation indexing.
          </p>
        </div>

        <button
          onClick={onOpenPipeline}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
        >
          <Bot className="h-3.5 w-3.5" />
          <span>Generate New Native Article</span>
        </button>
      </div>

      {/* Main Layout: List on Left, Editor/Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Article List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
            Deliverables ({clientArticles.length})
          </div>

          <div className="space-y-2">
            {clientArticles.length === 0 ? (
              <div className="p-6 text-center rounded-xl border border-slate-800 bg-slate-900/40 text-xs text-slate-500">
                No articles generated yet for this client. Run the 5-Agent Pipeline to create your first native piece.
              </div>
            ) : (
              clientArticles.map((art) => {
                const isSelected = art.id === selectedArticle?.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`cursor-pointer rounded-xl border p-4 transition-all text-xs ${
                      isSelected
                        ? 'border-blue-500 bg-slate-900/90 ring-1 ring-blue-500/40 shadow-md shadow-blue-500/5'
                        : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[10px] uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {art.language}
                      </span>
                      <span
                        className={`text-[10px] font-semibold ${
                          art.status === 'published' ? 'text-emerald-400' : 'text-blue-400'
                        }`}
                      >
                        {art.status === 'published' ? '✓ Published to CMS' : 'Ready / Optimized'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug">
                      {art.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Target: {art.cmsTarget.toUpperCase()}</span>
                      <span>{new Date(art.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Article Details & Entity Map */}
        <div className="lg:col-span-8">
          {selectedArticle ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-semibold">
                      {selectedArticle.language} Native Content
                    </span>
                    <span className="text-xs text-slate-400">Slug: /{selectedArticle.slug}</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">{selectedArticle.title}</h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPublishArticle(selectedArticle.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Push to {selectedArticle.cmsTarget.toUpperCase()}</span>
                  </button>
                </div>
              </div>

              {selectedArticle.publishedUrl && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between">
                  <span>Live on client domain:</span>
                  <a
                    href={selectedArticle.publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono underline flex items-center gap-1"
                  >
                    <span>{selectedArticle.publishedUrl}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {/* Subtabs */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'content' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Markdown Content
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'schema' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  JSON-LD Schema
                </button>
                <button
                  onClick={() => setActiveTab('entities')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    activeTab === 'entities' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cross-Language Entity Mapping
                </button>
              </div>

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                    <span className="font-semibold text-blue-400 block mb-1">Answer Engine Executive Snippet:</span>
                    <p className="text-slate-300 italic">{selectedArticle.summary}</p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                    {selectedArticle.contentMarkdown}
                  </div>
                </div>
              )}

              {/* Schema Tab */}
              {activeTab === 'schema' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Schema.org JSON-LD Structured Data</span>
                    <button
                      onClick={handleCopySchema}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1.5"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copied ? 'Copied' : 'Copy Markup'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-emerald-400 overflow-x-auto">
                    {JSON.stringify(selectedArticle.schemaJsonLd, null, 2)}
                  </pre>
                </div>
              )}

              {/* Entities Tab */}
              {activeTab === 'entities' && (
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-4 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Canonical Brand Entity</span>
                    <p className="text-white font-mono text-sm mt-0.5">{selectedArticle.entityConsistency?.canonicalEntity}</p>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Wikidata Knowledge Graph Node</span>
                    <p className="text-blue-400 font-mono text-xs mt-0.5">{selectedArticle.entityConsistency?.wikidataUri}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">Cross-Language Identity Nodes:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {Object.entries(selectedArticle.entityConsistency?.crossMarketEntities || {}).map(([lang, val]) => (
                        <div key={lang} className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                          <span className="font-mono text-[10px] text-blue-400 uppercase block">{lang} Node</span>
                          <span className="text-xs text-slate-200">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl border border-slate-800 bg-slate-900/50 text-xs text-slate-400">
              Select an article on the left to inspect content and schema markup.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
