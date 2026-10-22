import React, { useRef, useState } from 'react';
import { X, Download, Share2, Sparkles, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { BaziChart, KlineBar } from '../types/destiny';

interface SharePosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  bazi: BaziChart;
  yearBars: KlineBar[];
  name: string;
}

export const SharePosterModal: React.FC<SharePosterModalProps> = ({
  isOpen,
  onClose,
  bazi,
  yearBars,
  name,
}) => {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentYear = 2026;
  const currentBar = yearBars.find(b => b.year === currentYear) || yearBars[Math.floor(yearBars.length / 2)] || yearBars[0];
  const isHistorical = !yearBars.some(b => b.year === currentYear);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    try {
      setIsGenerating(true);
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: '#f7f3e8',
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `命运K线图_${name || '命主'}_${currentYear}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate poster', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fbf8f1] border-2 border-[#c2a57e] w-full max-w-lg rounded-lg shadow-2xl overflow-hidden relative text-[#2c2523] max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#efe6d5] border-b border-[#dfd3c1] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="chinese-stamp">画卷</span>
            <h3 className="font-serif font-bold text-base text-[#544332]">
              命运K线 · 宣纸典藏长图海报
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c7a6b] hover:text-[#2c2523] p-1 rounded-full hover:bg-[#dfd3c1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#2c2523]/5">
          {/* Poster Printable Container */}
          <div
            ref={posterRef}
            className="w-full bg-[#f7f3e8] border-2 border-[#b8860b] p-6 rounded shadow-lg text-[#2c2523] space-y-4 relative"
            style={{
              backgroundImage: 'radial-gradient(#d5c3aa 0.75px, transparent 0.75px)',
              backgroundSize: '24px 24px',
            }}
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 text-[#b8860b] text-xs">╔</div>
            <div className="absolute top-2 right-2 text-[#b8860b] text-xs">╗</div>
            <div className="absolute bottom-2 left-2 text-[#b8860b] text-xs">╚</div>
            <div className="absolute bottom-2 right-2 text-[#b8860b] text-xs">╝</div>

            {/* Title Header */}
            <div className="text-center space-y-1 border-b border-[#dfd3c1] pb-3">
              <span className="chinese-stamp text-xs px-2 py-0.5">命理量化天机</span>
              <h1 className="text-2xl font-bold font-serif text-[#352b20] tracking-widest mt-1">
                命 运 Ｋ 线 谱
              </h1>
              <p className="text-[11px] text-[#786b59] font-serif">
                以八字干支为基 · 化流年岁运为盘 · 洞悉人生起伏
              </p>
            </div>

            {/* Profile Bar */}
            <div className="flex items-center justify-between text-xs bg-[#efe6d5]/70 p-3 rounded border border-[#dfd3c1]">
              <div>
                <span className="text-[#786b59]">命主:</span>{' '}
                <strong className="text-sm font-serif text-[#352b20]">{name || '有缘者'}</strong>
              </div>
              <div>
                <span className="text-[#786b59]">本命日元:</span>{' '}
                <strong className="text-[#a22d1b]">{bazi.dayMaster} ({bazi.dayMasterElement})</strong>
              </div>
              <div>
                <span className="text-[#786b59]">格局:</span>{' '}
                <strong>{bazi.dayMasterStrength}</strong>
              </div>
            </div>

            {/* Four Pillars Table */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { label: '年柱', p: bazi.yearPillar },
                { label: '月柱', p: bazi.monthPillar },
                { label: '日柱', p: bazi.dayPillar },
                { label: '时柱', p: bazi.hourPillar },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/80 border border-[#dfd3c1] p-2 rounded">
                  <div className="text-[10px] text-[#8c7a6b]">{item.label}</div>
                  <div className="font-serif font-bold text-base text-[#352b20] my-0.5">
                    {item.p.ganZhi}
                  </div>
                  <div className="text-[9px] text-[#a22d1b]">{item.p.shiShenGan}</div>
                </div>
              ))}
            </div>

            {/* Current Fortune Snapshot */}
            <div className="p-3 bg-[#eef8f3] border border-[#a5d6a7] rounded text-xs space-y-1">
              <div className="flex justify-between items-center font-serif font-bold text-[#1b5e20]">
                <span>{isHistorical ? `焦点流年 · ${currentBar.year} ${currentBar.ganZhi}年` : `当下时局 · ${currentBar.year} ${currentBar.ganZhi}年`}</span>
                <span>指数: {currentBar.score} 分</span>
              </div>
              <div className="text-[11px] text-[#558b2f]">
                行经大运: <strong>{currentBar.daYunName}</strong>
              </div>
              <p className="text-[11px] text-[#786b59] italic pt-1">
                批语: {currentBar.summaryAdvice}
              </p>
            </div>

            {/* Favorable Elements */}
            <div className="flex justify-between text-xs text-[#544332] bg-[#fdfbf7] p-2.5 rounded border border-[#dfd3c1]">
              <span>
                喜用神: <strong className="text-[#2e7d32]">{bazi.xiYongShen.join(' ')}</strong>
              </span>
              <span>
                忌神: <strong className="text-[#c62828]">{bazi.jiShen.join(' ')}</strong>
              </span>
            </div>

            {/* Footer QR & Slogan */}
            <div className="pt-3 border-t border-[#dfd3c1] flex items-center justify-between text-[10px] text-[#8c7a6b]">
              <div>
                <span>命运K线 · 个人网站娱乐推演系统</span>
                <div className="text-[#a22d1b] font-serif">命由天定，运由己修</div>
              </div>
              <div className="text-right">
                <span className="font-mono">{new Date().toISOString().split('T')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="bg-[#efe6d5] border-t border-[#dfd3c1] px-5 py-3 flex items-center justify-between">
          <div className="text-xs text-[#786b59]">
            支持长图保存，可分享至微信/小红书/朋友圈
          </div>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center space-x-1.5 px-4 py-2 bg-[#c93f28] hover:bg-[#a22d1b] text-white rounded text-xs font-semibold shadow transition disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-green-300" />
                <span>已保存到下载</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isGenerating ? '生成海报中...' : '下载高清长图'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
