import React from 'react';
import { BaziChart, KlineBar } from '../types/destiny';
import { TrendingUp, AlertTriangle, Sparkles, Compass, ShieldAlert, Award } from 'lucide-react';

interface FutureProjectionViewProps {
  bazi: BaziChart;
  yearBars: KlineBar[];
}

export const FutureProjectionView: React.FC<FutureProjectionViewProps> = ({
  bazi,
  yearBars,
}) => {
  const currentYear = 2026;
  const futureBars = yearBars.filter(b => b.year >= currentYear).slice(0, 15);

  // Top 3 peak fortune years
  const peakYears = [...futureBars].sort((a, b) => b.score - a.score).slice(0, 3);
  // Bottom 2 caution years
  const cautionYears = [...futureBars].sort((a, b) => a.score - b.score).slice(0, 2);

  return (
    <div className="space-y-6">
      {/* 1. Header Card */}
      <div className="parchment-card rounded-lg p-5">
        <div className="flex items-center space-x-2 border-b border-[#dfd3c1] pb-3 mb-4">
          <span className="chinese-stamp text-sm">推演</span>
          <h3 className="text-xl font-bold font-serif text-[#352b20]">
            未来十五年运势推演谱 (2026 - 2040)
          </h3>
          <span className="text-xs text-[#786b59] ml-2">
            结合大运流年五行生克、神煞吉凶与天干地支刑冲破害
          </span>
        </div>

        {/* Highlight Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Golden Peak Fortune Years */}
          <div className="p-4 rounded-lg bg-[#f0f8f3] border border-[#b2dfdb]">
            <div className="flex items-center space-x-2 text-[#2e7d32] font-serif font-bold text-sm mb-2">
              <Award className="w-4 h-4" />
              <span>未来运势高光黄金之岁 (宜乘胜出击)</span>
            </div>
            <div className="space-y-2">
              {peakYears.map((bar) => (
                <div key={bar.year} className="flex items-center justify-between text-xs bg-white/70 p-2 rounded">
                  <span className="font-serif font-bold text-[#1b5e20]">
                    {bar.year} {bar.ganZhi}年 (周岁{bar.age})
                  </span>
                  <span className="text-[#2e7d32] font-semibold">
                    运势指数: {bar.score} 分
                  </span>
                  <span className="text-[11px] text-[#558b2f]">
                    {bar.stars.length > 0 ? bar.stars.join(' ') : '诸星顺行'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Caution Alert Years */}
          <div className="p-4 rounded-lg bg-[#fef5f4] border border-[#ffcdd2]">
            <div className="flex items-center space-x-2 text-[#c62828] font-serif font-bold text-sm mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>注意蛰伏潜修之岁 (宜守静防微)</span>
            </div>
            <div className="space-y-2">
              {cautionYears.map((bar) => (
                <div key={bar.year} className="flex items-center justify-between text-xs bg-white/70 p-2 rounded">
                  <span className="font-serif font-bold text-[#b71c1c]">
                    {bar.year} {bar.ganZhi}年 (周岁{bar.age})
                  </span>
                  <span className="text-[#c62828] font-semibold">
                    运势指数: {bar.score} 分
                  </span>
                  <span className="text-[11px] text-[#d32f2f]">
                    {bar.interrelations.length > 0 ? bar.interrelations.join(' ') : '岁气微克'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Chronological Future Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {futureBars.map((bar) => {
          const isHigh = bar.score >= 70;
          const isLow = bar.score <= 52;

          return (
            <div
              key={bar.year}
              className={`parchment-card rounded-lg p-4 border transition hover:shadow-md ${
                isHigh
                  ? 'border-[#81c784] bg-[#f9fdfa]'
                  : isLow
                  ? 'border-[#e57373] bg-[#fffbfb]'
                  : 'border-[#dfd3c1]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-[#dfd3c1]/70 pb-2 mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-bold text-base text-[#352b20]">
                    {bar.year} {bar.ganZhi}
                  </span>
                  <span className="text-xs text-[#786b59]">周岁 {bar.age}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`font-serif font-bold text-sm ${
                      isHigh ? 'text-[#2e7d32]' : isLow ? 'text-[#c62828]' : 'text-[#544332]'
                    }`}
                  >
                    {bar.score} 分
                  </span>
                </div>
              </div>

              <div className="text-xs space-y-1.5 text-[#544332]">
                <div className="flex items-center justify-between text-[11px] text-[#786b59]">
                  <span>大运: <strong>{bar.daYunName}</strong></span>
                  <span>事件量: <strong>{bar.volume}</strong></span>
                </div>

                {bar.stars.length > 0 && (
                  <div className="text-[11px] text-[#a22d1b] font-medium">
                    ★ 神煞: {bar.stars.join(' · ')}
                  </div>
                )}

                {bar.interrelations.length > 0 && (
                  <div className="text-[11px] text-[#c93f28]">
                    ⚡ 刑冲: {bar.interrelations.join(' · ')}
                  </div>
                )}

                <p className="text-xs text-[#786b59] italic pt-1 border-t border-[#dfd3c1]/50">
                  批语: {bar.summaryAdvice}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
