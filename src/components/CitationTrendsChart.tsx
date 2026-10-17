import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { ClientDomain } from '../types/aeo';

interface CitationTrendsChartProps {
  client: ClientDomain;
}

const getHistoricalData = (language: string) => {
  if (language === 'ja') {
    return [
      { week: 'W1 Aug', chatgpt: 42, perplexity: 50, gemini: 35, googleAio: 45, positive: 58, neutral: 32, absent: 10 },
      { week: 'W2 Aug', chatgpt: 45, perplexity: 52, gemini: 38, googleAio: 48, positive: 61, neutral: 30, absent: 9 },
      { week: 'W3 Aug', chatgpt: 48, perplexity: 58, gemini: 40, googleAio: 50, positive: 64, neutral: 28, absent: 8 },
      { week: 'W4 Aug', chatgpt: 50, perplexity: 62, gemini: 44, googleAio: 54, positive: 66, neutral: 26, absent: 8 },
      { week: 'W1 Sep', chatgpt: 55, perplexity: 65, gemini: 46, googleAio: 55, positive: 68, neutral: 25, absent: 7 },
      { week: 'W2 Sep', chatgpt: 58, perplexity: 68, gemini: 48, googleAio: 58, positive: 70, neutral: 24, absent: 6 },
      { week: 'W3 Sep', chatgpt: 62, perplexity: 70, gemini: 50, googleAio: 59, positive: 72, neutral: 23, absent: 5 },
      { week: 'W4 Sep', chatgpt: 65, perplexity: 72, gemini: 51, googleAio: 60, positive: 74, neutral: 21, absent: 5 },
      { week: 'W1 Oct', chatgpt: 68, perplexity: 74, gemini: 52, googleAio: 61, positive: 76, neutral: 20, absent: 4 },
    ];
  }
  return [
    { week: 'W1 Aug', chatgpt: 28, perplexity: 34, gemini: 20, googleAio: 30, positive: 45, neutral: 35, absent: 20 },
    { week: 'W2 Aug', chatgpt: 30, perplexity: 38, gemini: 24, googleAio: 32, positive: 48, neutral: 34, absent: 18 },
    { week: 'W3 Aug', chatgpt: 35, perplexity: 42, gemini: 28, googleAio: 36, positive: 52, neutral: 33, absent: 15 },
    { week: 'W4 Aug', chatgpt: 38, perplexity: 46, gemini: 30, googleAio: 40, positive: 55, neutral: 32, absent: 13 },
    { week: 'W1 Sep', chatgpt: 40, perplexity: 52, gemini: 34, googleAio: 42, positive: 58, neutral: 30, absent: 12 },
    { week: 'W2 Sep', chatgpt: 44, perplexity: 56, gemini: 38, googleAio: 44, positive: 62, neutral: 28, absent: 10 },
    { week: 'W3 Sep', chatgpt: 46, perplexity: 60, gemini: 40, googleAio: 48, positive: 65, neutral: 26, absent: 9 },
    { week: 'W4 Sep', chatgpt: 50, perplexity: 64, gemini: 44, googleAio: 50, positive: 68, neutral: 24, absent: 8 },
    { week: 'W1 Oct', chatgpt: 52, perplexity: 68, gemini: 48, googleAio: 54, positive: 72, neutral: 22, absent: 6 },
  ];
};

export const CitationTrendsChart: React.FC<CitationTrendsChartProps> = ({ client }) => {
  const [metricMode, setMetricMode] = useState<'frequency' | 'sentiment'>('frequency');
  const data = getHistoricalData(client.language);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-2xl border border-white/[0.12] bg-neutral-950/95 p-4 text-xs shadow-2xl backdrop-blur-2xl">
          <div className="font-bold text-white mb-2 pb-1.5 border-b border-white/[0.08] flex items-center justify-between gap-6">
            <span>{label}</span>
            <span className="text-[10px] uppercase font-mono text-neutral-400">{client.targetMarket}</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-5">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-neutral-300 capitalize">{entry.name}:</span>
                </span>
                <span className="font-bold text-white tabular-nums">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-3xl apple-glass-card p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400 block mb-0.5">
            Performance Velocity
          </span>
          <h3 className="text-xl font-bold tracking-tight text-white">
            Citation Trends & Engine Distribution
          </h3>
        </div>

        {/* Apple Segmented Control */}
        <div className="flex items-center p-1 bg-black/40 border border-white/[0.08] rounded-full shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <button
            onClick={() => setMetricMode('frequency')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              metricMode === 'frequency'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Engine Frequency
          </button>
          <button
            onClick={() => setMetricMode('sentiment')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              metricMode === 'sentiment'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sentiment Split
          </button>
        </div>
      </div>

      {/* Apple Health Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[11px] text-neutral-400 block font-medium">ChatGPT Citation</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-bold font-mono text-white text-xl tabular-nums">
              {data[data.length - 1].chatgpt}%
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">+24%</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[11px] text-neutral-400 block font-medium">Perplexity Pro</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-bold font-mono text-white text-xl tabular-nums">
              {data[data.length - 1].perplexity}%
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">+34%</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[11px] text-neutral-400 block font-medium">Gemini 3.8</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-bold font-mono text-white text-xl tabular-nums">
              {data[data.length - 1].gemini}%
            </span>
            <span className="text-[10px] text-blue-400 font-semibold">+28%</span>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
          <span className="text-[11px] text-neutral-400 block font-medium">Google AI Overviews</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-bold font-mono text-white text-xl tabular-nums">
              {data[data.length - 1].googleAio}%
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">+24%</span>
          </div>
        </div>
      </div>

      {/* Smooth Apple Chart Area */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metricMode === 'frequency' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="applePerplexity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0071E3" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0071E3" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="appleChatgpt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#30D158" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#30D158" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="appleGoogleAio" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BF5AF2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#BF5AF2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="appleGemini" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64D2FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#64D2FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="week" stroke="#86868B" fontSize={11} tickLine={false} />
              <YAxis stroke="#86868B" fontSize={11} domain={[0, 100]} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#86868B' }}
              />
              <Area
                type="monotone"
                dataKey="perplexity"
                name="Perplexity Pro"
                stroke="#0071E3"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#applePerplexity)"
              />
              <Area
                type="monotone"
                dataKey="chatgpt"
                name="ChatGPT 4o"
                stroke="#30D158"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#appleChatgpt)"
              />
              <Area
                type="monotone"
                dataKey="googleAio"
                name="Google AI Overviews"
                stroke="#BF5AF2"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#appleGoogleAio)"
              />
              <Area
                type="monotone"
                dataKey="gemini"
                name="Gemini 3.8"
                stroke="#64D2FF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#appleGemini)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="applePositive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#30D158" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#30D158" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="appleNeutral" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9F0A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF9F0A" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="appleAbsent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF453A" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF453A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="week" stroke="#86868B" fontSize={11} tickLine={false} />
              <YAxis stroke="#86868B" fontSize={11} domain={[0, 100]} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', color: '#86868B' }}
              />
              <Area
                type="monotone"
                dataKey="positive"
                name="Positive Recommendation"
                stroke="#30D158"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#applePositive)"
              />
              <Area
                type="monotone"
                dataKey="neutral"
                name="Neutral Mention"
                stroke="#FF9F0A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#appleNeutral)"
              />
              <Area
                type="monotone"
                dataKey="absent"
                name="Uncited Gap"
                stroke="#FF453A"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#appleAbsent)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
