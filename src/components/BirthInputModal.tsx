import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Clock, User, Calendar } from 'lucide-react';
import { BirthInput } from '../types/destiny';

interface BirthInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BirthInput) => void;
  currentInput: BirthInput;
}

const PRESETS: Array<{ name: string; desc: string; data: BirthInput }> = [
  {
    name: '当代奋斗青年',
    desc: '1995年金秋 乙亥年 丙戌月',
    data: {
      name: '陈清风',
      gender: 'male',
      calendarType: 'solar',
      year: 1995,
      month: 10,
      day: 24,
      hour: 9,
    }
  },
  {
    name: '苏东坡 (苏轼)',
    desc: '宋仁宗景祐三年 丁卯 癸丑 癸亥',
    data: {
      name: '苏东坡',
      gender: 'male',
      calendarType: 'solar',
      year: 1987, // converted for modern visualization cycle or direct 1987 prototype
      month: 1,
      day: 8,
      hour: 12,
    }
  },
  {
    name: '商业巨子 (巴菲特型)',
    desc: '庚午年 甲申月 庚寅日',
    data: {
      name: '投资大家',
      gender: 'male',
      calendarType: 'solar',
      year: 1990,
      month: 8,
      day: 30,
      hour: 14,
    }
  },
  {
    name: '千禧新锐',
    desc: '2000年庚辰 龙腾四海',
    data: {
      name: '林悦',
      gender: 'female',
      calendarType: 'solar',
      year: 2000,
      month: 6,
      day: 18,
      hour: 10,
    }
  }
];

const SHI_CHEN = [
  { hour: 0, label: '子时 (23:00 - 01:00)' },
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

  const loadPreset = (preset: typeof PRESETS[0]) => {
    setFormData(preset.data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fbf8f1] border-2 border-[#c2a57e] w-full max-w-xl rounded-lg shadow-2xl overflow-hidden relative text-[#2c2523]">
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

        {/* Quick Presets */}
        <div className="bg-[#f5eedf]/60 px-6 py-3 border-b border-[#e5d6be] flex items-center flex-wrap gap-2 text-xs">
          <span className="text-[#8c7a6b] flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-[#b8860b]" /> 快速载入典例:
          </span>
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p)}
              className="px-2.5 py-1 rounded bg-[#fffdf9] border border-[#d5be9e] hover:border-[#c93f28] hover:text-[#c93f28] transition font-medium"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#544332] mb-1">
                命主姓名 (选填)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="例: 李逍遥"
                  className="w-full px-3 py-2 bg-white border border-[#d5be9e] rounded text-sm focus:outline-none focus:border-[#a22d1b] focus:ring-1 focus:ring-[#a22d1b]"
                />
              </div>
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
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-2.5 py-2 bg-white border border-[#d5be9e] rounded text-sm focus:outline-none focus:border-[#a22d1b]"
              >
                {Array.from({ length: 90 }, (_, i) => 2026 - i).map((y) => (
                  <option key={y} value={y}>
                    {y} 年
                  </option>
                ))}
              </select>
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
            <label className="block text-xs font-semibold text-[#544332] mb-1">
              出生时辰 (二十四小时与十二时辰)
            </label>
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
  );
};
