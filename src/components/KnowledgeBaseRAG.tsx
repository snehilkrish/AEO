import React, { useState, useRef, useEffect } from 'react';
import { 
  Database, 
  Send, 
  Upload, 
  FileText, 
  Link as LinkIcon, 
  Sparkles, 
  Plus, 
  Trash2, 
  RefreshCw,
  Bot,
  User,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { ClientDomain, KnowledgeDoc } from '../types/aeo';

interface KnowledgeBaseRAGProps {
  client: ClientDomain;
  docs: KnowledgeDoc[];
  onAddDoc: (newDoc: Partial<KnowledgeDoc>) => void;
  onUpdateSystemPrompt: (prompt: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const KnowledgeBaseRAG: React.FC<KnowledgeBaseRAGProps> = ({
  client,
  docs,
  onAddDoc,
  onUpdateSystemPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'docs' | 'prompt'>('chat');
  const [systemPrompt, setSystemPrompt] = useState(client.systemPrompt);
  const [promptSaved, setPromptSaved] = useState(false);

  // Ingestion modal state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docType, setDocType] = useState<'document' | 'url' | 'manual'>('document');
  const [docContent, setDocContent] = useState('');

  // Streaming chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm_welcome',
      role: 'assistant',
      content: `[Omnia AEO Assistant] Connected to ${client.name} knowledge base (${client.language.toUpperCase()} market). How can I help optimize your citations and prompt presence today?`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const clientDocs = docs.filter((d) => d.clientId === client.id);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSaveSystemPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSystemPrompt(systemPrompt);
    setPromptSaved(true);
    setTimeout(() => setPromptSaved(false), 2000);
  };

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !docContent) return;

    const words = docContent.split(/\s+/).length;
    const estChunks = Math.max(1, Math.ceil(words / 120));

    onAddDoc({
      clientId: client.id,
      title: docTitle,
      type: docType,
      content: docContent,
      chunksCount: estChunks,
      tokenCount: Math.round(words * 1.3),
      updatedAt: new Date().toISOString(),
    });

    setShowUploadModal(false);
    setDocTitle('');
    setDocContent('');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isStreaming) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    const assistantMsgId = `asst_${Date.now()}`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMsg, initialAssistantMsg]);
    setIsStreaming(true);

    try {
      // Gather RAG context from client docs
      const ragSnippets = clientDocs
        .map((d) => `Document: ${d.title}\nContent:\n${d.content}`)
        .join('\n\n---\n\n');

      const response = await fetch('/api/aeo/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          systemPrompt,
          clientDomain: client.domain,
          clientLanguage: client.language,
          ragContext: ragSnippets,
        }),
      });

      if (!response.body) throw new Error('No streaming body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                accumulated += data.chunk;
                setChatMessages((prev) =>
                  prev.map((m) => (m.id === assistantMsgId ? { ...m, content: accumulated } : m))
                );
              }
            } catch {
              // chunk parse skip
            }
          }
        }
      }
    } catch (err: any) {
      setChatMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, content: `Error during streaming response: ${err.message}` }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Client Grounding & Assistant</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-blue-400">{client.name}</span>
            <span aria-hidden="true">·</span>
            <span>{clientDocs.length} Ingested Docs</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Knowledge Base (RAG) & Streaming Chat
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ground answer engine agents in client-specific documents, brand identity, and custom editable system prompts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-500/20"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Ingest Doc / URL</span>
          </button>
        </div>
      </div>

      {/* Mode Sub-navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'chat' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Streaming LLM Testing
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'docs' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Knowledge Repository ({clientDocs.length})
        </button>
        <button
          onClick={() => setActiveTab('prompt')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
            activeTab === 'prompt' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white'
          }`}
        >
          Editable Client System Prompt
        </button>
      </div>

      {/* Chat View */}
      {activeTab === 'chat' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 flex flex-col h-[600px] overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {chatMessages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 text-xs ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isAssistant ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'
                    }`}
                  >
                    {isAssistant ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>

                  <div
                    className={`max-w-xl rounded-xl p-3.5 leading-relaxed whitespace-pre-wrap ${
                      isAssistant
                        ? 'bg-slate-950 border border-slate-800 text-slate-200'
                        : 'bg-blue-600 text-white font-medium'
                    }`}
                  >
                    {msg.content || (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        <span>Generating answer from client RAG...</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Quick Question Chips */}
          <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-slate-500 shrink-0">Sample prompts:</span>
            {client.language === 'de' ? (
              <>
                <button
                  onClick={() => setInputMessage('Wie heben wir CloudKite von Cast AI für deutsche Kubernetes-Nutzer ab?')}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white text-slate-300 whitespace-nowrap"
                >
                  CloudKite vs Cast AI (DE)
                </button>
                <button
                  onClick={() => setInputMessage('Welche DSGVO-Zertifizierungen müssen im TechArticle Schema betont werden?')}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white text-slate-300 whitespace-nowrap"
                >
                  DSGVO & BSI C5 Compliance
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setInputMessage('海外の茶道愛好家に向けた共箱と真正性証明の訴求方法を教えて')}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white text-slate-300 whitespace-nowrap"
                >
                  伝統工芸真正性保証 (JA)
                </button>
                <button
                  onClick={() => setInputMessage('有田焼と美濃焼の海外D2C配送における温度管理の強調ポイント')}
                  className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded hover:text-white text-slate-300 whitespace-nowrap"
                >
                  越境EC配送体制
                </button>
              </>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask the AEO assistant about ${client.name} in ${client.language.toUpperCase()}...`}
              disabled={isStreaming}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-lg py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isStreaming || !inputMessage.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Documents View */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientDocs.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 text-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-slate-800 text-blue-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{doc.title}</h4>
                      <span className="text-[11px] text-slate-400">
                        {doc.chunksCount} chunks · {doc.tokenCount.toLocaleString()} tokens
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                    {doc.type}
                  </span>
                </div>

                <p className="text-slate-300 bg-slate-950 p-3 rounded border border-slate-800/80 font-mono text-[11px] leading-relaxed line-clamp-4">
                  {doc.content}
                </p>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span>Last indexed: {new Date(doc.updatedAt).toLocaleDateString()}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Active in RAG context</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editable System Prompt View */}
      {activeTab === 'prompt' && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Client System Prompt & Persona</h3>
            <p className="text-xs text-slate-400 mt-1">
              Controls model voice, terminology restrictions, tone of voice, and regulatory guidelines when generating content and answering citations.
            </p>
          </div>

          <form onSubmit={handleSaveSystemPrompt} className="space-y-4">
            <textarea
              rows={6}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-blue-500"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Variables automatically injected: <code className="text-blue-400">&#123;domain&#125;</code>, <code className="text-blue-400">&#123;targetLanguage&#125;</code>, <code className="text-blue-400">&#123;ragContext&#125;</code>
              </span>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {promptSaved ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save System Prompt</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ingest Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Ingest Knowledge Asset (RAG)</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateDoc} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Document / Resource Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. European FinOps Pricing & Whitepaper 2026"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Source Type</label>
                <select
                  value={docType}
                  onChange={(e: any) => setDocType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="document">Technical Document / Whitepaper</option>
                  <option value="url">Web URL Scraping</option>
                  <option value="manual">Manual Brand Guidelines</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Content / Extracted Text</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste article, entity facts, product catalog specifications, or company background..."
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 text-slate-300 hover:text-white">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg">
                  Chunk, Embed & Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
