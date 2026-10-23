import React from 'react';
import { User, Sparkles, Download, RefreshCw, Calendar, Info } from 'lucide-react';
import { BaziChart } from '../types/destiny';

interface HeaderNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bazi: BaziChart | null;
  onOpenInputModal: () => void;
  onOpenShareModal: () => void;
}

export const TABS = [
  { id: 'summary', name: '运势总览' },
  { id: 'astrology', name: '天象星盘' },
  { id: 'bazi', name: '盘势要诀' },
  { id: 'projection', name: '未来推演' },
  { id: 'dimension', name: '分部细览' },
  { id: 'xiji', name: '命盘喜忌' },
  { id: 'chronicle', name: '大事年谱' },
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  bazi,
  onOpenInputModal,
  onOpenShareModal,
}) => {
  return (
    <header className="border-b border-[#dfd3c1] bg-[#fdfbf7]/90 backdrop-blur-sm sticky top-0 z-30 select-none">
      {/* Top Main Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Left Tabs styled like antique Chinese manuscript book chapters */}
        <nav className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto py-1 scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-[#c93f28] font-bold'
                    : 'text-[#5c544c] hover:text-[#2c2523] hover:bg-[#efe6d5]/50 rounded'
                }`}
              >
                {tab.name}
                {isActive && (
                  <span className="absolute bottom-[-10px] left-0 w-full h-[2.5px] bg-[#c93f28] rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools & Profile Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm">
          {bazi && (
            <div className="hidden md:flex items-center px-2.5 py-1 rounded bg-[#efe6d5]/70 border border-[#dfd3c1] text-[#544332]">
              <span className="w-2 h-2 rounded-full bg-[#2d8b68] mr-1.5 animate-pulse" />
              <span>命主日元: <strong className="text-[#a22d1b] font-bold">{bazi.dayMaster} ({bazi.dayMasterElement})</strong></span>
              <span className="mx-2 text-[#c2a57e]">|</span>
              <span>格局: <strong>{bazi.dayMasterStrength}</strong></span>
            </div>
          )}

          <button
            onClick={onOpenInputModal}
            className="flex items-center space-x-1 px-3 py-1.5 rounded border border-[#c2a57e] bg-[#f7f2ea] hover:bg-[#efe6d5] text-[#544332] transition font-medium shadow-sm"
            title="输入或切换生辰八字"
          >
            <Calendar className="w-3.5 h-3.5 text-[#a22d1b]" />
            <span>输入生辰</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center space-x-1 px-3 py-1.5 rounded border border-[#a22d1b]/40 bg-[#c93f28] hover:bg-[#a22d1b] text-white transition font-medium shadow-sm"
            title="生成海报长图"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">导出命卷</span>
          </button>
        </div>
      </div>
    </header>
  );
};
