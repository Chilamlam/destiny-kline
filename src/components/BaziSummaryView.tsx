import React from 'react';
import { BaziChart } from '../types/destiny';
import { ShieldCheck, Flame, Compass, Zap, HelpCircle } from 'lucide-react';

interface BaziSummaryViewProps {
  bazi: BaziChart;
}

const WUXING_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '金': { bg: 'bg-[#faf0d9]', text: 'text-[#9c721d]', border: 'border-[#dfc384]' },
  '木': { bg: 'bg-[#eaf4ec]', text: 'text-[#2e7d32]', border: 'border-[#a5d6a7]' },
  '水': { bg: 'bg-[#e6f0fa]', text: 'text-[#1976d2]', border: 'border-[#90caf9]' },
  '火': { bg: 'bg-[#fdebee]', text: 'text-[#c62828]', border: 'border-[#ef9a9a]' },
  '土': { bg: 'bg-[#f5ede6]', text: 'text-[#8d6e63]', border: 'border-[#d7ccc8]' },
};

export const BaziSummaryView: React.FC<BaziSummaryViewProps> = ({ bazi }) => {
  const pillars = [
    { title: '年柱 · 祖业根基', p: bazi.yearPillar },
    { title: '月柱 · 父母事业', p: bazi.monthPillar },
    { title: '日柱 · 命元夫妻', p: bazi.dayPillar, isDayMaster: true },
    { 
      title: bazi.hourPillar.zhi === '子' 
        ? (bazi.solarBirth.includes('晚子') ? '时柱 · 晚子时' : '时柱 · 早子时') 
        : '时柱 · 子女归宿', 
      p: bazi.hourPillar 
    },
  ];

  const totalWxCount = Object.values(bazi.wuXingCount).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-6">
      {/* 1. Four Pillars Ancient Scroll Card */}
      <div className="parchment-card rounded-lg p-5">
        <div className="flex items-center space-x-2 border-b border-[#dfd3c1] pb-3 mb-4">
          <span className="chinese-stamp text-sm">要诀</span>
          <h3 className="text-xl font-bold font-serif text-[#352b20]">
            四柱命盘 · 天干地支藏干总揽
          </h3>
          <span className="text-xs text-[#786b59] ml-2">
            ({bazi.solarBirth} / {bazi.lunarBirth})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {pillars.map((item, idx) => {
            const p = item.p;
            const ganColor = WUXING_COLORS[p.wuXingGan] || WUXING_COLORS['木'];
            const zhiColor = WUXING_COLORS[p.wuXingZhi] || WUXING_COLORS['土'];

            return (
              <div
                key={idx}
                className={`rounded-lg border p-3 flex flex-col items-center relative transition hover:shadow-md ${
                  item.isDayMaster
                    ? 'border-[#c93f28] bg-[#fbf5f4]'
                    : 'border-[#dfd3c1] bg-[#fdfbf7]'
                }`}
              >
                {item.isDayMaster && (
                  <span className="absolute -top-2.5 bg-[#c93f28] text-white text-[10px] px-2 py-0.5 rounded-full font-serif font-bold shadow-xs">
                    自身本命
                  </span>
                )}

                <span className="text-xs font-serif text-[#786b59] mb-2">{item.title}</span>

                {/* Ten Gods of Stem */}
                <span className="text-xs font-medium text-[#8c7a6b] mb-1">
                  {p.shiShenGan}
                </span>

                {/* Heavenly Stem */}
                <div
                  className={`w-12 h-12 rounded-md flex flex-col items-center justify-center border font-serif text-2xl font-bold shadow-xs mb-2 ${ganColor.bg} ${ganColor.text} ${ganColor.border}`}
                >
                  {p.gan}
                  <span className="text-[9px] font-normal opacity-80">{p.wuXingGan}</span>
                </div>

                {/* Earthly Branch */}
                <div
                  className={`w-12 h-12 rounded-md flex flex-col items-center justify-center border font-serif text-2xl font-bold shadow-xs mb-2 ${zhiColor.bg} ${zhiColor.text} ${zhiColor.border}`}
                >
                  {p.zhi}
                  <span className="text-[9px] font-normal opacity-80">{p.wuXingZhi}</span>
                </div>

                {/* Hidden Stems & Ten Gods */}
                <div className="text-[11px] text-[#786b59] text-center space-y-0.5 mt-1 border-t border-[#dfd3c1]/60 pt-2 w-full">
                  <div>
                    藏干: <span className="font-serif font-medium">{p.cangGan.join(' ')}</span>
                  </div>
                  <div className="text-[10px] text-[#8c7a6b]">
                    {p.shiShenZhi.join(' · ')}
                  </div>
                  <div className="text-[10px] text-[#a22d1b] font-medium pt-1">
                    纳音: {p.naYin}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Five Elements & Day Master Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Five Elements Bar Graph */}
        <div className="parchment-card rounded-lg p-5">
          <div className="flex items-center space-x-2 border-b border-[#dfd3c1] pb-3 mb-4">
            <Flame className="w-5 h-5 text-[#c93f28]" />
            <h4 className="text-base font-bold font-serif text-[#352b20]">五行旺衰分布</h4>
          </div>

          <div className="space-y-3">
            {[
              { name: '金', count: bazi.wuXingCount.jin, color: '#b8860b', barBg: 'bg-[#d4af37]' },
              { name: '木', count: bazi.wuXingCount.mu, color: '#2d8b68', barBg: 'bg-[#2d8b68]' },
              { name: '水', count: bazi.wuXingCount.shui, color: '#2b6cb0', barBg: 'bg-[#3182ce]' },
              { name: '火', count: bazi.wuXingCount.huo, color: '#c93f28', barBg: 'bg-[#e53e3e]' },
              { name: '土', count: bazi.wuXingCount.tu, color: '#8d6e63', barBg: 'bg-[#a1887f]' },
            ].map(item => {
              const pct = Math.round((item.count / totalWxCount) * 100);
              return (
                <div key={item.name} className="flex items-center space-x-3 text-xs">
                  <span className="w-6 font-serif font-bold text-sm text-[#352b20]">
                    {item.name}
                  </span>
                  <div className="flex-1 h-3.5 bg-[#efe6d5] rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${item.barBg}`}
                      style={{ width: `${Math.max(8, pct)}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-[#544332] font-medium">
                    {item.count}个 ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-[#dfd3c1] text-xs text-[#786b59] leading-relaxed">
            五行生克以流通平衡为贵。偏旺者宜泄耗，衰微者宜生扶，知所短而长其智。
          </div>
        </div>

        {/* Day Master & Favorable/Unfavorable Gods */}
        <div className="parchment-card rounded-lg p-5">
          <div className="flex items-center space-x-2 border-b border-[#dfd3c1] pb-3 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#2d8b68]" />
            <h4 className="text-base font-bold font-serif text-[#352b20]">身元格局与喜用神</h4>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded bg-[#f5eedf] border border-[#dfd3c1]">
              <span className="text-[#544332]">命主格局定判:</span>
              <span className="font-serif font-bold text-sm text-[#a22d1b]">
                【{bazi.dayMasterStrength}】
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#eaf4ec] border border-[#a5d6a7]">
              <span className="text-[#2e7d32] font-medium">喜用神 (补益助力):</span>
              <span className="font-serif font-bold text-sm text-[#1b5e20]">
                {bazi.xiYongShen.map(s => `【${s}】`).join(' ')}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-[#fdebee] border border-[#ef9a9a]">
              <span className="text-[#c62828] font-medium">忌神 (防范克耗):</span>
              <span className="font-serif font-bold text-sm text-[#b71c1c]">
                {bazi.jiShen.map(s => `【${s}】`).join(' ')}
              </span>
            </div>

            <div className="p-3 rounded bg-[#fdfbf7] border border-[#dfd3c1] text-[#786b59] leading-relaxed">
              <strong>命理精要：</strong>
              日元为【{bazi.dayMaster}（{bazi.dayMasterElement}）】，五行取用以
              <span className="text-[#2e7d32] font-semibold"> {bazi.xiYongShen.join('、')} </span>
              为调候护卫之神。凡流年行经喜用方位与岁干，气机顺畅；遇忌神冲克，宜潜修慎动。
            </div>
          </div>
        </div>
      </div>

      {/* 3. DaYun Ten-Year Cycles */}
      <div className="parchment-card rounded-lg p-5">
        <div className="flex items-center space-x-2 border-b border-[#dfd3c1] pb-3 mb-4">
          <Compass className="w-5 h-5 text-[#4a55a2]" />
          <h4 className="text-base font-bold font-serif text-[#352b20]">
            大运顺布排局 (十年一运)
          </h4>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
          {bazi.daYun.map((dy) => (
            <div
              key={dy.index}
              className="p-2.5 rounded bg-[#f5eedf]/80 border border-[#dfd3c1] text-center hover:bg-[#efe6d5] transition"
            >
              <div className="text-[11px] text-[#8c7a6b]">
                {dy.startAge}-{dy.endAge}岁
              </div>
              <div className="font-serif font-bold text-base text-[#352b20] my-1">
                {dy.ganZhi}
              </div>
              <div className="text-[10px] text-[#a22d1b] font-medium">
                {dy.shiShen}
              </div>
              <div className="text-[9px] text-[#786b59] mt-0.5">
                {dy.startYear}年起
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
