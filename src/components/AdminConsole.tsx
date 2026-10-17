import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Building2, 
  Activity, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  RefreshCw,
  Bell,
  Cpu
} from 'lucide-react';
import { Agency, ClientDomain, TrackedPrompt } from '../types/aeo';

interface AdminConsoleProps {
  agencies: Agency[];
  clients: ClientDomain[];
  prompts: TrackedPrompt[];
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({
  agencies,
  clients,
  prompts,
}) => {
  const [telegramStatus, setTelegramStatus] = useState<boolean>(true);
  const [dingTalkStatus, setDingTalkStatus] = useState<boolean>(false);
  const [weChatStatus, setWeChatStatus] = useState<boolean>(true);
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const totalProbes = clients.reduce((acc, c) => acc + c.monthlyProbesCount, 0);
  const totalPrompts = prompts.length;

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg) return;
    setBroadcastSent(true);
    setTimeout(() => {
      setBroadcastSent(false);
      setBroadcastMsg('');
    }, 2500);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-red-400 font-semibold flex items-center gap-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Platform Super-Admin</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Multi-Tenant Node Controller</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Global Admin & Infrastructure View
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Omnia AEO multi-agency management, LLM tokens telemetry, and AionUi multi-channel dispatchers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-slate-900 border border-slate-800 text-emerald-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>Worker Queue: Healthy</span>
          </span>
        </div>
      </div>

      {/* Aggregate Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs text-slate-400 block mb-1">Registered Agencies</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">{agencies.length}</span>
            <span className="text-xs text-blue-400">Tenants</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Apex Digital & partners</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs text-slate-400 block mb-1">Total Client Domains</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">{clients.length}</span>
            <span className="text-xs text-slate-400">Active</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">DACH, Japan, LATAM, Spain</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs text-slate-400 block mb-1">Tracked Engine Prompts</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">{totalPrompts}</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Across 4 major AI engines</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
          <span className="text-xs text-slate-400 block mb-1">Monthly AI Probe Calls</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white font-mono tabular-nums">{totalProbes}</span>
            <span className="text-xs text-emerald-400">99.8% OK</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Gemini 3.8 Flash + Scrapers</span>
        </div>
      </div>

      {/* Agency Tenants Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">Agency Tenants & Subscriptions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium pb-2">
                <th className="py-2.5 px-3">Agency Name</th>
                <th className="py-2.5 px-3">Plan Tier</th>
                <th className="py-2.5 px-3">Domains</th>
                <th className="py-2.5 px-3">White-Label Domain</th>
                <th className="py-2.5 px-3">Stripe Status</th>
                <th className="py-2.5 px-3">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {agencies.map((a) => (
                <tr key={a.id} className="hover:bg-slate-900 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{a.name}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono uppercase bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded text-[10px]">
                      {a.planTier}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono">{clients.filter((c) => c.agencyId === a.id).length} / {a.clientSeatsLimit}</td>
                  <td className="py-3 px-3 font-mono text-slate-400">{a.customDomain || 'aeo.agency.com'}</td>
                  <td className="py-3 px-3 text-emerald-400 font-semibold">Active</td>
                  <td className="py-3 px-3 text-slate-400">{a.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Channel Alerts Engine (AionUi Re-use) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-400" />
            <span>Multi-Channel Notification Dispatcher (AionUi Interface)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch real-time citation alerts and weekly digest notifications across Telegram, DingTalk, and WeChat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Telegram */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Telegram Bot</span>
              <button
                onClick={() => setTelegramStatus(!telegramStatus)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  telegramStatus ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {telegramStatus ? 'Connected' : 'Disabled'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Dispatches instant alerts when a client loses or wins a ChatGPT citation.
            </p>
            <div className="font-mono text-[10px] text-slate-500">Channel: @apexdigital_aeo_bot</div>
          </div>

          {/* DingTalk */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">DingTalk Group Webhook</span>
              <button
                onClick={() => setDingTalkStatus(!dingTalkStatus)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  dingTalkStatus ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {dingTalkStatus ? 'Connected' : 'Inactive'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Enterprise group alert webhook for Asian agency marketing teams.
            </p>
            <div className="font-mono text-[10px] text-slate-500">Signature: HMAC-SHA256</div>
          </div>

          {/* WeChat */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">WeChat Work Bot</span>
              <button
                onClick={() => setWeChatStatus(!weChatStatus)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  weChatStatus ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {weChatStatus ? 'Connected' : 'Disabled'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Automated weekly executive reporting pushed to client executives.
            </p>
            <div className="font-mono text-[10px] text-slate-500">Webhook: https://qyapi.weixin...</div>
          </div>
        </div>

        {/* Broadcast Notification Form */}
        <form onSubmit={handleSendBroadcast} className="pt-4 border-t border-slate-800 space-y-3 text-xs">
          <label className="block text-slate-300 font-medium">
            Test Multi-Channel Broadcast Message
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. [Weekly AEO Alert] CloudKite GmbH now ranks #1 in Perplexity for DACH FinOps queries."
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!broadcastMsg}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              {broadcastSent ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Broadcast Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Dispatch Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
