import React, { useState, useMemo } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { KlineChart } from './components/KlineChart';
import { BaziSummaryView } from './components/BaziSummaryView';
import { FutureProjectionView } from './components/FutureProjectionView';
import { DimensionDetailView } from './components/DimensionDetailView';
import { XijiView } from './components/XijiView';
import { ChronicleView } from './components/ChronicleView';
import { BirthInputModal } from './components/BirthInputModal';
import { SharePosterModal } from './components/SharePosterModal';
import { BirthInput } from './types/destiny';
import { calculateBaziChart, generateYearKlines } from './utils/baziEngine';
import { Sparkles, HelpCircle, Compass, Share2 } from 'lucide-react';

export const App: React.FC = () => {
  // Default birth input
  const [birthInput, setBirthInput] = useState<BirthInput>({
    name: '陈清风',
    gender: 'male',
    calendarType: 'solar',
    year: 1995,
    month: 10,
    day: 24,
    hour: 9,
  });

  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Compute Bazi Chart
  const baziChart = useMemo(() => {
    return calculateBaziChart(birthInput);
  }, [birthInput]);

  // Compute Year K-lines
  const yearBars = useMemo(() => {
    return generateYearKlines(baziChart, birthInput.year, 85);
  }, [baziChart, birthInput.year]);

  return (
    <div className="min-h-screen bg-[#f7f3e8] text-[#2c2523] flex flex-col font-serif selection:bg-[#c93f28]/20 selection:text-[#a22d1b]">
      {/* 1. Top Navigation Bar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bazi={baziChart}
        onOpenInputModal={() => setIsInputModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-3 sm:px-6 py-4 space-y-4">
        {/* Quick Info Ribbon */}
        <div className="bg-[#fcfaf6] border border-[#dfd3c1] rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="chinese-stamp text-xs">命盘档案</span>
            <span className="font-bold text-[#352b20]">{birthInput.name || '命主'}</span>
            <span className="text-[#8c7a6b]">({birthInput.gender === 'male' ? '乾造·男' : '坤造·女'})</span>
            <span className="text-[#8c7a6b] hidden sm:inline">| 出生公历: {baziChart.solarBirth}</span>
            <span className="text-[#8c7a6b] hidden md:inline">| 农历: {baziChart.lunarBirth}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsInputModalOpen(true)}
              className="text-[#a22d1b] hover:underline font-medium flex items-center"
            >
              <span>更换生辰</span>
            </button>
            <span className="text-[#d5be9e]">·</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-[#544332] hover:text-[#c93f28] font-medium flex items-center"
            >
              <span>保存命盘海报</span>
            </button>
          </div>
        </div>

        {/* Dynamic View Tab Rendering */}
        {activeTab === 'summary' && (
          <KlineChart
            bazi={baziChart}
            yearBars={yearBars}
          />
        )}

        {activeTab === 'bazi' && (
          <BaziSummaryView
            bazi={baziChart}
          />
        )}

        {activeTab === 'projection' && (
          <FutureProjectionView
            bazi={baziChart}
            yearBars={yearBars}
          />
        )}

        {activeTab === 'dimension' && (
          <DimensionDetailView
            bazi={baziChart}
            yearBars={yearBars}
          />
        )}

        {activeTab === 'xiji' && (
          <XijiView
            bazi={baziChart}
          />
        )}

        {activeTab === 'chronicle' && (
          <ChronicleView
            bazi={baziChart}
            yearBars={yearBars}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-[#dfd3c1] bg-[#fbf8f1] py-4 text-center text-xs text-[#8c7a6b]">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[#544332]">命运K线 (Destiny K-Line)</span>
            <span>· 传统周易命理量化推演系统</span>
          </div>
          <div className="text-[11px] text-[#a88960]">
            仅供命理研讨与生活娱乐参考 · 自强不息，厚德载物
          </div>
        </div>
      </footer>

      {/* 4. Modals */}
      <BirthInputModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={(data) => setBirthInput(data)}
        currentInput={birthInput}
      />

      <SharePosterModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        bazi={baziChart}
        yearBars={yearBars}
        name={birthInput.name}
      />
    </div>
  );
};

export default App;
