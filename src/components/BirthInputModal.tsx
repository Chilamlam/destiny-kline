import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Clock, User, Calendar } from 'lucide-react';
import { BirthInput } from '../types/destiny';

interface BirthInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BirthInput) => void;
  currentInput: BirthInput;
}

export const FAMOUS_PRESETS: Array<{
  name: string;
  tag: string;
  desc: string;
  highlight: string;
  data: BirthInput;
}> = [
  {
    name: '史蒂夫·乔布斯',
    tag: '科技教皇',
    desc: '公历 1955-02-24 19:15 · 乙未 戊寅 丙辰 戊戌',
    highlight: '1976创苹果大涨 -> 1985遭驱逐深渊暴跌 -> 1997重返V反 -> 2001-2010史诗级主升浪',
    data: {
      name: '乔布斯',
      gender: 'male',
      calendarType: 'solar',
      year: 1955,
      month: 2,
      day: 24,
      hour: 19,
    }
  },
  {
    name: '埃隆·马斯克',
    tag: '商业冒险家',
    desc: '公历 1971-06-28 07:30 · 辛亥 甲午 丙申 壬辰',
    highlight: '2008年火箭三连炸+濒临破产长下影线探底 -> 2012-2021超级大牛市登顶全球首富',
    data: {
      name: '马斯克',
      gender: 'male',
      calendarType: 'solar',
      year: 1971,
      month: 6,
      day: 28,
      hour: 8,
    }
  },
  {
    name: '沃伦·巴菲特',
    tag: '股神长牛',
    desc: '公历 1930-08-30 15:00 · 庚午 甲申 庚寅 甲申',
    highlight: '日禄归时，金水相涵，经典的价值投资复利稳健超级大牛市通道',
    data: {
      name: '巴菲特',
      gender: 'male',
      calendarType: 'solar',
      year: 1930,
      month: 8,
      day: 30,
      hour: 15,
    }
  },
  {
    name: '张爱玲',
    tag: '绝代才女',
    desc: '公历 1920-09-30 14:00 · 庚申 乙酉 辛卯 乙未',
    highlight: '1943-1945年二十出头文名震动天下见大顶，后半生漂泊沉潜',
    data: {
      name: '张爱玲',
      gender: 'female',
      calendarType: 'solar',
      year: 1920,
      month: 9,
      day: 30,
      hour: 14,
    }
  },
  {
    name: '当代奋斗青年',
    tag: '90后实盘',
    desc: '公历 1995-10-24 09:30 · 乙亥 丙戌 己巳 己巳',
    highlight: '早年平缓，2020年后起步，2026年迎来大运换挡与事业新征程',
    data: {
      name: '陈清风',
      gender: 'male',
      calendarType: 'solar',
      year: 1995,
      month: 10,
      day: 24,
      hour: 9,
    }
  }
];

const SHI_CHEN = [
  { hour: 0, label: '早子时 (00:00 - 01:00) · 午夜晨子' },
  { hour: 2, label: '丑时 (01:00 - 03:00)' },
  { hour: 4, label: '寅时 (03:00 - 05:00)' },
  { hour: 6, label: '卯时 (05:00 - 07:00)' },
  { hour: 8, label: '辰时 (07:00 - 09:00)' },
  { hour: 10, label: '巳时 (09:00 - 11:00)' },
  { hour: 12, label: '午时 (11:00 - 13:00)' },
  { hour: 14, label: '未时 (13:00 - 15:00)' },
  { hour: 16, label: '申时 (15:00 - 17:00)' },
  { hour: 18, label: '酉时 (17:00 - 19:00)' },
  { hour: 20, label: '戌时 (19:00 - 21:00)' },
  { hour: 22, label: '亥时 (21:00 - 23:00)' },
  { hour: 23, label: '晚子时 / 夜子时 (23:00 - 24:00) · 深夜初更' },
];

export const BirthInputModal: React.FC<BirthInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentInput,
}) => {
  const [formData, setFormData] = useState<BirthInput>(currentInput);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const loadPreset = (preset: typeof FAMOUS_PRESETS[0]) => {
    setFormData(preset.data);
    onSubmit(preset.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fbf8f1] border-2 border-[#c2a57e] w-full max-w-xl rounded-lg shadow-2xl overflow-hidden relative text-[#2c2523] max-h-[92vh] flex flex-col">
        {/* Antique Card Header */}
        <div className="bg-[#efe6d5] border-b border-[#dfd3c1] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="chinese-stamp">命造</span>
            <h3 className="text-lg font-bold text-[#544332] tracking-wide font-serif">
              输入出生生辰 · 推演命运K线
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#8c7a6b] hover:text-[#2c2523] transition p-1 rounded-full hover:bg-[#dfd3c1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Celebrity Verification Presets */}
          <div className="bg-[#f5eedf]/80 px-6 py-3.5 border-b border-[#e5d6be] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#544332] font-semibold flex items-center">
                <Sparkles className="w-4 h-4 mr-1 text-[#b8860b]" /> 
                名人典例验证 (一键载入检验生平趋势):
              </span>
              <span className="text-[11px] text-[#a22d1b]">点击任意人物即刻排盘</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {FAMOUS_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => loadPreset(p)}
                  className="text-left p-2 rounded bg-[#fffdf9] border border-[#d5be9e] hover:border-[#c93f28] hover:bg-[#fbf5f4] transition group shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-serif text-[#352b20] group-hover:text-[#c93f28]">
                      {p.name}
                    </strong>
                    <span className="text-[10px] bg-[#efe6d5] text-[#544332] px-1.5 py-0.2 rounded">
                      {p.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#786b59] mt-0.5">{p.desc}</div>
                  <div className="text-[10px] text-[#a22d1b] mt-1 leading-tight line-clamp-1">
                    趋势: {p.highlight}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Custom Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-[#544332] mb-1">
                  命主姓名 / 称号
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例: 乔布斯 / 张三"
                  className="w-full px-3 py-2 bg-white border border-[#d5be9e] rounded text-sm focus:outline-none focus:border-[#a22d1b]"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-[#544332] mb-1">
                  性别 (乾坤造)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                    className={`py-2 text-sm rounded font-medium border text-center transition ${
                      formData.gender === 'male'
                        ? 'bg-[#c93f28] text-white border-[#c93f28]'
                        : 'bg-white border-[#d5be9e] text-[#544332] hover:bg-[#efe6d5]'
                    }`}
                  >
                    乾造 (男)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                    className={`py-2 text-sm rounded font-medium border text-center transition ${
                      formData.gender === 'female'
                        ? 'bg-[#c93f28] text-white border-[#c93f28]'
                        : 'bg-white border-[#d5be9e] text-[#544332] hover:bg-[#efe6d5]'
                    }`}
                  >
                    坤造 (女)
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Type */}
            <div>
              <label className="block text-xs font-semibold text-[#544332] mb-1">
                历法类型
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, calendarType: 'solar' })}
                  className={`py-1.5 text-xs rounded font-medium border text-center transition ${
                    formData.calendarType === 'solar'
                      ? 'bg-[#544332] text-white border-[#544332]'
                      : 'bg-white border-[#d5be9e] text-[#544332] hover:bg-[#efe6d5]'
                  }`}
                >
                  公历 / 阳历 (身份证生日)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, calendarType: 'lunar' })}
                  className={`py-1.5 text-xs rounded font-medium border text-center transition ${
                    formData.calendarType === 'lunar'
                      ? 'bg-[#544332] text-white border-[#544332]'
                      : 'bg-white border-[#d5be9e] text-[#544332] hover:bg-[#efe6d5]'
                  }`}
                >
                  农历 / 阴历 (按月日干支)
                </button>
              </div>
            </div>

            {/* Date Picker Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#544332] mb-1">出生年份</label>
                <input
                  type="number"
                  min="1900"
                  max="2026"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 1990 })}
                  className="w-full px-2.5 py-2 bg-white border border-[#d5be9e] rounded text-sm focus:outline-none focus:border-[#a22d1b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#544332] mb-1">出生月份</label>
                <select
                  value={formData.month}
                  onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                  className="w-full px-2.5 py-2 bg-white border border-[#d5be9e] rounded text-sm focus:outline-none focus:border-[#a22d1b]"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m} 月
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#544332] mb-1">出生日期</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: parseInt(e.target.value) })}
                  className="w-full px-2.5 py-2 bg-white border border-[#d5be9e] rounded text-sm focus:outline-none focus:border-[#a22d1b]"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                    <option key={d} value={d}>
                      {d} 日
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hour (Shi Chen) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#544332]">
                  出生时辰 (二十四小时与十二时辰)
                </label>
                <span className="text-[10px] text-[#a22d1b] font-medium">
                  已细分早晚子时
                </span>
              </div>
              <select
                value={formData.hour}
                onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#d5be9e] rounded text-sm focus:outline-none focus:border-[#a22d1b]"
              >
                {SHI_CHEN.map((sc) => (
                  <option key={sc.hour} value={sc.hour}>
                    {sc.label}
                  </option>
                ))}
              </select>

              {/* 晚子时专属流派切换 */}
              {formData.hour === 23 && (
                <div className="mt-2.5 p-3 rounded bg-[#f5eedf]/90 border border-[#d5be9e] text-xs space-y-1.5 animate-fadeIn">
                  <div className="font-semibold text-[#a22d1b]">
                    晚子时 (23:00 - 24:00) 日柱干支取法流派：
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, ziShiSect: 2 })}
                      className={`p-2 rounded border text-left transition ${
                        (formData.ziShiSect ?? 2) === 2
                          ? 'bg-[#c93f28] text-white border-[#c93f28] shadow-xs'
                          : 'bg-white text-[#544332] border-[#d5be9e]'
                      }`}
                    >
                      <div className="font-bold">晚子时日柱算当天 (推荐)</div>
                      <div className={`text-[10px] mt-0.5 ${(formData.ziShiSect ?? 2) === 2 ? 'text-white/90' : 'text-[#8c7a6b]'}`}>
                        现代主流 · 《子平真诠》依公历自然日归属
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, ziShiSect: 1 })}
                      className={`p-2 rounded border text-left transition ${
                        formData.ziShiSect === 1
                          ? 'bg-[#c93f28] text-white border-[#c93f28] shadow-xs'
                          : 'bg-white text-[#544332] border-[#d5be9e]'
                      }`}
                    >
                      <div className="font-bold">晚子时日柱算次日</div>
                      <div className={`text-[10px] mt-0.5 ${formData.ziShiSect === 1 ? 'text-white/90' : 'text-[#8c7a6b]'}`}>
                        三命通会派 · 认为23点已交明日之子时初气
                      </div>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-1.5 text-[11px] text-[#8c7a6b] leading-tight">
                💡 <strong>命理考究</strong>：子时跨越两日（23:00-01:00）。23点前属亥时，23点至午夜为晚子时，午夜后为早子时，精准排定日夜交替干支。
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-4 border-t border-[#dfd3c1] flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#c2a57e] rounded text-sm text-[#544332] hover:bg-[#efe6d5] transition"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#c93f28] hover:bg-[#a22d1b] text-white rounded text-sm font-semibold shadow-md transition flex items-center space-x-1"
              >
                <span>生成命运K线谱</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
