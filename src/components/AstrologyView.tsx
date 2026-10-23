import React, { useState } from 'react';
import { AstrologyProfile, RetrogradeEvent, MoonPhaseEvent } from '../types/destiny';
import { 
  Sparkles, 
  Orbit, 
  AlertTriangle, 
  ShieldAlert, 
  Compass, 
  Moon, 
  Sun, 
  Flame, 
  Wind, 
  Droplet, 
  Mountain, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  HelpCircle,
  TrendingDown
} from 'lucide-react';

interface AstrologyViewProps {
  astro: AstrologyProfile;
  name: string;
}

export const AstrologyView: React.FC<AstrologyViewProps> = ({ astro, name }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'mercury' | 'venus' | 'moon'>('all');

  const sun = astro.sunSign;
  const elements = astro.elementBreakdown;

  // Filter retrogrades based on subtab
  const filteredRetrogrades = astro.retrogrades.filter(r => {
    if (activeTab === 'mercury') return r.planetKey === 'mercury';
    if (activeTab === 'venus') return r.planetKey === 'venus';
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header & Natal Astrological Chart Card */}
      <div className="parchment-card rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#dfd3c1] gap-2">
          <div className="flex items-center space-x-2">
            <span className="chinese-stamp text-sm">天象</span>
            <h3 className="text-xl font-bold font-serif text-[#352b20] flex items-center gap-2">
              星宿黄道 · 本命星盘与天象雷达
            </h3>
          </div>
          <div className="flex items-center space-x-2 text-xs text-[#786b59]">
            <span>当前星历基准: <strong>2026年秋·天蝎季</strong></span>
          </div>
        </div>

        {/* Natal Triad: Sun, Moon, Rising */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Sun Sign (太阳星座) */}
          <div className="p-4 rounded-lg bg-[#fffdf9] border-2 border-[#b8860b] shadow-xs relative overflow-hidden">
            <div className="absolute -right-2 -bottom-2 text-6xl text-[#b8860b]/10 font-serif select-none pointer-events-none">
              {sun.symbol}
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center text-xs font-bold text-[#b8860b] bg-[#faf0d9] px-2 py-0.5 rounded border border-[#dfc384]">
                <Sun className="w-3.5 h-3.5 mr-1" /> 太阳星座 · 本质自我
              </span>
              <span className="text-xs text-[#786b59]">{sun.dates}</span>
            </div>
            <div className="flex items-baseline space-x-2 my-1">
              <h4 className="text-2xl font-bold font-serif text-[#352b20]">
                {sun.name}
              </h4>
              <span className="text-xs text-[#786b59] font-mono">({sun.englishName})</span>
            </div>
            <div className="flex flex-wrap gap-1 my-2">
              <span className="text-[10px] bg-[#efe6d5] text-[#544332] px-1.5 py-0.5 rounded">
                {sun.element}
              </span>
              <span className="text-[10px] bg-[#efe6d5] text-[#544332] px-1.5 py-0.5 rounded">
                {sun.modality}
              </span>
              <span className="text-[10px] bg-[#f5eedf] text-[#a22d1b] px-1.5 py-0.5 rounded border border-[#d5be9e]">
                守护星: {sun.rulingPlanet}
              </span>
            </div>
            <p className="text-xs text-[#5c544c] leading-relaxed line-clamp-3">
              {sun.personalityDesc}
            </p>
          </div>

          {/* Moon Sign (月亮星座) */}
          <div className="p-4 rounded-lg bg-[#fffdf9] border border-[#dfd3c1] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center text-xs font-bold text-[#2b6cb0] bg-[#e6f0fa] px-2 py-0.5 rounded border border-[#90caf9]">
                <Moon className="w-3.5 h-3.5 mr-1" /> 月亮星座 · 内心情绪
              </span>
              <span className="text-[10px] text-[#786b59]">本命情绪锚点</span>
            </div>
            <div className="flex items-baseline space-x-2 my-1">
              <h4 className="text-2xl font-bold font-serif text-[#352b20]">
                {astro.moonSignEstimate}
              </h4>
            </div>
            <p className="text-xs text-[#5c544c] leading-relaxed mt-3">
              主宰你潜意识深处的安全感来源、对危机的本能反应机制以及独处时最隐秘的情感流动。
            </p>
          </div>

          {/* Rising Sign (上升星座) */}
          <div className="p-4 rounded-lg bg-[#fffdf9] border border-[#dfd3c1] shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center text-xs font-bold text-[#2d8b68] bg-[#eaf4ec] px-2 py-0.5 rounded border border-[#a5d6a7]">
                <Compass className="w-3.5 h-3.5 mr-1" /> 上升星座 · 人格面具
              </span>
              <span className="text-[10px] text-[#786b59]">外界初印象</span>
            </div>
            <div className="flex items-baseline space-x-2 my-1">
              <h4 className="text-2xl font-bold font-serif text-[#352b20]">
                {astro.risingSignEstimate}
              </h4>
            </div>
            <p className="text-xs text-[#5c544c] leading-relaxed mt-3">
              你初涉世事时的行事风格、给陌生人的第一气场，以及你用以应对外部挑战的防御外壳。
            </p>
          </div>
        </div>

        {/* Four Elements Distribution Bar */}
        <div className="mt-5 pt-4 border-t border-[#dfd3c1]">
          <div className="flex items-center justify-between text-xs text-[#786b59] mb-2 font-medium">
            <span>星象四元素能量格局分布</span>
            <span>火/土/风/水 动态调和</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center space-x-2 p-2 bg-[#fdebee] rounded border border-[#ef9a9a]">
              <Flame className="w-4 h-4 text-[#c62828]" />
              <div>
                <span className="font-bold text-[#c62828]">火象: {elements.fire}%</span>
                <div className="text-[10px] text-[#8c7a6b]">热情·开拓</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-[#f5ede6] rounded border border-[#d7ccc8]">
              <Mountain className="w-4 h-4 text-[#8d6e63]" />
              <div>
                <span className="font-bold text-[#8d6e63]">土象: {elements.earth}%</span>
                <div className="text-[10px] text-[#8c7a6b]">务实·笃厚</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-[#e6f0fa] rounded border border-[#90caf9]">
              <Wind className="w-4 h-4 text-[#1976d2]" />
              <div>
                <span className="font-bold text-[#1976d2]">风象: {elements.air}%</span>
                <div className="text-[10px] text-[#8c7a6b]">思辨·机敏</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-[#eaf4ec] rounded border border-[#a5d6a7]">
              <Droplet className="w-4 h-4 text-[#2e7d32]" />
              <div>
                <span className="font-bold text-[#2e7d32]">水象: {elements.water}%</span>
                <div className="text-[10px] text-[#8c7a6b]">直觉·共情</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Real-Time Planetary Retrograde Radar (重点：水逆与金逆监控) */}
      <div className="parchment-card rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#dfd3c1] gap-3">
          <div className="flex items-center space-x-2">
            <Orbit className="w-5 h-5 text-[#c93f28] animate-spin-slow" />
            <h3 className="text-xl font-bold font-serif text-[#352b20]">
              天体逆行实时监测雷达 (水逆 · 金逆 · 火逆)
            </h3>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center space-x-1 bg-[#efe6d5]/70 p-1 rounded border border-[#dfd3c1] text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded transition ${activeTab === 'all' ? 'bg-[#544332] text-white font-medium' : 'text-[#544332] hover:bg-[#dfd3c1]'}`}
            >
              全部天体
            </button>
            <button
              onClick={() => setActiveTab('mercury')}
              className={`px-2.5 py-1 rounded transition ${activeTab === 'mercury' ? 'bg-[#c93f28] text-white font-medium' : 'text-[#544332] hover:bg-[#dfd3c1]'}`}
            >
              水星逆行 (水逆)
            </button>
            <button
              onClick={() => setActiveTab('venus')}
              className={`px-2.5 py-1 rounded transition ${activeTab === 'venus' ? 'bg-[#b8860b] text-white font-medium' : 'text-[#544332] hover:bg-[#dfd3c1]'}`}
            >
              金星逆行 (金逆)
            </button>
          </div>
        </div>

        {/* Real-time Status Alert Banner */}
        <div className="my-4 p-3.5 rounded-lg bg-[#fff5f5] border-2 border-[#ef9a9a] flex items-start space-x-3 text-xs text-[#a22d1b]">
          <AlertTriangle className="w-5 h-5 text-[#c93f28] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-sm text-[#c62828] flex items-center gap-2">
              <span>重要天象警报 · 双逆行交织影响期</span>
              <span className="bg-[#c93f28] text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                当前活跃
              </span>
            </div>
            <p className="text-[#544332] leading-relaxed">
              当前正处于<strong>【金星天蝎逆行】</strong>进行中（主导亲密关系考验与财务清算）；同时<strong>【2026年第三次水星逆行】</strong>即将在天蝎座正式开启！双重逆行共振期极易引发情绪暗涌、设备故障与故人联络，运势K线波动将明显加剧。
            </p>
          </div>
        </div>

        {/* Retrograde Events List */}
        <div className="space-y-4">
          {filteredRetrogrades.map((event) => {
            const isOngoing = event.status === 'ongoing';
            const isUpcoming = event.status === 'upcoming';
            const isMercury = event.planetKey === 'mercury';
            const isVenus = event.planetKey === 'venus';

            return (
              <div
                key={event.id}
                className={`p-4 rounded-lg border transition hover:shadow-md ${
                  isOngoing
                    ? 'bg-[#fef8f7] border-[#e57373]'
                    : isUpcoming
                    ? 'bg-[#fdfbf7] border-[#d5be9e]'
                    : 'bg-[#faf7f0] border-[#e0d6c5] opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#dfd3c1]/70 gap-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold font-serif ${
                        isMercury
                          ? 'bg-[#e6f0fa] text-[#1976d2] border border-[#90caf9]'
                          : isVenus
                          ? 'bg-[#faf0d9] text-[#b8860b] border border-[#dfc384]'
                          : 'bg-[#efe6d5] text-[#544332]'
                      }`}
                    >
                      {event.planet}逆行
                    </span>
                    <h4 className="font-serif font-bold text-base text-[#352b20]">
                      {event.title}
                    </h4>
                    <span className="text-xs text-[#786b59]">({event.zodiacScope})</span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isOngoing ? (
                      <span className="inline-flex items-center text-xs font-bold text-[#c62828] bg-[#ffcdd2]/50 px-2.5 py-1 rounded-full border border-[#ef9a9a] animate-pulse">
                        ● 正在发生中 · 倒计时 {event.daysDiff} 天
                      </span>
                    ) : isUpcoming ? (
                      <span className="inline-flex items-center text-xs font-medium text-[#b8860b] bg-[#faf0d9] px-2.5 py-1 rounded-full border border-[#dfc384]">
                        即将开启 · 距离还有 {event.daysDiff} 天
                      </span>
                    ) : (
                      <span className="text-xs text-[#8c7a6b]">已平稳顺行</span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3 text-xs">
                  <div>
                    <span className="text-[#8c7a6b]">逆行周期:</span>
                    <div className="font-medium text-[#352b20] mt-0.5 font-mono">
                      {event.startDate} 至 {event.endDate}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#8c7a6b]">阴影期波及:</span>
                    <div className="text-[#544332] mt-0.5 font-mono text-[11px]">
                      {event.shadowPeriod}
                    </div>
                  </div>
                  <div>
                    <span className="text-[#8c7a6b]">重点影响星座:</span>
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {event.heavyImpactSigns.map(s => (
                        <span
                          key={s}
                          className={`px-1.5 py-0.2 rounded text-[10px] ${
                            s === sun.name
                              ? 'bg-[#c93f28] text-white font-bold'
                              : 'bg-[#efe6d5] text-[#544332]'
                          }`}
                        >
                          {s} {s === sun.name && '(命主)'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Impact Keywords */}
                <div className="flex flex-wrap items-center gap-1.5 py-1.5">
                  <span className="text-[11px] text-[#786b59] font-medium">高发效应:</span>
                  {event.impactKeywords.map((kw, i) => (
                    <span key={i} className="text-[11px] bg-[#efe6d5]/70 text-[#544332] px-2 py-0.5 rounded border border-[#dfd3c1]">
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Personalized Advice Card */}
                <div className="mt-2.5 p-3 rounded bg-[#f5eedf]/70 border border-[#e5d6be] text-xs space-y-1">
                  <div className="font-serif font-bold text-[#a22d1b] flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>针对命主【{sun.name}】的专属避坑对策：</span>
                  </div>
                  <p className="text-[#544332] leading-relaxed pl-4 border-l-2 border-[#c93f28]/60">
                    {event.signSpecificImpact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Moon Phases & Eclipses (新月·满月·日月食日历) */}
      <div className="parchment-card rounded-lg p-5">
        <div className="flex items-center space-x-2 border-b border-[#dfd3c1] pb-3 mb-4">
          <Moon className="w-5 h-5 text-[#2b6cb0]" />
          <h3 className="text-xl font-bold font-serif text-[#352b20]">
            近期重要新月 · 满月 · 日月食能量日历
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {astro.moonEvents.map((moon, idx) => {
            const isEclipse = moon.type.includes('eclipse');
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-lg border flex flex-col justify-between ${
                  isEclipse ? 'bg-[#fff5f5] border-[#ef9a9a]' : 'bg-[#fffdf9] border-[#dfd3c1]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[11px] text-[#786b59]">{moon.date}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-serif ${
                        isEclipse
                          ? 'bg-[#c93f28] text-white font-bold'
                          : moon.type === 'new_moon'
                          ? 'bg-[#2d8b68] text-white'
                          : 'bg-[#2b6cb0] text-white'
                      }`}
                    >
                      {moon.sign}
                    </span>
                  </div>
                  <h5 className="font-serif font-bold text-sm text-[#352b20] mb-1">
                    {moon.title}
                  </h5>
                  <p className="text-[#5c544c] leading-relaxed text-[11px]">
                    {moon.energyTheme}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#dfd3c1]/70 text-[10px] text-[#a22d1b] italic">
                  💡 {moon.practicalAdvice}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Astrological & Destiny K-Line Synergy (星相与命运K线联动解析) */}
      <div className="parchment-card rounded-lg p-5">
        <div className="flex items-center space-x-2 border-b border-[#dfd3c1] pb-3 mb-3">
          <Orbit className="w-5 h-5 text-[#b8860b]" />
          <h4 className="text-base font-bold font-serif text-[#352b20]">
            东西合璧 · 星相逆行与命运K线的共振法则
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#544332] leading-relaxed">
          <div className="p-3 bg-[#f5eedf]/60 rounded border border-[#dfd3c1]">
            <strong className="text-[#a22d1b] block mb-1">天象在K线形态上的量化映射：</strong>
            天体逆行并非单纯的“厄运”，而是在宇宙公转轨道视运动中产生的“减速、停滞、复盘与重整”。在命运K线中，水逆和金逆往往对应着
            <span className="text-[#c93f28] font-semibold"> 剧烈的上下影线震荡 </span>
            或短线洗盘，事件量（Volume）通常会翻倍放大。
          </div>
          <div className="p-3 bg-[#f5eedf]/60 rounded border border-[#dfd3c1]">
            <strong className="text-[#2d8b68] block mb-1">智者顺天时而动：</strong>
            顺风顺水时乘胜追击，水逆金逆时沉潜蓄力。在逆行窗口期，宜把精力集中于“回炉重构、修复旧裂痕、复盘既定战略”，待行星恢复顺行之日，便是K线主升浪破茧腾飞之时。
          </div>
        </div>
      </div>
    </div>
  );
};
