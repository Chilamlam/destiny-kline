import React from 'react';
import { BaziChart, KlineBar, FortuneDimension } from '../types/destiny';
import { Coins, Briefcase, Heart, Activity } from 'lucide-react';

interface DimensionDetailViewProps {
  bazi: BaziChart;
  yearBars: KlineBar[];
}

const DIMENSIONS: Array<{
  id: FortuneDimension;
  title: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  desc: string;
}> = [
  {
    id: 'wealth',
    title: '财富运势 · 财帛田宅',
    icon: Coins,
    color: 'text-[#b8860b]',
    bgColor: 'bg-[#faf5eb]',
    borderColor: 'border-[#dfc384]',
    desc: '主正财薪资、偏财投资、商贸蓄藏与资产沉淀。'
  },
  {
    id: 'career',
    title: '事业运势 · 官禄功名',
    icon: Briefcase,
    color: 'text-[#2b6cb0]',
    bgColor: 'bg-[#ebf3fa]',
    borderColor: 'border-[#90caf9]',
    desc: '主职场晋升、权柄声誉、创业经营与行业地位。'
  },
  {
    id: 'romance',
    title: '感情运势 · 姻缘红鸾',
    icon: Heart,
    color: 'text-[#c53030]',
    bgColor: 'bg-[#fdf0f0]',
    borderColor: 'border-[#ef9a9a]',
    desc: '主正缘桃花、夫妻和睦、人际善缘与家室安康。'
  },
  {
    id: 'health',
    title: '健康运势 · 寿元气血',
    icon: Activity,
    color: 'text-[#2d8b68]',
    bgColor: 'bg-[#eef8f3]',
    borderColor: 'border-[#a5d6a7]',
    desc: '主五脏气血、精力精神、体质调养与劳逸平和。'
  },
];

export const DimensionDetailView: React.FC<DimensionDetailViewProps> = ({
  bazi,
  yearBars,
}) => {
  const currentYear = 2026;
  
  // Intelligent Focal Period:
  // If the person lived / lives around 2026, show 2021-2035.
  // If the person is historical (e.g. Zhang Ailing born 1920, Buffett born 1930),
  // show their golden prime 18 years (e.g. ages 20 ~ 38, or middle span)
  const matchingRecent = yearBars.filter(b => b.year >= currentYear - 5 && b.year <= currentYear + 10);
  const displayBars = matchingRecent.length > 0 
    ? matchingRecent 
    : yearBars.slice(Math.max(0, Math.min(20, yearBars.length - 16)), Math.min(yearBars.length, 38));

  // Safe fallback if bars array is still short
  const safeBars = displayBars.length > 0 ? displayBars : yearBars.slice(0, 15);
  const startYear = safeBars[0]?.year || 1990;
  const endYear = safeBars[safeBars.length - 1]?.year || 2026;
  const isHistorical = !safeBars.some(b => b.year === currentYear);

  return (
    <div className="space-y-6">
      <div className="parchment-card rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#dfd3c1] gap-2">
          <div className="flex items-center space-x-2">
            <span className="chinese-stamp text-sm">细览</span>
            <h3 className="text-xl font-bold font-serif text-[#352b20]">
              四维运势细部剖析 (财·官·情·康)
            </h3>
          </div>
          <div className="text-xs text-[#a22d1b] font-medium">
            {isHistorical ? `展示聚焦期: ${startYear}年 - ${endYear}年 (黄金代表时期)` : `展示聚焦期: ${startYear}年 - ${endYear}年 (近年及未来)`}
          </div>
        </div>
        <p className="text-xs text-[#786b59] mt-2">
          分别针对财富、事业、情感与健康建立独立的十神量化模型，清晰洞见人生各维度的起伏消长。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {DIMENSIONS.map((dim) => {
          const Icon = dim.icon;
          
          // Safe average score
          const avgScore = safeBars.length > 0
            ? Math.round(safeBars.reduce((sum, b) => sum + (b.dimensions[dim.id]?.score || 60), 0) / safeBars.length)
            : 60;

          // Safe find highest year
          const sorted = [...safeBars].sort((a, b) => (b.dimensions[dim.id]?.score || 0) - (a.dimensions[dim.id]?.score || 0));
          const bestYear = sorted[0];
          const bestScore = bestYear?.dimensions[dim.id]?.score || avgScore;

          return (
            <div key={dim.id} className="parchment-card rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#dfd3c1]">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-md ${dim.bgColor} ${dim.borderColor} border`}>
                      <Icon className={`w-5 h-5 ${dim.color}`} />
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#352b20]">{dim.title}</h4>
                      <p className="text-[11px] text-[#786b59]">{dim.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#8c7a6b]">期内均分</span>
                    <div className="font-serif font-bold text-lg text-[#352b20]">{avgScore}</div>
                  </div>
                </div>

                {/* Sparkline Visual Simulation */}
                <div className="py-4">
                  <div className="text-xs font-medium text-[#786b59] mb-2 flex justify-between">
                    <span>走势能量柱状谱</span>
                    {bestYear && (
                      <span className="text-[#a22d1b]">
                        巅峰年景: {bestYear.year}年 ({bestScore}分)
                      </span>
                    )}
                  </div>
                  <div className="flex items-end h-20 gap-1 bg-[#f5eedf]/50 p-2 rounded border border-[#dfd3c1]">
                    {safeBars.map((b) => {
                      const score = b.dimensions[dim.id]?.score || 50;
                      const heightPct = Math.max(15, Math.min(100, ((score - 25) / 72) * 100));
                      const isNow = b.year === currentYear;

                      return (
                        <div
                          key={b.year}
                          className="flex-1 flex flex-col items-center justify-end h-full group relative"
                        >
                          <div
                            className={`w-full rounded-t-sm transition-all duration-300 ${
                              isNow
                                ? 'bg-[#c93f28]'
                                : b.isFuture
                                ? 'bg-[#a88960]/60'
                                : 'bg-[#544332]'
                            }`}
                            style={{ height: `${heightPct}%` }}
                          />
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center bg-[#2c2523] text-white text-[10px] px-1.5 py-0.5 rounded shadow z-10 whitespace-nowrap pointer-events-none">
                            <span>{b.year}年({b.age}岁): {score}分</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-[#8c7a6b] mt-1 px-1">
                    <span>{startYear}年</span>
                    {!isHistorical && <span className="text-[#c93f28] font-bold">今·2026</span>}
                    <span>{endYear}年</span>
                  </div>
                </div>
              </div>

              {/* Guidance Tips */}
              <div className="pt-3 border-t border-[#dfd3c1] text-xs text-[#786b59]">
                <strong>修持要诀:</strong>{' '}
                {dim.id === 'wealth' && '稳健为上，聚沙成塔。遇冲克年宜守成不宜孤注一掷。'}
                {dim.id === 'career' && '行正道以立身，顺天时而乘势。大运转换期当敢为人先。'}
                {dim.id === 'romance' && '相濡以沫，以包容相待。遇红鸾岁运宜缔结婚盟。'}
                {dim.id === 'health' && '顺应四季阴阳，节饮食、慎起居，神清气爽自然百病不侵。'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
