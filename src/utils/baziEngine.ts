import { Solar, Lunar } from 'lunar-javascript';
import { 
  BirthInput, 
  BaziChart, 
  BaziPillar, 
  DaYunItem, 
  KlineBar, 
  FortuneDimension, 
  FortuneScores, 
  DestinyEvent 
} from '../types/destiny';

// 天干五行与阴阳
export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export const GAN_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

export const ZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 地支藏干
export const ZHI_CANG_GAN: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 纳音五行对照
export const NA_YIN_MAP: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '沙中金', '乙未': '沙中金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水'
};

// 十神对应关系 (根据日主五行与目标五行、阴阳)
export function getShiShen(dayGan: string, targetGan: string): string {
  const dayWx = GAN_WUXING[dayGan];
  const targetWx = GAN_WUXING[targetGan];
  const dayYang = TIAN_GAN.indexOf(dayGan as any) % 2 === 0;
  const targetYang = TIAN_GAN.indexOf(targetGan as any) % 2 === 0;
  const sameYinYang = dayYang === targetYang;

  const wuxingRelations: Record<string, { sheng: string; ke: string; beiSheng: string; beiKe: string }> = {
    '木': { sheng: '火', ke: '土', beiSheng: '水', beiKe: '金' },
    '火': { sheng: '土', ke: '金', beiSheng: '木', beiKe: '水' },
    '土': { sheng: '金', ke: '水', beiSheng: '火', beiKe: '木' },
    '金': { sheng: '水', ke: '木', beiSheng: '土', beiKe: '火' },
    '水': { sheng: '木', ke: '火', beiSheng: '金', beiKe: '土' },
  };

  if (dayWx === targetWx) {
    return sameYinYang ? '比肩' : '劫财';
  } else if (wuxingRelations[dayWx].sheng === targetWx) {
    return sameYinYang ? '食神' : '伤官';
  } else if (wuxingRelations[dayWx].ke === targetWx) {
    return sameYinYang ? '偏财' : '正财';
  } else if (wuxingRelations[dayWx].beiKe === targetWx) {
    return sameYinYang ? '七杀' : '正官';
  } else {
    return sameYinYang ? '偏印' : '正印';
  }
}

// 判定地支相冲
export const ZHI_CHONG: Record<string, string> = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳'
};

// 判定地支六合
export const ZHI_HE: Record<string, string> = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午'
};

// 计算八字排盘
export function calculateBaziChart(input: BirthInput): BaziChart {
  let solar: any;
  if (input.calendarType === 'lunar') {
    const lunar = Lunar.fromYmdHms(input.year, input.month, input.day, input.hour, 30, 0);
    solar = lunar.getSolar();
  } else {
    solar = Solar.fromYmdHms(input.year, input.month, input.day, input.hour, 30, 0);
  }

  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearGan = eightChar.getYearGan();
  const yearZhi = eightChar.getYearZhi();
  const monthGan = eightChar.getMonthGan();
  const monthZhi = eightChar.getMonthZhi();
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const hourGan = eightChar.getTimeGan();
  const hourZhi = eightChar.getTimeZhi();

  const makePillar = (gan: string, zhi: string): BaziPillar => {
    const gz = gan + zhi;
    const cg = ZHI_CANG_GAN[zhi] || [];
    return {
      gan,
      zhi,
      ganZhi: gz,
      wuXingGan: GAN_WUXING[gan] || '木',
      wuXingZhi: ZHI_WUXING[zhi] || '土',
      cangGan: cg,
      shiShenGan: gan === dayGan ? '日元' : getShiShen(dayGan, gan),
      shiShenZhi: cg.map(c => getShiShen(dayGan, c)),
      naYin: NA_YIN_MAP[gz] || '海中金'
    };
  };

  const yearPillar = makePillar(yearGan, yearZhi);
  const monthPillar = makePillar(monthGan, monthZhi);
  const dayPillar = makePillar(dayGan, dayZhi);
  const hourPillar = makePillar(hourGan, hourZhi);

  // 统计五行数量 (干+支+主要藏干)
  const wuXingCount = { jin: 0, mu: 0, shui: 0, huo: 0, tu: 0 };
  const allWx = [
    yearPillar.wuXingGan, yearPillar.wuXingZhi,
    monthPillar.wuXingGan, monthPillar.wuXingZhi,
    dayPillar.wuXingGan, dayPillar.wuXingZhi,
    hourPillar.wuXingGan, hourPillar.wuXingZhi,
  ];
  allWx.forEach(wx => {
    if (wx === '金') wuXingCount.jin += 1;
    if (wx === '木') wuXingCount.mu += 1;
    if (wx === '水') wuXingCount.shui += 1;
    if (wx === '火') wuXingCount.huo += 1;
    if (wx === '土') wuXingCount.tu += 1;
  });

  const dayWx = GAN_WUXING[dayGan];
  // 简易判断身旺身弱：看月令生助 + 同党(印比)得分
  const yueLingWx = ZHI_WUXING[monthZhi];
  const sameAndParentWx: Record<string, string[]> = {
    '木': ['木', '水'],
    '火': ['火', '木'],
    '土': ['土', '火'],
    '金': ['金', '土'],
    '水': ['水', '金'],
  };
  const supportElements = sameAndParentWx[dayWx];
  let strengthScore = 0;
  if (supportElements.includes(yueLingWx)) strengthScore += 40; // 月令得令占40分
  allWx.forEach(wx => {
    if (supportElements.includes(wx)) strengthScore += 10;
  });

  let dayMasterStrength: BaziChart['dayMasterStrength'] = '中和平衡';
  let xiYongShen: string[] = [];
  let jiShen: string[] = [];

  const opposites: Record<string, string[]> = {
    '木': ['土', '金', '火'],
    '火': ['金', '水', '土'],
    '土': ['水', '木', '金'],
    '金': ['木', '火', '水'],
    '水': ['火', '土', '木'],
  };

  if (strengthScore >= 65) {
    dayMasterStrength = strengthScore > 85 ? '专旺' : '身强';
    xiYongShen = opposites[dayWx]; // 身强喜克耗泄
    jiShen = supportElements;
  } else if (strengthScore <= 35) {
    dayMasterStrength = strengthScore < 20 ? '从格' : '身弱';
    xiYongShen = supportElements; // 身弱喜生扶
    jiShen = opposites[dayWx];
  } else {
    dayMasterStrength = '中和平衡';
    xiYongShen = [opposites[dayWx][0], supportElements[1]];
    jiShen = [opposites[dayWx][1]];
  }

  // 大运排盘计算
  const yun = eightChar.getYun(input.gender === 'male' ? 1 : 0);
  const startYunAge = Math.max(1, Math.min(10, yun.getStartYear()));
  const daYunListRaw = yun.getDaYun();
  const daYun: DaYunItem[] = [];

  for (let i = 1; i <= 9; i++) {
    const dy = daYunListRaw[i];
    if (!dy) break;
    const dyGz = dy.getGanZhi();
    if (!dyGz || dyGz.length < 2) continue;
    const dyGan = dyGz[0];
    const dyZhi = dyGz[1];
    const sAge = dy.getStartAge();
    const eAge = dy.getEndAge();
    const sYear = dy.getStartYear();
    const eYear = dy.getEndYear();

    daYun.push({
      index: i,
      startAge: sAge,
      endAge: eAge,
      startYear: sYear,
      endYear: eYear,
      ganZhi: dyGz,
      shiShen: getShiShen(dayGan, dyGan),
      wuXing: `${GAN_WUXING[dyGan]}${ZHI_WUXING[dyZhi]}`
    });
  }

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    dayMaster: dayGan,
    dayMasterElement: dayWx,
    dayMasterStrength,
    wuXingCount,
    xiYongShen,
    jiShen,
    zodiac: lunar.getYearShengXiao(),
    solarBirth: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${solar.getHour()}时`,
    lunarBirth: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${eightChar.getTimeZhi()}时`,
    daYun,
    startYunAge
  };
}

// 神煞与流年特殊事件判定库
const AUSPICIOUS_WORDS = [
  '紫气东来，名利双收', '天乙贵人显耀，逢凶化吉', '财帛丰盈，投资得利', '正官掌印，考擢升迁',
  '红鸾星动，得遇良缘', '驿马带财，远行有大获', '文昌照命，考学拔萃', '三合贵局，合作共赢',
  '金匮储祥，添丁进财', '化权得禄，声威大震'
];

const INAUSPICIOUS_WORDS = [
  '子午相冲，心神略有动荡', '岁运微克，注意健康劳累', '比劫夺财，防合伙有失', '伏吟阻滞，行事宜守旧',
  '枭神夺食，防口舌是非', '刑冲并见，外出慎防火盗', '天克地冲，家庭事多烦扰', '羊刃悬针，作息规律免恙'
];

const TURNING_WORDS = [
  '大运交接，人生重大转折', '换柱革新，开启十年新局', '立界定鼎，事业航道跃升', '运移星转，换发崭新气象'
];

// 计算五维运势分数与K线形态
export function generateYearKlines(bazi: BaziChart, birthYear: number, maxAge: number = 85): KlineBar[] {
  const currentYear = new Date().getFullYear();
  const bars: KlineBar[] = [];

  // 基础命格底分 (60 ~ 72 之间)
  let baseNatalScore = 65;
  if (bazi.dayMasterStrength === '中和平衡') baseNatalScore = 68;
  if (bazi.dayMasterStrength === '专旺') baseNatalScore = 72;

  let lastClose = baseNatalScore;

  // 找出某一岁对应的大运
  const getDaYunForAge = (age: number): DaYunItem | undefined => {
    return bazi.daYun.find(dy => age >= dy.startAge && age <= dy.endAge) || bazi.daYun[0];
  };

  for (let age = 0; age <= maxAge; age++) {
    const year = birthYear + age;
    const isFuture = year > currentYear;

    // 流年干支推算
    const solarSample = Solar.fromYmd(year, 6, 1);
    const lunarSample = solarSample.getLunar();
    const liuNianGanZhi = lunarSample.getYearInGanZhi();
    const liuNianGan = liuNianGanZhi[0];
    const liuNianZhi = liuNianGanZhi[1];

    const currentDaYun = getDaYunForAge(age);
    const daYunName = currentDaYun ? `${currentDaYun.ganZhi}运·${currentDaYun.shiShen}` : '童限运';

    // 1. 五行生克评分 (+-15分)
    const lnGanWx = GAN_WUXING[liuNianGan];
    const lnZhiWx = ZHI_WUXING[liuNianZhi];
    let scoreDelta = 0;

    if (bazi.xiYongShen.includes(lnGanWx)) scoreDelta += 6;
    if (bazi.xiYongShen.includes(lnZhiWx)) scoreDelta += 8;
    if (bazi.jiShen.includes(lnGanWx)) scoreDelta -= 6;
    if (bazi.jiShen.includes(lnZhiWx)) scoreDelta -= 8;

    // 2. 刑冲克害
    const stars: string[] = [];
    const interrelations: string[] = [];
    const events: DestinyEvent[] = [];

    // 冲日支
    if (ZHI_CHONG[liuNianZhi] === bazi.dayPillar.zhi) {
      scoreDelta -= 7;
      interrelations.push(`日柱逢冲(${bazi.dayPillar.zhi}${liuNianZhi}相冲)`);
      events.push({
        type: 'inauspicious',
        title: '冲动日支',
        desc: '感情或居所易有变动，宜心平气和，以静制动。'
      });
    }

    // 合日支
    if (ZHI_HE[liuNianZhi] === bazi.dayPillar.zhi) {
      scoreDelta += 6;
      interrelations.push(`天作之合(${bazi.dayPillar.zhi}${liuNianZhi}六合)`);
      events.push({
        type: 'auspicious',
        title: '太岁来合',
        desc: '贵人近身，凡事暗有护佑，结识良朋益友。'
      });
    }

    // 换大运枢纽年
    const isDaYunTransition = currentDaYun && (age === currentDaYun.startAge || age === currentDaYun.startAge + 1);
    if (isDaYunTransition) {
      events.push({
        type: 'turning',
        title: '交运之期',
        desc: `正值转入【${currentDaYun.ganZhi}】大运，行年新气象，人生重要枢纽。`
      });
    }

    // 岁运并临 (流年与大运干支相同)
    if (currentDaYun && currentDaYun.ganZhi === liuNianGanZhi) {
      stars.push('岁运并临');
      events.push({
        type: 'turning',
        title: '岁运并临',
        desc: '吉凶力道加倍，若逢喜用则百尺竿头，若逢忌神宜谨言慎行。'
      });
    }

    // 神煞检测 (简易贵人)
    if (['甲', '戊', '庚'].includes(bazi.dayMaster) && ['丑', '未'].includes(liuNianZhi)) {
      stars.push('天乙贵人');
    } else if (['乙', '己'].includes(bazi.dayMaster) && ['子', '申'].includes(liuNianZhi)) {
      stars.push('天乙贵人');
    } else if (['丙', '丁'].includes(bazi.dayMaster) && ['亥', '酉'].includes(liuNianZhi)) {
      stars.push('天乙贵人');
    }

    if (stars.includes('天乙贵人')) {
      scoreDelta += 5;
      events.push({
        type: 'auspicious',
        title: '贵人拱照',
        desc: '得长辈领导指引或遇关键助力，化险为夷。'
      });
    }

    // 计算各维度分数
    // 综合基础目标分 (在 35 ~ 92 之间浮动)
    const targetScore = Math.max(38, Math.min(92, baseNatalScore + scoreDelta + (Math.sin(age * 0.7) * 4)));
    
    // K线形态模拟：开盘在去年收盘附近微跳空
    const open = Math.round((lastClose + (Math.random() * 4 - 2)) * 10) / 10;
    const close = Math.round((targetScore + (Math.random() * 3 - 1.5)) * 10) / 10;
    
    // 波动性：冲合多、换大运时震荡幅度大
    const volatility = (isDaYunTransition ? 6 : 3) + Math.abs(scoreDelta * 0.4);
    const high = Math.round((Math.max(open, close) + Math.random() * volatility) * 10) / 10;
    const low = Math.round((Math.min(open, close) - Math.random() * volatility) * 10) / 10;
    
    lastClose = close;

    // 事件量 (Volume): 波动越大事件量越高
    const volume = Math.round(Math.abs(high - low) * 8 + Math.abs(scoreDelta) * 5 + 15);

    // 细分四维计算 (财、官、情、康)
    const dimScore = (bias: number) => {
      const dTarget = Math.max(30, Math.min(96, targetScore + bias));
      const dOpen = Math.round((open + bias * 0.5) * 10) / 10;
      const dClose = Math.round(dTarget * 10) / 10;
      const dHigh = Math.round((Math.max(dOpen, dClose) + Math.random() * 3) * 10) / 10;
      const dLow = Math.round((Math.min(dOpen, dClose) - Math.random() * 3) * 10) / 10;
      return { open: dOpen, close: dClose, low: dLow, high: dHigh, score: dClose };
    };

    // 财富：若流年透财星或食伤生财
    const shiShen = getShiShen(bazi.dayMaster, liuNianGan);
    let wealthBias = 0;
    let careerBias = 0;
    let romanceBias = 0;
    let healthBias = 0;

    if (['正财', '偏财'].includes(shiShen)) wealthBias += 8;
    if (['食神', '伤官'].includes(shiShen)) { wealthBias += 5; careerBias += 4; }
    if (['正官', '七杀'].includes(shiShen)) careerBias += 9;
    if (['正印', '偏印'].includes(shiShen)) { careerBias += 6; healthBias += 4; }
    if (['比肩', '劫财'].includes(shiShen)) { wealthBias -= 6; careerBias += 3; }
    if (['红鸾', '天喜'].some(s => stars.includes(s)) || ['正财', '偏财', '正官', '七杀'].includes(shiShen)) romanceBias += 7;

    const dimensions: Record<FortuneDimension, FortuneScores> = {
      overall: { open, close, low, high, score: close },
      wealth: dimScore(wealthBias),
      career: dimScore(careerBias),
      romance: dimScore(romanceBias),
      health: dimScore(healthBias - (age > 60 ? (age - 60) * 0.4 : 0)),
    };

    // 命理原判金色虚线 (宏观生命周期平滑曲线：童年探索 -> 青年起步 -> 中年鼎盛 -> 晚年康宁)
    const lifeCycleCurve = baseNatalScore + Math.sin((age - 15) / 25) * 8 + (currentDaYun ? (currentDaYun.index * 1.2) : 0);
    const originalBaseline = Math.round(lifeCycleCurve * 10) / 10;

    // 批语
    let summaryAdvice = '';
    if (close >= 75) {
      summaryAdvice = AUSPICIOUS_WORDS[(age + year) % AUSPICIOUS_WORDS.length];
    } else if (close <= 52) {
      summaryAdvice = INAUSPICIOUS_WORDS[(age + year) % INAUSPICIOUS_WORDS.length];
    } else if (isDaYunTransition) {
      summaryAdvice = TURNING_WORDS[(age + year) % TURNING_WORDS.length];
    } else {
      summaryAdvice = '循道而行，潜龙勿用，稳中有进，积厚流光。';
    }

    bars.push({
      index: age,
      timeLabel: `${year} ${liuNianGanZhi}`,
      year,
      age,
      ganZhi: liuNianGanZhi,
      daYunName,
      isFuture,
      open,
      close,
      low,
      high,
      score: close,
      dimensions,
      ma5: 0,
      ma10: 0,
      originalBaseline,
      ma1Year: close,
      rsi: 50,
      volume,
      events,
      stars,
      interrelations,
      summaryAdvice
    });
  }

  // 计算 MA5 / MA10 / 一年线平滑与 RSI
  for (let i = 0; i < bars.length; i++) {
    // 5年均线
    const start5 = Math.max(0, i - 4);
    const sum5 = bars.slice(start5, i + 1).reduce((acc, b) => acc + b.close, 0);
    bars[i].ma5 = Math.round((sum5 / (i - start5 + 1)) * 10) / 10;

    // 10年均线 (大运线)
    const start10 = Math.max(0, i - 9);
    const sum10 = bars.slice(start10, i + 1).reduce((acc, b) => acc + b.close, 0);
    bars[i].ma10 = Math.round((sum10 / (i - start10 + 1)) * 10) / 10;
    bars[i].ma1Year = bars[i].ma5; // 一年线取平滑中枢

    // RSI 模拟
    const rsiPeriod = 6;
    if (i >= rsiPeriod) {
      let gains = 0;
      let losses = 0;
      for (let j = i - rsiPeriod + 1; j <= i; j++) {
        const diff = bars[j].close - bars[j - 1].close;
        if (diff > 0) gains += diff;
        else losses += Math.abs(diff);
      }
      const rs = losses === 0 ? 100 : gains / losses;
      bars[i].rsi = Math.round((100 - (100 / (1 + rs))) * 10) / 10;
    } else {
      bars[i].rsi = 50;
    }
  }

  return bars;
}

// 生成选定年份的12个月流月K线 (月K·逐月)
export function generateMonthKlines(bazi: BaziChart, targetYear: number, yearBar: KlineBar): KlineBar[] {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const monthBars: KlineBar[] = [];
  
  // 12节气流月干支 (以寅月开始为农历正月)
  // 年干起月干口诀 (五虎遁):
  // 甲己之年丙作首，乙庚之岁戊为头，丙辛之岁寻庚上，丁壬壬位顺水流，若问戊癸何处发，甲寅之上好追求。
  const yearGan = yearBar.ganZhi[0];
  const wuHuDunMap: Record<string, number> = {
    '甲': 2, '己': 2, // 丙
    '乙': 4, '庚': 4, // 戊
    '丙': 6, '辛': 6, // 庚
    '丁': 8, '壬': 8, // 壬
    '戊': 0, '癸': 0, // 甲
  };
  const startGanIndex = wuHuDunMap[yearGan] ?? 0;
  const MONTH_ZHIS = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'];
  const LUNAR_MONTH_NAMES = ['正月·寅月', '二月·卯月', '三月·辰月', '四月·巳月', '五月·午月', '六月·未月', '七月·申月', '八月·酉月', '九月·戌月', '十月·亥月', '冬月·子月', '腊月·丑月'];

  let lastMClose = yearBar.open;

  for (let m = 0; m < 12; m++) {
    const monthNum = m + 1;
    const isFuture = targetYear > currentYear || (targetYear === currentYear && monthNum > currentMonth);
    const mGan = TIAN_GAN[(startGanIndex + m) % 10];
    const mZhi = MONTH_ZHIS[m];
    const monthGanZhi = `${mGan}${mZhi}`;
    
    // 月令生克
    const mGanWx = GAN_WUXING[mGan];
    const mZhiWx = ZHI_WUXING[mZhi];
    let delta = 0;
    if (bazi.xiYongShen.includes(mGanWx)) delta += 4;
    if (bazi.xiYongShen.includes(mZhiWx)) delta += 5;
    if (bazi.jiShen.includes(mGanWx)) delta -= 4;
    if (bazi.jiShen.includes(mZhiWx)) delta -= 5;

    const baseScore = Math.max(35, Math.min(95, yearBar.score + delta + (Math.sin(m * 0.8) * 5)));
    const open = Math.round((lastMClose + (Math.random() * 2 - 1)) * 10) / 10;
    const close = Math.round((baseScore + (Math.random() * 2 - 1)) * 10) / 10;
    const high = Math.round((Math.max(open, close) + Math.random() * 3) * 10) / 10;
    const low = Math.round((Math.min(open, close) - Math.random() * 3) * 10) / 10;
    lastMClose = close;

    const volume = Math.round(Math.abs(high - low) * 6 + Math.abs(delta) * 4 + 10);

    const events: DestinyEvent[] = [];
    if (delta >= 6) {
      events.push({
        type: 'auspicious',
        title: `${monthGanZhi}月顺风顺水`,
        desc: '当月气运流通舒畅，贵人提拔，诸事进展明朗。'
      });
    } else if (delta <= -6) {
      events.push({
        type: 'inauspicious',
        title: `${monthGanZhi}月谨防冲耗`,
        desc: '月令稍显羁绊，宜沉潜修持，节制开销防琐事扰心。'
      });
    }

    const stars: string[] = [];
    if (ZHI_HE[mZhi] === bazi.dayPillar.zhi) stars.push('月合日元');
    if (ZHI_CHONG[mZhi] === bazi.dayPillar.zhi) stars.push('月冲日元');

    const dim = (bias: number) => {
      const c = Math.max(30, Math.min(95, close + bias));
      return { open: open + bias * 0.5, close: c, low: Math.min(open, c) - 2, high: Math.max(open, c) + 2, score: c };
    };

    monthBars.push({
      index: m,
      timeLabel: `${targetYear}.${monthNum < 10 ? '0' + monthNum : monthNum} ${monthGanZhi}`,
      year: targetYear,
      month: monthNum,
      age: yearBar.age,
      ganZhi: monthGanZhi,
      daYunName: yearBar.daYunName,
      isFuture,
      open,
      close,
      low,
      high,
      score: close,
      dimensions: {
        overall: { open, close, low, high, score: close },
        wealth: dim(delta > 0 ? 4 : -3),
        career: dim(delta > 0 ? 5 : -4),
        romance: dim(delta > 0 ? 3 : -2),
        health: dim(delta > 0 ? 2 : -3),
      },
      ma5: close,
      ma10: close,
      originalBaseline: yearBar.originalBaseline,
      ma1Year: yearBar.score,
      rsi: 50,
      volume,
      events,
      stars,
      interrelations: [],
      lunarMonthName: `${monthGanZhi}月 (${LUNAR_MONTH_NAMES[m]})`,
      summaryAdvice: delta >= 0 ? '月利亨通，利于规划实施。' : '韬光养晦，静待时变。'
    });
  }

  // 计算 MA3
  for (let i = 0; i < monthBars.length; i++) {
    const s = Math.max(0, i - 2);
    const sum = monthBars.slice(s, i + 1).reduce((acc, b) => acc + b.close, 0);
    monthBars[i].ma5 = Math.round((sum / (i - s + 1)) * 10) / 10;
    monthBars[i].ma1Year = yearBar.score;
  }

  return monthBars;
}
