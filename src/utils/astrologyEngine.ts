import { BirthInput, AstrologyProfile, ZodiacSign, RetrogradeEvent, MoonPhaseEvent } from '../types/destiny';
import { Solar, Lunar } from 'lunar-javascript';

export const ZODIAC_LIST: ZodiacSign[] = [
  {
    name: '白羊座',
    englishName: 'Aries',
    symbol: '♈',
    dates: '03.21 - 04.19',
    element: '火象',
    modality: '基本宫',
    rulingPlanet: '火星',
    keywords: ['开拓先锋', '赤子之心', '行动派', '直率果敢'],
    personalityDesc: '如春初萌发之烈火，怀抱无畏之勇气与开拓气魄。行事雷厉风行，不喜拖泥带水，敢为天下先。',
    fortuneVibe2026: '开创新纪元之年，事业主线全面提速，需戒急戒躁，防后劲不足。'
  },
  {
    name: '金牛座',
    englishName: 'Taurus',
    symbol: '♉',
    dates: '04.20 - 05.20',
    element: '土象',
    modality: '固定宫',
    rulingPlanet: '金星',
    keywords: ['沉稳踏实', '财富审美', '耐力持久', '注重品质'],
    personalityDesc: '如春深繁茂之沃土，笃信积累之厚重。兼具对美好事物的审美品位与务实的理财智慧，临危不乱。',
    fortuneVibe2026: '资产盘整与价值重构期，稳健投资易有厚报，情感上追求长久陪伴。'
  },
  {
    name: '双子座',
    englishName: 'Gemini',
    symbol: '♊',
    dates: '05.21 - 06.21',
    element: '风象',
    modality: '变动宫',
    rulingPlanet: '水星',
    keywords: ['灵动敏锐', '思维跳跃', '信息枢纽', '多维探索'],
    personalityDesc: '如初夏穿林之轻风，穿梭于千百种新奇知识与人际网络。思维机敏善辩，拥抱变化，善解人意。',
    fortuneVibe2026: '跨界融合的大时代，人脉资源呈指数级裂变，需防精力分散、多而不精。'
  },
  {
    name: '巨蟹座',
    englishName: 'Cancer',
    symbol: '♋',
    dates: '06.22 - 07.22',
    element: '水象',
    modality: '基本宫',
    rulingPlanet: '月亮',
    keywords: ['细腻共情', '坚韧护佑', '直觉敏锐', '归属感强'],
    personalityDesc: '如夏夜清幽之泉，外被坚甲而内怀至柔至真之心。对情绪流动有极深洞察力，重情义护家园。',
    fortuneVibe2026: '内在能量回归年，适合深耕根基家庭与核心圈层，直觉常能预见重大转折。'
  },
  {
    name: '狮子座',
    englishName: 'Leo',
    symbol: '♌',
    dates: '07.23 - 08.22',
    element: '火象',
    modality: '固定宫',
    rulingPlanet: '太阳',
    keywords: ['领袖光芒', '慷慨热忱', '创造力盛', '自信傲岸'],
    personalityDesc: '如盛夏当空之烈日，自带耀眼之威仪与蓬勃生命力。为人坦荡仗义，善于激发他人潜能，天生主场。',
    fortuneVibe2026: '舞台聚光灯回归，领导力与个人作品备受瞩目，宜大步向前，谦逊纳言。'
  },
  {
    name: '处女座',
    englishName: 'Virgo',
    symbol: '♍',
    dates: '08.23 - 09.22',
    element: '土象',
    modality: '变动宫',
    rulingPlanet: '水星',
    keywords: ['匠心缜密', '秩序纯粹', '洞察入微', '精益求精'],
    personalityDesc: '如金秋收获之规整，执着于秩序与条理之美。观察洞若烛火，善于在繁复混乱中梳理出最优解法。',
    fortuneVibe2026: '专业技能变现与体系优化之年，职场晋升与技术突破捷报频传。'
  },
  {
    name: '天秤座',
    englishName: 'Libra',
    symbol: '♎',
    dates: '09.23 - 10.23',
    element: '风象',
    modality: '基本宫',
    rulingPlanet: '金星',
    keywords: ['优雅中庸', '和谐共生', '平衡美感', '社交桥梁'],
    personalityDesc: '如深秋明净之长空，终生追寻公平、美感与心灵之契合。举止从容得体，是天然的谈判家与美育者。',
    fortuneVibe2026: '深度合作与人际重整之年，选择高质量同行者将决定未来五年天花板。'
  },
  {
    name: '天蝎座',
    englishName: 'Scorpio',
    symbol: '♏',
    dates: '10.24 - 11.22',
    element: '水象',
    modality: '固定宫',
    rulingPlanet: '冥王星 / 火星',
    keywords: ['洞穿本质', '涅槃重生', '意志坚定', '深邃忠诚'],
    personalityDesc: '如严冬封冻之深潭，静水流深而蕴藏惊天伟力。洞察人性至深无所遁形，遇至暗绝境尤能绝处逢生。',
    fortuneVibe2026: '脱胎换骨的蜕变大年，经历旧模式剥离后迎来极具权能与深度的复苏。'
  },
  {
    name: '射手座',
    englishName: 'Sagittarius',
    symbol: '♐',
    dates: '11.23 - 12.21',
    element: '火象',
    modality: '变动宫',
    rulingPlanet: '木星',
    keywords: ['旷达哲思', '远方探索', '乐观求索', '精神自由'],
    personalityDesc: '如掠过旷野之烈焰，永远仰望星空与真理。天性超然豁达，不喜束缚，视人生为一场壮丽的冒险游历。',
    fortuneVibe2026: '远行、出海与高等学术跃升期，思维认知维度全面拓展，贵人多在异地。'
  },
  {
    name: '摩羯座',
    englishName: 'Capricorn',
    symbol: '♑',
    dates: '12.22 - 01.19',
    element: '土象',
    modality: '基本宫',
    rulingPlanet: '土星',
    keywords: ['万仞坚岩', '长期主义', '大器晚成', '责任宗匠'],
    personalityDesc: '如冬至肃杀之峻岭，默然承受风雪而屹立不倒。敬畏时间之伟力，以无上自律与耐力攀登人生顶峰。',
    fortuneVibe2026: '长期布局结出硕果之年，权责并重，登高望远，建构属于自己的帝国。'
  },
  {
    name: '水瓶座',
    englishName: 'Aquarius',
    symbol: '♒',
    dates: '01.20 - 02.18',
    element: '风象',
    modality: '固定宫',
    rulingPlanet: '天王星 / 土星',
    keywords: ['颠覆革新', '博爱众生', '独立超前', '未来视界'],
    personalityDesc: '如掠过苍穹之电光，永远站在时代潮头眺望未来。不拘泥世俗樊笼，崇尚真理、自由与全人类之福祉。',
    fortuneVibe2026: '冥王星驻扎命宫的深化之年，迎来颠覆性观念突破与全新赛道领跑。'
  },
  {
    name: '双鱼座',
    englishName: 'Pisces',
    symbol: '♓',
    dates: '02.19 - 03.20',
    element: '水象',
    modality: '变动宫',
    rulingPlanet: '海王星 / 木星',
    keywords: ['梦幻灵性', '万物慈悲', '艺术超脱', '宇宙交融'],
    personalityDesc: '如汇纳百川之浩瀚汪洋，包容世间万千悲欢。心怀至纯至善之慈悲，艺术与精神直觉出神入化。',
    fortuneVibe2026: '灵性觉醒与疗愈转化之年，放下无谓执念，在艺术、心理与灵感中化茧成蝶。'
  }
];

// 根据公历月份和日期确定太阳星座
export function getSunZodiacSign(month: number, day: number): ZodiacSign {
  const dates = [
    { sign: ZODIAC_LIST[9], end: [1, 19] },   // 摩羯
    { sign: ZODIAC_LIST[10], end: [2, 18] },  // 水瓶
    { sign: ZODIAC_LIST[11], end: [3, 20] },  // 双鱼
    { sign: ZODIAC_LIST[0], end: [4, 19] },   // 白羊
    { sign: ZODIAC_LIST[1], end: [5, 20] },   // 金牛
    { sign: ZODIAC_LIST[2], end: [6, 21] },   // 双子
    { sign: ZODIAC_LIST[3], end: [7, 22] },   // 巨蟹
    { sign: ZODIAC_LIST[4], end: [8, 22] },   // 狮子
    { sign: ZODIAC_LIST[5], end: [9, 22] },   // 处女
    { sign: ZODIAC_LIST[6], end: [10, 23] },  // 天秤
    { sign: ZODIAC_LIST[7], end: [11, 22] },  // 天蝎
    { sign: ZODIAC_LIST[8], end: [12, 21] },  // 射手
    { sign: ZODIAC_LIST[9], end: [12, 31] },  // 摩羯后半
  ];

  for (const item of dates) {
    if (month < item.end[0] || (month === item.end[0] && day <= item.end[1])) {
      return item.sign;
    }
  }
  return ZODIAC_LIST[9]; // 默认摩羯
}

// 估算上升星座 (Ascendant)
export function estimateRisingSign(sunSignName: string, birthHour: number): string {
  const signNames = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
  const sunIdx = signNames.indexOf(sunSignName);
  // 简易地心占星上升点：大约太阳日出(6点)时上升点与太阳星座相合，每2小时换一个星座
  const offset = Math.floor(((birthHour - 6 + 24) % 24) / 2);
  const risingIdx = (sunIdx + offset) % 12;
  return signNames[risingIdx];
}

// 近期及未来数月权威重大天象星历库 (含水星逆行、金星逆行、火星逆行等)
// 当前系统参考时间: 2026年10月下旬
export const RAW_RETROGRADES = [
  {
    id: 'mercury-2026-3',
    planet: '水星',
    planetKey: 'mercury' as const,
    title: '2026年第三次水星逆行',
    startDate: '2026-10-24',
    endDate: '2026-11-13',
    zodiacScope: '天蝎座 21° → 天秤座 08°',
    shadowPeriod: '前阴影期: 10.06 - 10.23 / 后阴影期: 11.14 - 11.29',
    impactKeywords: ['通讯失灵', '旧情翻涌', '文书签约推迟', '电子设备故障', '故人重逢'],
    coreImpact: '本轮水逆横跨天蝎座与天秤座，直击“信任机制、利益分配与亲密关系深水区”。极易发生信息传递歧义、旧日财务纠纷重提或旧友前任突然联络。',
    generalAdvice: '重点备份数据、出行预留冗余时间；大额合同与购置大宗数码产品宜反复核实或延至顺行后；适合复盘反思与清理旧账。',
    heavyImpactSigns: ['天蝎座', '天秤座', '双子座', '处女座', '金牛座'],
  },
  {
    id: 'venus-2026',
    planet: '金星',
    planetKey: 'venus' as const,
    title: '2026年金星天蝎逆行',
    startDate: '2026-10-03',
    endDate: '2026-11-14',
    zodiacScope: '天蝎座 15° → 天蝎座 01°',
    shadowPeriod: '前阴影期: 09.12 - 10.02 / 后阴影期: 11.15 - 12.06',
    impactKeywords: ['审美动摇', '情感旧账清算', '财务价值重估', '复合与决裂', '嫉妒疑虑'],
    coreImpact: '金星落陷天蝎座逆行，乃近一年半以来最为深刻的情感与金钱大考。表面的虚假和谐被撕开，倒逼人们正视爱意真伪与资产真实归属。',
    generalAdvice: '切勿在此期间盲目整容、大改发型或一时冲动闪婚；适合清算旧有债务、重新审视金钱观；对旧情切莫饮鸩止渴。',
    heavyImpactSigns: ['天蝎座', '金牛座', '天秤座', '狮子座', '水瓶座'],
  },
  {
    id: 'saturn-2026',
    planet: '土星',
    planetKey: 'saturn' as const,
    title: '2026年土星逆行 (白羊座初度)',
    startDate: '2026-07-06',
    endDate: '2026-11-20',
    zodiacScope: '白羊座 01° → 双鱼座 26°',
    shadowPeriod: '2026年3月 - 2027年2月',
    impactKeywords: ['规则拷问', '责任承重', '因果显化', '结构重组'],
    coreImpact: '时代导师土星在开拓的白羊座与包容的双鱼座交界逆行，要求所有人重新检视过去数年的奋斗根基与规矩边界，拒绝虚假繁荣。',
    generalAdvice: '戒骄戒躁，勇于承担实质责任，巩固核心技能壁垒，慢即是快。',
    heavyImpactSigns: ['白羊座', '双鱼座', '摩羯座', '巨蟹座', '天秤座'],
  },
  {
    id: 'mercury-2027-1',
    planet: '水星',
    planetKey: 'mercury' as const,
    title: '2027年首次水星逆行 (风象水瓶)',
    startDate: '2027-02-09',
    endDate: '2027-03-03',
    zodiacScope: '水瓶座 16° → 水瓶座 02°',
    shadowPeriod: '前阴影期: 01.21 - 02.08 / 后阴影期: 03.04 - 03.20',
    impactKeywords: ['网络瘫痪', '社群理念分歧', '前沿科技反思', '团队沟通脱节'],
    coreImpact: '发生在风象水瓶座，重点波及互联网、社群组织、团队协作与前沿技术方案，容易出现理念冲突与系统宕机。',
    generalAdvice: '重点升级数据安全与云端备份，团队协作务求白纸黑字明确分工。',
    heavyImpactSigns: ['水瓶座', '狮子座', '金牛座', '天蝎座', '双子座'],
  },
  {
    id: 'mars-2027',
    planet: '火星',
    planetKey: 'mars' as const,
    title: '2027年火星逆行 (处女座 → 狮子座)',
    startDate: '2027-01-10',
    endDate: '2027-04-01',
    zodiacScope: '处女座 06° → 狮子座 23°',
    shadowPeriod: '2026年11月 - 2027年5月',
    impactKeywords: ['行动力受阻', '窝火内耗', '旧疾复发', '方案反复推翻'],
    coreImpact: '火星为行动与战力之星，逆行期间如同踩油门挂倒挡，容易出现焦虑内耗、体力透支或脾气积压后突然爆发。',
    generalAdvice: '避免开展高危对抗性冲突，合理安排健身作息，学会以柔克刚。',
    heavyImpactSigns: ['处女座', '狮子座', '白羊座', '天蝎座'],
  }
];

// 近期重要日月相与日月食
export const MOON_EVENTS: MoonPhaseEvent[] = [
  {
    date: '2026-10-26',
    title: '天蝎座新月 · 溯源重生',
    type: 'new_moon',
    sign: '天蝎座 03°',
    energyTheme: '深刻告别旧有执念，为资产投资、亲密深层链接与断舍离播种新意图。',
    practicalAdvice: '适合在当晚书写释放清单，剪除消耗自己的关系与无用习惯。'
  },
  {
    date: '2026-11-09',
    title: '金牛座满月月食 · 物质觉醒',
    type: 'lunar_eclipse',
    sign: '金牛座 17° (强效月食)',
    energyTheme: '一年中能量最为强烈的财务与安全感结算点，某些金钱或职场合作迎来决定性终局。',
    practicalAdvice: '情绪起伏大，避免在满月前后48小时做冲动重大投资决策。'
  },
  {
    date: '2026-11-24',
    title: '射手座新月 · 拓界远眺',
    type: 'new_moon',
    sign: '射手座 02°',
    energyTheme: '点燃对诗与远方的向往，适合开启进修旅行、跨国业务或哲学灵性探索。',
    practicalAdvice: '为未来一年的梦想绘制愿景板，立下宏阔远大的志向。'
  },
  {
    date: '2026-12-09',
    title: '双子座满月 · 认知通透',
    type: 'full_moon',
    sign: '双子座 17°',
    energyTheme: '信息流迎来大爆发，前期沟通的协议、稿件、考试或短途差旅迎来丰收复盘。',
    practicalAdvice: '理清纷乱思绪，与挚友促膝长谈，让真相大白于天下。'
  }
];

// 生成个性化的星相学全景档案
export function calculateAstrologyProfile(input: BirthInput): AstrologyProfile {
  let solarMonth = input.month;
  let solarDay = input.day;

  // 若为农历则转换为公历月日
  if (input.calendarType === 'lunar') {
    const lunar = Lunar.fromYmdHms(input.year, input.month, input.day, input.hour, 30, 0);
    const solar = lunar.getSolar();
    solarMonth = solar.getMonth();
    solarDay = solar.getDay();
  }

  const sunSign = getSunZodiacSign(solarMonth, solarDay);
  const risingSignEstimate = estimateRisingSign(sunSign.name, input.hour);

  // 简易推算月亮星座
  const moonSigns = ['巨蟹座', '金牛座', '双鱼座', '天秤座', '射手座', '双子座', '白羊座', '处女座', '狮子座', '天蝎座', '摩羯座', '水瓶座'];
  const moonSignEstimate = moonSigns[(solarMonth + Math.floor(solarDay / 3) + input.hour) % 12];

  // 星象四元素比例统计 (火、土、风、水)
  const elementMap: Record<string, number> = { '火象': 0, '土象': 0, '风象': 0, '水象': 0 };
  elementMap[sunSign.element] += 40;
  const risingObj = ZODIAC_LIST.find(z => z.name === risingSignEstimate);
  if (risingObj) elementMap[risingObj.element] += 30;
  const moonObj = ZODIAC_LIST.find(z => z.name === moonSignEstimate);
  if (moonObj) elementMap[moonObj.element] += 30;

  // 当前基准时间: 2026-10-23
  const nowMs = new Date('2026-10-23T00:00:00Z').getTime();

  let activeRetrogradesCount = 0;

  const retrogrades: RetrogradeEvent[] = RAW_RETROGRADES.map(item => {
    const startMs = new Date(item.startDate).getTime();
    const endMs = new Date(item.endDate).getTime();

    let status: 'ongoing' | 'upcoming' | 'past' = 'upcoming';
    let daysDiff = 0;

    if (nowMs >= startMs && nowMs <= endMs) {
      status = 'ongoing';
      daysDiff = Math.ceil((endMs - nowMs) / (1000 * 60 * 60 * 24)); // 剩余天数
      activeRetrogradesCount++;
    } else if (nowMs < startMs) {
      status = 'upcoming';
      daysDiff = Math.ceil((startMs - nowMs) / (1000 * 60 * 60 * 24)); // 距离开始天数
    } else {
      status = 'past';
      daysDiff = Math.ceil((nowMs - endMs) / (1000 * 60 * 60 * 24)); // 结束过去天数
    }

    // 针对用户本命太阳星座的定制影响
    let signSpecificImpact = '';
    const isHeavy = item.heavyImpactSigns.includes(sunSign.name);

    if (item.planetKey === 'mercury') {
      if (sunSign.name === '双子座' || sunSign.name === '处女座') {
        signSpecificImpact = '作为水星守护的星座，本轮水逆你受波及尤为敏感，思维易出现短暂卡顿或钻牛角尖，宜放慢语速多听少言。';
      } else if (item.zodiacScope.includes(sunSign.name)) {
        signSpecificImpact = `水逆正发生在你的星座或对轴，个人形象、言行易被过度解读，务必反复核对备忘录与重要邮件。`;
      } else if (isHeavy) {
        signSpecificImpact = '本轮水逆主要冲击你的核心利益或日常沟通人际圈，谨防口舌误会与临时行程生变。';
      } else {
        signSpecificImpact = '对你冲击相对缓和，但仍需遵从“勤备份、慢承诺、常复盘”的基本法则。';
      }
    } else if (item.planetKey === 'venus') {
      if (sunSign.name === '金牛座' || sunSign.name === '天秤座') {
        signSpecificImpact = '金星为你本命守护星，逆行期间审美或情感易有“滤镜破碎”感，切忌一时冲动做不可逆的感情或财务决断。';
      } else if (isHeavy) {
        signSpecificImpact = '受到金逆深度洗礼，旧人旧爱或历史财务旧账可能重回视线，直面它才是终结内耗的唯一钥匙。';
      } else {
        signSpecificImpact = '金逆提醒你重新衡量自己值得被如何对待，适合审视消费账单与自我价值认同。';
      }
    } else {
      signSpecificImpact = isHeavy ? '受其重磅磨砺，考校耐心与硬本领，逆风方显英雄本色。' : '按部就班推进，不受外围风浪干扰即可。';
    }

    return {
      ...item,
      status,
      daysDiff,
      signSpecificImpact,
    };
  });

  // 个性化水逆防御锦囊
  const mercuryRetrogradeAdvice = `命主为【${sunSign.name}】（${sunSign.element}）。近期面对水逆，核心防御诀窍：
1. 涉及重大合作签约，务必逐条校对条款细节，必要时留存备份；
2. 电子设备与工作文件开启多端自动云同步；
3. 遇到故人旧事重提，保持清醒客观，观其言更观其行。`;

  // 个性化金逆防御锦囊
  const venusRetrogradeAdvice = `面对当前金逆天象，【${sunSign.name}】应牢记：
1. 避免冲动进行大额医美、发型颠覆性改造或高奢消费；
2. 感情中莫翻旧账，重在坦诚表达真实需求而非相互试探；
3. 适合做财务体检，收回借款并削减不必要的社交应酬开支。`;

  return {
    sunSign,
    moonSignEstimate,
    risingSignEstimate,
    elementBreakdown: {
      fire: elementMap['火象'],
      earth: elementMap['土象'],
      air: elementMap['风象'],
      water: elementMap['水象'],
    },
    retrogrades,
    activeRetrogradesCount,
    moonEvents: MOON_EVENTS,
    mercuryRetrogradeAdvice,
    venusRetrogradeAdvice,
  };
}
