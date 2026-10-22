import React from 'react';
import { BaziChart } from '../types/destiny';
import { Compass, Palette, Hash, Building2, Sun, Moon, CheckCircle2, AlertCircle } from 'lucide-react';

interface XijiViewProps {
  bazi: BaziChart;
}

const ELEMENT_ATTRIBUTES: Record<string, {
  colors: string;
  directions: string;
  numbers: string;
  industries: string;
  season: string;
}> = {
  '木': {
    colors: '青色、绿色、翠绿、墨绿',
    directions: '正东、东南方位',
    numbers: '3、8',
    industries: '文化、教育、出版、林木、设计、园艺、医疗、中草药',
    season: '春季 (农历正月至三月，万物生发)',
  },
  '火': {
    colors: '红色、紫色、粉色、朱红',
    directions: '正南方位',
    numbers: '2、7',
    industries: '互联网、能源、电子、餐饮、影视传媒、公关演艺、照明',
    season: '夏季 (农历四月至六月，阳气鼎盛)',
  },
  '土': {
    colors: '黄色、棕色、米色、咖啡色',
    directions: '正中、东北、西南方位',
    numbers: '5、0',
    industries: '房地产、建筑、农业、仓储、地质矿产、管理咨询、古玩',
    season: '四季末月 (农历三、六、九、十二月，承前启后)',
  },
  '金': {
    colors: '白色、银色、金色、黄铜色',
    directions: '正西、西北方位',
    numbers: '4、9',
    industries: '金融、银行、黄金珠宝、机械制造、五金、法律、国防',
    season: '秋季 (农历七月至九月，肃杀收敛)',
  },
  '水': {
    colors: '黑色、蓝色、玄青、天蓝',
    directions: '正北方位',
    numbers: '1、6',
    industries: '物流、航运、国际贸易、旅游、水产、文创流动、传播',
    season: '冬季 (农历十月至十二月，潜藏蓄势)',
  },
};

export const XijiView: React.FC<XijiViewProps> = ({ bazi }) => {
  const xiElements = bazi.xiYongShen;
  const jiElements = bazi.jiShen;

  return (
    <div className="space-y-6">
      <div className="parchment-card rounded-lg p-5">
        <div className="flex items-center space-x-2 border-b border-[#dfd3c1] pb-3 mb-2">
          <span className="chinese-stamp text-sm">喜忌</span>
          <h3 className="text-xl font-bold font-serif text-[#352b20]">
            命盘五行喜忌指南 · 趋吉避凶之道
          </h3>
        </div>
        <p className="text-xs text-[#786b59]">
          知命造之偏枯，顺天地之五行。以喜用神调和自身气场，在日常衣着、居所、方位及职业抉择中借势乘风。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Favorable Guide */}
        <div className="parchment-card rounded-lg p-5 border-l-4 border-l-[#2d8b68]">
          <div className="flex items-center space-x-2 text-[#2d8b68] pb-3 border-b border-[#dfd3c1] mb-4">
            <CheckCircle2 className="w-5 h-5" />
            <h4 className="font-serif font-bold text-base text-[#1e4639]">
              吉运喜用神：{xiElements.map(e => `【${e}】`).join(' ')}
            </h4>
          </div>

          <div className="space-y-4 text-xs">
            {xiElements.map(elem => {
              const attr = ELEMENT_ATTRIBUTES[elem];
              if (!attr) return null;
              return (
                <div key={elem} className="p-3 bg-[#eef8f3] rounded border border-[#c8e6c9] space-y-2">
                  <div className="font-serif font-bold text-sm text-[#2e7d32]">
                    五行属【{elem}】之助力气场:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#544332]">
                    <div>
                      <strong className="text-[#2e7d32]">吉祥色彩:</strong> {attr.colors}
                    </div>
                    <div>
                      <strong className="text-[#2e7d32]">有利方位:</strong> {attr.directions}
                    </div>
                    <div>
                      <strong className="text-[#2e7d32]">幸运数字:</strong> {attr.numbers}
                    </div>
                    <div>
                      <strong className="text-[#2e7d32]">贵人时令:</strong> {attr.season}
                    </div>
                  </div>
                  <div className="text-[#544332] pt-1 border-t border-[#c8e6c9]/60">
                    <strong className="text-[#2e7d32]">适宜产业:</strong> {attr.industries}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Unfavorable Guide */}
        <div className="parchment-card rounded-lg p-5 border-l-4 border-l-[#c93f28]">
          <div className="flex items-center space-x-2 text-[#c93f28] pb-3 border-b border-[#dfd3c1] mb-4">
            <AlertCircle className="w-5 h-5" />
            <h4 className="font-serif font-bold text-base text-[#a22d1b]">
              防微忌讳神：{jiElements.map(e => `【${e}】`).join(' ')}
            </h4>
          </div>

          <div className="space-y-4 text-xs">
            {jiElements.map(elem => {
              const attr = ELEMENT_ATTRIBUTES[elem];
              if (!attr) return null;
              return (
                <div key={elem} className="p-3 bg-[#fff5f5] rounded border border-[#ffcdd2] space-y-2">
                  <div className="font-serif font-bold text-sm text-[#c62828]">
                    五行属【{elem}】之克耗防范:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#544332]">
                    <div>
                      <strong className="text-[#c62828]">少用色彩:</strong> {attr.colors}
                    </div>
                    <div>
                      <strong className="text-[#c62828]">多慎方位:</strong> {attr.directions}
                    </div>
                  </div>
                  <div className="text-[#544332] pt-1 border-t border-[#ffcdd2]/60">
                    <strong className="text-[#c62828]">防范提醒:</strong> 遇此五行太岁旺年，行事宜静不宜动，戒骄戒躁，审慎投资签约，防小人口舌。
                  </div>
                </div>
              );
            })}

            <div className="p-3 bg-[#fdfbf7] rounded border border-[#dfd3c1] text-[#786b59] leading-relaxed">
              <strong>圣人立象之本意：</strong>
              “易无思也，无为也，感而遂通天下之故。” 喜忌非绝对祸福，知忌而收敛内守，知喜而勇猛精进，即为圣贤造命之道。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
