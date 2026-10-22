import React, { useState } from 'react';
import { BaziChart, KlineBar } from '../types/destiny';
import { BookOpen, Search, ArrowUpDown, Filter } from 'lucide-react';

interface ChronicleViewProps {
  bazi: BaziChart;
  yearBars: KlineBar[];
}

export const ChronicleView: React.FC<ChronicleViewProps> = ({
  bazi,
  yearBars,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyEvents, setOnlyEvents] = useState(false);

  const filteredBars = yearBars.filter(bar => {
    const matchesSearch = 
      bar.year.toString().includes(searchTerm) ||
      bar.ganZhi.includes(searchTerm) ||
      bar.daYunName.includes(searchTerm) ||
      bar.stars.some(s => s.includes(searchTerm)) ||
      bar.summaryAdvice.includes(searchTerm);

    if (onlyEvents) {
      return matchesSearch && (bar.events.length > 0 || bar.stars.length > 0);
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="parchment-card rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#dfd3c1] gap-3">
          <div className="flex items-center space-x-2">
            <span className="chinese-stamp text-sm">年谱</span>
            <h3 className="text-xl font-bold font-serif text-[#352b20]">
              大事流年编年纪事 · 人生全谱
            </h3>
          </div>

          {/* Search & Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#8c7a6b]" />
              <input
                type="text"
                placeholder="搜索年份、干支、神煞..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-[#d5be9e] rounded text-xs focus:outline-none focus:border-[#a22d1b]"
              />
            </div>

            <label className="flex items-center space-x-1 cursor-pointer select-none text-[#544332]">
              <input
                type="checkbox"
                checked={onlyEvents}
                onChange={e => setOnlyEvents(e.target.checked)}
                className="accent-[#c93f28]"
              />
              <span>仅看关键年</span>
            </label>
          </div>
        </div>

        {/* Chronological Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#efe6d5]/70 text-[#544332] border-b border-[#dfd3c1] font-serif">
                <th className="py-2.5 px-3">公历年份</th>
                <th className="py-2.5 px-3">流年干支</th>
                <th className="py-2.5 px-3">周岁</th>
                <th className="py-2.5 px-3">行经大运</th>
                <th className="py-2.5 px-3 text-right">运势指数</th>
                <th className="py-2.5 px-3">神煞与格局</th>
                <th className="py-2.5 px-3">流年要旨与事象</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dfd3c1]/60">
              {filteredBars.map((bar) => {
                const isNow = bar.year === 2026;
                const isHigh = bar.score >= 70;
                const isLow = bar.score <= 50;

                return (
                  <tr
                    key={bar.year}
                    className={`hover:bg-[#f5eedf]/60 transition ${
                      isNow ? 'bg-[#c93f28]/10 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 text-[#352b20] font-medium whitespace-nowrap">
                      {bar.year} 年
                      {isNow && (
                        <span className="ml-1.5 text-[10px] bg-[#c93f28] text-white px-1.5 py-0.2 rounded">
                          今
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-serif font-bold text-[#544332] whitespace-nowrap">
                      {bar.ganZhi}
                    </td>
                    <td className="py-2.5 px-3 text-[#786b59] whitespace-nowrap">
                      {bar.age} 岁
                    </td>
                    <td className="py-2.5 px-3 text-[#544332] whitespace-nowrap">
                      {bar.daYunName}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span
                        className={`font-serif font-bold ${
                          isHigh
                            ? 'text-[#2e7d32]'
                            : isLow
                            ? 'text-[#c62828]'
                            : 'text-[#544332]'
                        }`}
                      >
                        {bar.score}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {bar.stars.map((s, idx) => (
                          <span
                            key={idx}
                            className="bg-[#efe6d5] text-[#a22d1b] border border-[#d5be9e] px-1.5 py-0.5 rounded text-[10px]"
                          >
                            {s}
                          </span>
                        ))}
                        {bar.interrelations.map((r, idx) => (
                          <span
                            key={idx}
                            className="bg-[#fdebee] text-[#c62828] border border-[#ef9a9a] px-1.5 py-0.5 rounded text-[10px]"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#5c544c] max-w-xs sm:max-w-md">
                      {bar.events.length > 0 ? (
                        <div className="space-y-0.5">
                          {bar.events.map((ev, i) => (
                            <div key={i} className="text-[#352b20]">
                              <strong className="text-[#a22d1b]">【{ev.title}】</strong>
                              {ev.desc}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>{bar.summaryAdvice}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
