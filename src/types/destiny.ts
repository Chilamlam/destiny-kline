export type Gender = 'male' | 'female';
export type CalendarType = 'solar' | 'lunar';

export interface BirthInput {
  name: string;
  gender: Gender;
  calendarType: CalendarType;
  year: number;
  month: number;
  day: number;
  hour: number;
  isLeapMonth?: boolean;
  ziShiSect?: 1 | 2; // 1: 晚子时日柱算第二天(三命通会); 2: 晚子时日柱算当天(现代主流)
}

export type FortuneDimension = 'overall' | 'wealth' | 'career' | 'romance' | 'health';

export interface BaziPillar {
  gan: string;
  zhi: string;
  ganZhi: string;
  wuXingGan: string;
  wuXingZhi: string;
  cangGan: string[];
  shiShenGan: string;
  shiShenZhi: string[];
  naYin: string;
}

export interface DaYunItem {
  index: number;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  ganZhi: string;
  shiShen: string;
  wuXing: string;
}

export interface BaziChart {
  yearPillar: BaziPillar;
  monthPillar: BaziPillar;
  dayPillar: BaziPillar;
  hourPillar: BaziPillar;
  dayMaster: string; // 日元天干
  dayMasterElement: string; // 五行
  dayMasterStrength: '身强' | '身弱' | '专旺' | '从格' | '中和平衡';
  wuXingCount: {
    jin: number;
    mu: number;
    shui: number;
    huo: number;
    tu: number;
  };
  xiYongShen: string[]; // 喜用神五行
  jiShen: string[]; // 忌神五行
  zodiac: string; // 生肖
  solarBirth: string; // 阳历描述
  lunarBirth: string; // 农历描述
  daYun: DaYunItem[]; // 大运数组
  startYunAge: number; // 起运周岁
}

export interface FortuneScores {
  open: number;
  close: number;
  low: number;
  high: number;
  score: number;
}

export interface DestinyEvent {
  type: 'auspicious' | 'inauspicious' | 'turning' | 'neutral';
  title: string;
  desc: string;
}

export interface KlineBar {
  index: number;
  timeLabel: string; // "2026 丙午" or "2026.03 庚辰"
  year: number;
  month?: number; // 1-12 for month kline
  age: number; // 周岁
  ganZhi: string; // 丙午 or 辛丑
  daYunName: string; // "壬寅运·正财"
  isFuture: boolean; // 是否未来推演 (虚线/空心蜡烛)
  
  // OHLC for selected dimension and sub-dimensions
  open: number;
  close: number;
  low: number;
  high: number;
  score: number;
  
  dimensions: Record<FortuneDimension, FortuneScores>;
  
  // Extra technical lines
  ma5: number;
  ma10: number;
  originalBaseline: number; // 命理原判金色虚线
  ma1Year: number; // 一年线 / 大运平滑中枢线
  rsi: number;
  volume: number; // 事件量 / 波动能量值
  
  // Astrological & Life details
  events: DestinyEvent[];
  stars: string[]; // 神煞吉凶标记: "天乙贵人", "将星", "岁运并临" 等
  interrelations: string[]; // 刑冲合害: "天合地合", "子午相冲", "寅巳申三刑"
  lunarMonthName?: string; // 辛丑月 (for month kline)
  summaryAdvice: string; // 命理批语
}

export interface ChartFilterOptions {
  dimension: FortuneDimension;
  timeRange: 'all' | 'recent' | 'projection'; // 全卷 / 近年 / 未来推演
  klineType: 'auto' | 'year' | 'month' | 'monthDetail'; // 自动 / 年K / 月K / 月K·逐月
  showOriginalBaseline: boolean; // 命理原判
  showMa1Year: boolean; // 一年线
  showProjectionZone: boolean; // 推演区间
  showVolume: boolean; // 事件量
  showRSI: boolean; // RSI
  selectedYearForMonthK: number; // 当前展开月K的年份 (如 2026)
}

// 星座与星相学相关类型
export interface ZodiacSign {
  name: string;
  englishName: string;
  symbol: string;
  dates: string;
  element: '火象' | '土象' | '风象' | '水象';
  modality: '基本宫' | '固定宫' | '变动宫';
  rulingPlanet: string;
  keywords: string[];
  personalityDesc: string;
  fortuneVibe2026: string;
}

export type RetrogradePlanetType = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn';

export interface RetrogradeEvent {
  id: string;
  planet: string; // '水星' | '金星' | '火星' 等
  planetKey: RetrogradePlanetType;
  title: string;
  startDate: string;
  endDate: string;
  zodiacScope: string;
  status: 'ongoing' | 'upcoming' | 'past';
  daysDiff: number; // 距离开始或结束的天数
  shadowPeriod: string;
  impactKeywords: string[];
  coreImpact: string;
  generalAdvice: string;
  heavyImpactSigns: string[]; // 重点影响星座
  signSpecificImpact: string; // 针对当前命主星座的指引
}

export interface MoonPhaseEvent {
  date: string;
  title: string;
  type: 'new_moon' | 'full_moon' | 'solar_eclipse' | 'lunar_eclipse';
  sign: string;
  energyTheme: string;
  practicalAdvice: string;
}

export interface AstrologyProfile {
  sunSign: ZodiacSign;
  moonSignEstimate: string;
  risingSignEstimate: string;
  elementBreakdown: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  retrogrades: RetrogradeEvent[];
  activeRetrogradesCount: number;
  moonEvents: MoonPhaseEvent[];
  mercuryRetrogradeAdvice: string;
  venusRetrogradeAdvice: string;
}

