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

// 天干相冲 (克且同性)
export const GAN_CHONG: Record<string, string> = {
  '甲': '庚', '庚': '甲',
  '乙': '辛', '辛': '乙',
  '丙': '壬', '壬': '丙',
  '丁': '癸', '癸': '丁'
};

// 伪随机确定性哈希函数 (保证同一命造计算绝对确定一致，无 Math.random 漂移)
function deterministicPseudoRandom(seed: number): number {
  const x = Math.sin(seed * 9999.1337 + 0.12345) * 10000;
  return x - Math.floor(x);
}

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
  // 晚子时(23点)与早子时(0点)流派：默认使用 sect=2 (晚子时日柱算当天，符合大众历法直觉)
  eightChar.setSect(input.ziShiSect ?? 2);

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

  // 统计五行数量
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
  if (supportElements.includes(yueLingWx)) strengthScore += 45; // 得令
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
    xiYongShen = opposites[dayWx]; // 身强喜财官食伤
    jiShen = supportElements;
  } else if (strengthScore <= 38) {
    dayMasterStrength = strengthScore < 20 ? '从格' : '身弱';
    xiYongShen = supportElements; // 身弱喜印比扶身
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
    solarBirth: `${solar.getYear()}年${solar.getMonth()}月${solar.getDay()}日 ${input.hour === 23 ? '晚子时 (23:00-24:00)' : input.hour === 0 ? '早子时 (00:00-01:00)' : `${solar.getHour()}时`}`,
    lunarBirth: `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInChinese()}月${lunar.getDayInChinese()} ${eightChar.getTimeZhi()}时${input.hour === 23 ? '(夜子)' : input.hour === 0 ? '(晨子)' : ''}`,
    daYun,
    startYunAge
  };
}

// 神煞与流年特殊事件判定库
const AUSPICIOUS_WORDS = [
  '紫气东来，名利双收，诸事顺遂',
  '天乙贵人显耀，逢凶化吉，有开疆拓土之功',
  '财帛丰盈，投资大获，得贵人大力扶持',
  '官禄高升，声名鹊起，建功立业正当时',
  '红鸾星动，得遇良缘，吉庆临门',
  '食伤生财，灵感泉涌，事业实现跨越式突破',
  '文昌照命，智慧通达，登峰造极',
  '三合贵局，强强联手，格局宏阔大成'
];

const INAUSPICIOUS_WORDS = [
  '岁运天克地冲，风浪险恶，宜收缩自保避锐气',
  '七杀攻身，阻滞重重，谨防小人陷害与健康有恙',
  '比劫夺财，防投资暴雷与合伙生变，切忌冒进',
  '日支逢冲，动荡漂泊，情志心神倍受煎熬',
  '枭神夺食，福气受损，当防意外倾覆与口舌之争',
  '羊刃破局，刚极易折，宜守不宜攻，戒急用忍'
];

const TURNING_WORDS = [
  '大运交接，人生重大转折，破茧重生之年',
  '换柱革新，运势乾坤倒转，开启全新十年征程',
  '触底反弹，否极泰来，暗夜尽处见曙光',
  '大势换挡，乘风破浪，重塑航向'
];

// 计算大运自身的宏观能量势能 (-25 ~ +25)
function evaluateDaYunTrendBias(dy: DaYunItem, bazi: BaziChart): number {
  const dyGan = dy.ganZhi[0];
  const dyZhi = dy.ganZhi[1];
  const dyGanWx = GAN_WUXING[dyGan];
  const dyZhiWx = ZHI_WUXING[dyZhi];

  let bias = 0;
  // 天干得用
  if (bazi.xiYongShen.includes(dyGanWx)) bias += 10;
  if (bazi.jiShen.includes(dyGanWx)) bias -= 10;
  // 地支为大运主令，分量更重 (占60%)
  if (bazi.xiYongShen.includes(dyZhiWx)) bias += 16;
  if (bazi.jiShen.includes(dyZhiWx)) bias -= 16;

  // 大运地支冲日支 (夫妻宫逢冲，动荡)
  if (ZHI_CHONG[dyZhi] === bazi.dayPillar.zhi) bias -= 8;
  // 大运地支合日支 (六合大吉)
  if (ZHI_HE[dyZhi] === bazi.dayPillar.zhi) bias += 8;

  return bias;
}

// 核心重构：真正具备“金融波浪形态 + 命理大运周期 + 趋势动能”的K线生成引擎
export function generateYearKlines(bazi: BaziChart, birthYear: number, maxAge: number = 85): KlineBar[] {
  const currentYear = 2026;
  const bars: KlineBar[] = [];

  // 1. 先计算每步大运的宏观基调
  const daYunBiasMap = new Map<number, number>();
  bazi.daYun.forEach(dy => {
    daYunBiasMap.set(dy.index, evaluateDaYunTrendBias(dy, bazi));
  });

  const getDaYunForAge = (age: number): DaYunItem | undefined => {
    return bazi.daYun.find(dy => age >= dy.startAge && age <= dy.endAge) || bazi.daYun[0];
  };

  // 基础底仓分数 (60分中枢)
  let currentMomentumScore = 60;
  // 童年起点
  if (bazi.dayMasterStrength === '身强' || bazi.dayMasterStrength === '专旺') {
    currentMomentumScore = 63;
  } else if (bazi.dayMasterStrength === '身弱' || bazi.dayMasterStrength === '从格') {
    currentMomentumScore = 56;
  }

  let lastClose = currentMomentumScore;

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
    const daYunName = currentDaYun ? `${currentDaYun.ganZhi}运·${currentDaYun.shiShen}` : '幼童少运';
    const daYunBias = currentDaYun ? (daYunBiasMap.get(currentDaYun.index) || 0) : 0;

    // 2. 流年岁君对本命与大运的生克势能 (Delta: -28 ~ +28)
    const lnGanWx = GAN_WUXING[liuNianGan];
    const lnZhiWx = ZHI_WUXING[liuNianZhi];
    let yearImpulse = 0;

    // 喜忌神直接影响
    if (bazi.xiYongShen.includes(lnGanWx)) yearImpulse += 7;
    if (bazi.xiYongShen.includes(lnZhiWx)) yearImpulse += 10;
    if (bazi.jiShen.includes(lnGanWx)) yearImpulse -= 7;
    if (bazi.jiShen.includes(lnZhiWx)) yearImpulse -= 10;

    const stars: string[] = [];
    const interrelations: string[] = [];
    const events: DestinyEvent[] = [];

    // 天克地冲 (大凶破位，如乙酉见辛卯)
    const isGanChong = GAN_CHONG[liuNianGan] === bazi.dayPillar.gan;
    const isZhiChong = ZHI_CHONG[liuNianZhi] === bazi.dayPillar.zhi;
    if (isGanChong && isZhiChong) {
      yearImpulse -= 18;
      interrelations.push(`岁运天克地冲(${liuNianGanZhi}与日柱相克冲)`);
      events.push({
        type: 'inauspicious',
        title: '天克地冲 · 剧烈破位',
        desc: '流年与日元干支双冲，为人生重大关卡考验，务须韬光养晦，防重大变故。'
      });
    } else if (isZhiChong) {
      yearImpulse -= 11;
      interrelations.push(`日支逢冲(${bazi.dayPillar.zhi}${liuNianZhi}相冲)`);
      events.push({
        type: 'inauspicious',
        title: '冲动夫妻宫 · 波折起伏',
        desc: '地支相冲，根基动摇，事业或家庭易生波折变迁，心力交瘁。'
      });
    }

    // 天合地合 (大吉之年，如甲子见己丑)
    const isGanHe = (
      (liuNianGan === '甲' && bazi.dayPillar.gan === '己') || (liuNianGan === '己' && bazi.dayPillar.gan === '甲') ||
      (liuNianGan === '乙' && bazi.dayPillar.gan === '庚') || (liuNianGan === '庚' && bazi.dayPillar.gan === '乙') ||
      (liuNianGan === '丙' && bazi.dayPillar.gan === '辛') || (liuNianGan === '辛' && bazi.dayPillar.gan === '丙') ||
      (liuNianGan === '丁' && bazi.dayPillar.gan === '壬') || (liuNianGan === '壬' && bazi.dayPillar.gan === '丁') ||
      (liuNianGan === '戊' && bazi.dayPillar.gan === '癸') || (liuNianGan === '癸' && bazi.dayPillar.gan === '戊')
    );
    const isZhiHe = ZHI_HE[liuNianZhi] === bazi.dayPillar.zhi;
    if (isGanHe && isZhiHe) {
      yearImpulse += 18;
      interrelations.push(`天地鸳鸯相合(${liuNianGanZhi}合日柱)`);
      events.push({
        type: 'auspicious',
        title: '天合地合 · 贵人登堂',
        desc: '得天地气运深厚护佑，声威骤起，遇至重转机或大获全胜。'
      });
    } else if (isZhiHe) {
      yearImpulse += 8;
      interrelations.push(`地支六合(${bazi.dayPillar.zhi}${liuNianZhi}合)`);
      events.push({
        type: 'auspicious',
        title: '岁支相合 · 遇合顺遂',
        desc: '凡事暗有贵人相帮，合力开拓，财官双美。'
      });
    }

    // 换大运枢纽年 (往往形成头部见顶或底部V反转)
    const isDaYunTransition = currentDaYun && (age === currentDaYun.startAge || age === currentDaYun.startAge + 1);
    if (isDaYunTransition) {
      events.push({
        type: 'turning',
        title: '大运换挡 · 枢纽变局',
        desc: `正式迈入十年【${currentDaYun.ganZhi}】新运，气象骤换，人生航向发生巨变。`
      });
    }

    // 岁运并临
    if (currentDaYun && currentDaYun.ganZhi === liuNianGanZhi) {
      stars.push('岁运并临');
      if (daYunBias >= 0) {
        yearImpulse += 12;
        events.push({
          type: 'turning',
          title: '岁运并临 · 吉神倍增',
          desc: '岁运重叠且逢喜神，乘风破浪直上九霄，为人生罕见之大飞跃！'
        });
      } else {
        yearImpulse -= 14;
        events.push({
          type: 'inauspicious',
          title: '岁运并临 · 忌神重叠',
          desc: '岁运并临兼逢忌煞，压力倍增，切戒盲目扩张，当谨守以待时。'
        });
      }
    }

    // 贵人神煞
    if (['甲', '戊', '庚'].includes(bazi.dayMaster) && ['丑', '未'].includes(liuNianZhi)) {
      stars.push('天乙贵人');
    } else if (['乙', '己'].includes(bazi.dayMaster) && ['子', '申'].includes(liuNianZhi)) {
      stars.push('天乙贵人');
    } else if (['丙', '丁'].includes(bazi.dayMaster) && ['亥', '酉'].includes(liuNianZhi)) {
      stars.push('天乙贵人');
    } else if (['壬', '癸'].includes(bazi.dayMaster) && ['巳', '卯'].includes(liuNianZhi)) {
      stars.push('天乙贵人');
    }

    if (stars.includes('天乙贵人')) {
      yearImpulse += 7;
      events.push({
        type: 'auspicious',
        title: '天乙拱照',
        desc: '逢凶化吉，官贵引荐，危难之际常获意想不到之转机。'
      });
    }

    // 3. 金融级动量推进算法 (真正产生大牛市、深熊市与清晰周期趋势)
    // 目标运势重心由【大运中枢】+【流年冲力】+【生命周期自然曲率】共同决定
    const daYunTarget = 60 + daYunBias; // 好大运中枢拉升到 75~85，差大运中枢压低到 38~50
    const rawTarget = daYunTarget + yearImpulse * 0.8;
    
    // 趋势平滑驱动：70% 沿袭惯性，30% 向目标加速（产生平滑而有力量的单边牛熊趋势！）
    const targetClose = lastClose * 0.55 + rawTarget * 0.45;
    
    // 确定性微扰动 (伪随机，保证绝对一致又自然)
    const seed = year * 17 + age * 31;
    const pr1 = (deterministicPseudoRandom(seed) - 0.5) * 2; // -1 ~ 1
    const pr2 = (deterministicPseudoRandom(seed + 101) - 0.5) * 2;

    // 规范在 28 ~ 95 的大区间
    const close = Math.round(Math.max(28, Math.min(95, targetClose + pr1 * 2)) * 10) / 10;
    
    // 开盘价承接上年收盘价，加上由于跨年岁气转换的微幅跳空
    const gap = Math.round((pr2 * 2.5) * 10) / 10;
    const open = Math.round(Math.max(28, Math.min(95, lastClose + gap)) * 10) / 10;

    // 影线高低点：大冲突/转折年影线长，平稳年影线短
    const baseWick = 1.5 + Math.abs(yearImpulse) * 0.35 + (isDaYunTransition ? 4 : 0);
    const highWick = Math.abs(pr1) * baseWick + (close > open ? 1.5 : 0.5);
    const lowWick = Math.abs(pr2) * baseWick + (close < open ? 1.5 : 0.5);

    const high = Math.round((Math.max(open, close) + highWick) * 10) / 10;
    const low = Math.round((Math.min(open, close) - lowWick) * 10) / 10;

    // 更新惯性记忆
    lastClose = close;

    // 事件量 (Volume): 冲克大、换大运、暴涨暴跌年份成交量激增
    const volume = Math.round(Math.abs(high - low) * 9 + Math.abs(yearImpulse) * 6 + 12);

    // 4. 四大细分维度 (财、官、情、康)
    const shiShen = getShiShen(bazi.dayMaster, liuNianGan);
    let wealthBias = 0;
    let careerBias = 0;
    let romanceBias = 0;
    let healthBias = 0;

    if (['正财', '偏财'].includes(shiShen)) wealthBias += 10;
    if (['食神', '伤官'].includes(shiShen)) { wealthBias += 6; careerBias += 5; }
    if (['正官', '七杀'].includes(shiShen)) careerBias += 12;
    if (['正印', '偏印'].includes(shiShen)) { careerBias += 7; healthBias += 5; }
    if (['比肩', '劫财'].includes(shiShen)) { wealthBias -= 8; careerBias += 4; }
    if (['红鸾', '天喜'].some(s => stars.includes(s)) || ['正财', '偏财', '正官', '七杀'].includes(shiShen)) romanceBias += 9;

    const makeDimScores = (bias: number): FortuneScores => {
      const dClose = Math.round(Math.max(25, Math.min(96, close + bias + pr1 * 1.5)) * 10) / 10;
      const dOpen = Math.round(Math.max(25, Math.min(96, open + bias * 0.6)) * 10) / 10;
      const dHigh = Math.round((Math.max(dOpen, dClose) + Math.abs(pr1) * 2.5) * 10) / 10;
      const dLow = Math.round((Math.min(dOpen, dClose) - Math.abs(pr2) * 2.5) * 10) / 10;
      return { open: dOpen, close: dClose, low: dLow, high: dHigh, score: dClose };
    };

    const dimensions: Record<FortuneDimension, FortuneScores> = {
      overall: { open, close, low, high, score: close },
      wealth: makeDimScores(wealthBias),
      career: makeDimScores(careerBias),
      romance: makeDimScores(romanceBias),
      health: makeDimScores(healthBias - (age > 60 ? (age - 60) * 0.5 : 0)),
    };

    // 命理原判金色虚线 (大运宏观十年平滑中枢线)
    const originalBaseline = Math.round(daYunTarget * 10) / 10;

    // 批语
    let summaryAdvice = '';
    if (close >= 75) {
      summaryAdvice = AUSPICIOUS_WORDS[(year + age) % AUSPICIOUS_WORDS.length];
    } else if (close <= 48) {
      summaryAdvice = INAUSPICIOUS_WORDS[(year + age) % INAUSPICIOUS_WORDS.length];
    } else if (isDaYunTransition) {
      summaryAdvice = TURNING_WORDS[(year + age) % TURNING_WORDS.length];
    } else {
      summaryAdvice = '循道而行，稳健持重，蓄势待发，静候时变。';
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
    bars[i].ma1Year = bars[i].ma5; // 一年线取 MA5 平滑中枢

    // RSI 真实相对强弱指数
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
  const currentYear = 2026;
  const currentMonth = new Date().getMonth() + 1;
  const monthBars: KlineBar[] = [];
  
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
    if (bazi.xiYongShen.includes(mGanWx)) delta += 6;
    if (bazi.xiYongShen.includes(mZhiWx)) delta += 8;
    if (bazi.jiShen.includes(mGanWx)) delta -= 6;
    if (bazi.jiShen.includes(mZhiWx)) delta -= 8;

    const seed = targetYear * 100 + m;
    const pr1 = (deterministicPseudoRandom(seed) - 0.5) * 2;
    const pr2 = (deterministicPseudoRandom(seed + 50) - 0.5) * 2;

    const baseScore = Math.max(25, Math.min(96, yearBar.score + delta * 0.7));
    const open = Math.round((lastMClose + pr1 * 1.5) * 10) / 10;
    const close = Math.round((baseScore + pr2 * 1.5) * 10) / 10;
    const high = Math.round((Math.max(open, close) + Math.abs(pr1) * 2 + 1) * 10) / 10;
    const low = Math.round((Math.min(open, close) - Math.abs(pr2) * 2 - 1) * 10) / 10;
    lastMClose = close;

    const volume = Math.round(Math.abs(high - low) * 7 + Math.abs(delta) * 5 + 10);

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
      const c = Math.max(25, Math.min(96, close + bias));
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
        wealth: dim(delta > 0 ? 5 : -4),
        career: dim(delta > 0 ? 6 : -5),
        romance: dim(delta > 0 ? 4 : -3),
        health: dim(delta > 0 ? 3 : -4),
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
