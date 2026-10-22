import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as echarts from 'echarts';
import { 
  BaziChart, 
  KlineBar, 
  FortuneDimension, 
  ChartFilterOptions 
} from '../types/destiny';
import { generateMonthKlines } from '../utils/baziEngine';
import { ChevronLeft, RefreshCw, ZoomIn, ZoomOut, Compass } from 'lucide-react';

interface KlineChartProps {
  bazi: BaziChart;
  yearBars: KlineBar[];
  onSelectYear?: (year: number) => void;
}

const DIMENSION_TABS: Array<{ id: FortuneDimension; label: string; dotColor: string }> = [
  { id: 'overall', label: '综合', dotColor: 'bg-[#544332]' },
  { id: 'wealth', label: '财富', dotColor: 'bg-[#d4af37]' },
  { id: 'career', label: '事业', dotColor: 'bg-[#2b6cb0]' },
  { id: 'romance', label: '感情', dotColor: 'bg-[#c53030]' },
  { id: 'health', label: '健康', dotColor: 'bg-[#2d8b68]' },
];

export const KlineChart: React.FC<KlineChartProps> = ({
  bazi,
  yearBars,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // Filter options state
  const [filter, setFilter] = useState<ChartFilterOptions>({
    dimension: 'career', // Default to career as in user screenshot
    timeRange: 'all',
    klineType: 'year',
    showOriginalBaseline: false,
    showMa1Year: true,
    showProjectionZone: true,
    showVolume: true,
    showRSI: false,
    selectedYearForMonthK: 2026,
  });

  const [activeDaYunName, setActiveDaYunName] = useState<string>('壬寅运·正财');
  const [isDrilldown, setIsDrilldown] = useState<boolean>(false);

  // Current year landmark (2026)
  const currentYear = 2026;

  // Determine current active bars: Year K or Month K
  const currentBars = useMemo(() => {
    if (isDrilldown) {
      const yearBar = yearBars.find(b => b.year === filter.selectedYearForMonthK) || yearBars[0];
      return generateMonthKlines(bazi, filter.selectedYearForMonthK, yearBar);
    }

    if (filter.timeRange === 'recent') {
      const rec = yearBars.filter(b => b.year >= currentYear - 5 && b.year <= currentYear + 8);
      return rec.length > 0 ? rec : yearBars.slice(Math.max(0, Math.min(20, yearBars.length - 16)), Math.min(yearBars.length, 36));
    } else if (filter.timeRange === 'projection') {
      const proj = yearBars.filter(b => b.year >= currentYear);
      return proj.length > 0 ? proj : yearBars.slice(Math.max(0, Math.floor(yearBars.length / 2)));
    }
    return yearBars;
  }, [isDrilldown, filter.selectedYearForMonthK, filter.timeRange, yearBars, bazi]);

  // Update DaYun banner based on middle visible bar
  useEffect(() => {
    if (currentBars.length > 0) {
      const mid = currentBars[Math.floor(currentBars.length / 2)];
      setActiveDaYunName(mid.daYunName);
    }
  }, [currentBars]);

  // Initialize and update ECharts
  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;
    const dim = filter.dimension;

    // Categories (X axis labels)
    const categoryData = currentBars.map(b => isDrilldown ? b.timeLabel : `${b.year} ${b.ganZhi}`);
    
    // Candlestick OHLC values: [open, close, lowest, highest]
    // Separate into historical (solid) and future (dotted/hollow)
    const pastValues: (number | null)[][] = [];
    const futureValues: (number | null)[][] = [];
    const ma1YearValues: (number | null)[] = [];
    const originalBaselineValues: (number | null)[] = [];
    const volumeValues: { value: number; itemStyle: { color: string } }[] = [];
    const rsiValues: (number | null)[] = [];

    // Scatter marks for events
    const auspiciousMarks: any[] = [];
    const inauspiciousMarks: any[] = [];
    const turningMarks: any[] = [];

    currentBars.forEach((b, idx) => {
      const dData = b.dimensions[dim];
      const ohlc = [dData.open, dData.close, dData.low, dData.high];
      const isUp = dData.close >= dData.open;
      const barColor = isUp ? '#2d8b68' : '#c93f28';

      if (b.isFuture) {
        pastValues.push([null, null, null, null]);
        futureValues.push(ohlc);
      } else {
        pastValues.push(ohlc);
        futureValues.push([null, null, null, null]);
      }

      ma1YearValues.push(filter.showMa1Year ? b.ma1Year : null);
      originalBaselineValues.push(filter.showOriginalBaseline ? b.originalBaseline : null);
      rsiValues.push(filter.showRSI ? b.rsi : null);

      volumeValues.push({
        value: b.volume,
        itemStyle: { color: isUp ? '#5dae8b' : '#e06d53' }
      });

      // Events marks
      b.events.forEach(ev => {
        if (ev.type === 'auspicious') {
          auspiciousMarks.push({ coord: [idx, dData.high + 2], value: '▲' });
        } else if (ev.type === 'inauspicious') {
          inauspiciousMarks.push({ coord: [idx, dData.low - 2], value: '▼' });
        } else if (ev.type === 'turning') {
          turningMarks.push({ coord: [idx, (dData.high + dData.low) / 2], value: '◆' });
        }
      });
    });

    // Find index of currentYear for the "今 · 2026" vertical divider
    const currentYearIndex = currentBars.findIndex(b => b.year === currentYear);

    const option: echarts.EChartsOption = {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 500,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            color: '#a88960',
            width: 1,
            type: 'dashed'
          }
        },
        backgroundColor: '#fbf8f1',
        borderColor: '#d5be9e',
        borderWidth: 1.5,
        padding: 0,
        textStyle: { color: '#2c2523', fontFamily: 'serif' },
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
          const dataIndex = params[0].dataIndex;
          const bar = currentBars[dataIndex];
          if (!bar) return '';

          const dData = bar.dimensions[dim];
          const diff = Math.round((dData.close - dData.open) * 10) / 10;
          const diffSign = diff >= 0 ? `↑ ${diff}` : `↓ ${Math.abs(diff)}`;
          const diffColor = diff >= 0 ? '#2d8b68' : '#c93f28';

          const dimLabels: Record<FortuneDimension, string> = {
            overall: '综合',
            wealth: '财富',
            career: '事业',
            romance: '感情',
            health: '健康',
          };

          return `
            <div style="padding: 12px 14px; min-width: 250px; font-family: 'Noto Serif SC', serif; line-height: 1.6; font-size: 13px; color: #352b20;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #d5be9e; padding-bottom: 6px; margin-bottom: 8px;">
                <span style="font-weight: bold; font-size: 14px; color: #2c2523;">
                  ${bar.year}${bar.month ? '.' + bar.month : ''} ${bar.ganZhi}${bar.lunarMonthName ? ' (' + bar.lunarMonthName + ')' : ''} · 周岁 ${bar.age}
                </span>
                <span style="background: ${bar.isFuture ? '#fff0e6' : '#edf7ed'}; color: ${bar.isFuture ? '#c93f28' : '#2d8b68'}; border: 1px solid ${bar.isFuture ? '#f5c6b0' : '#b2dfdb'}; font-size: 11px; padding: 1px 6px; border-radius: 3px;">
                  ${bar.isFuture ? '推演' : '实盘'}
                </span>
              </div>
              <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: baseline;">
                <span>
                  <strong style="color: #2b6cb0;">— ${dimLabels[dim]}</strong>: 
                  <span style="font-size: 15px; font-weight: bold;">${dData.close}</span>
                  <span style="font-size: 11px; color: #786b59; margin-left: 6px;">
                    起 ${dData.open} · ${dData.low}-${dData.high}
                  </span>
                </span>
                <span style="color: ${diffColor}; font-weight: bold; font-size: 12px;">${diffSign}</span>
              </div>
              <div style="font-size: 11px; color: #5c544c; margin-bottom: 6px;">
                <span>事件量: <strong>${bar.volume}</strong></span>
                <span style="margin: 0 8px;">·</span>
                <span>一年线: <strong>${bar.ma1Year}</strong></span>
              </div>
              <div style="font-size: 11px; color: #786b59; border-top: 1px dashed #e5d6be; padding-top: 6px; margin-top: 6px;">
                <span>流年 <strong>${bar.ganZhi}</strong> | 大运 <strong>${bar.daYunName}</strong></span>
                ${bar.stars.length > 0 ? `<div style="color: #a22d1b; margin-top: 2px;">★ 神煞: ${bar.stars.join(' · ')}</div>` : ''}
                ${bar.interrelations.length > 0 ? `<div style="color: #c93f28; margin-top: 2px;">⚡ 刑冲: ${bar.interrelations.join(' · ')}</div>` : ''}
              </div>
              <div style="font-size: 11px; color: #8c7a6b; margin-top: 6px; font-style: italic; background: #f5eedf; padding: 4px 8px; border-radius: 4px;">
                批语: ${bar.summaryAdvice}
              </div>
              <div style="text-align: right; font-size: 10px; color: #a22d1b; margin-top: 6px;">
                ${isDrilldown ? '双击空白处或点击左上角返回年K' : '点击此柱下钻查看该年12个月月K'}
              </div>
            </div>
          `;
        }
      },
      axisPointer: {
        link: [{ xAxisIndex: 'all' }],
        label: {
          backgroundColor: '#544332'
        }
      },
      grid: [
        {
          left: '4%',
          right: '3%',
          top: '9%',
          height: filter.showVolume ? '64%' : '80%',
        },
        {
          left: '4%',
          right: '3%',
          top: '77%',
          height: '14%',
          show: filter.showVolume,
        }
      ],
      xAxis: [
        {
          type: 'category',
          data: categoryData,
          boundaryGap: true,
          axisLine: { lineStyle: { color: '#c2a57e' } },
          axisTick: { lineStyle: { color: '#c2a57e' } },
          axisLabel: {
            color: '#544332',
            fontSize: 11,
            formatter: (val: string) => val.split(' ')[0], // show year or month
          },
          splitLine: {
            show: true,
            lineStyle: { color: '#efe6d5', type: 'dotted' }
          }
        },
        {
          type: 'category',
          gridIndex: 1,
          data: categoryData,
          boundaryGap: true,
          axisLine: { lineStyle: { color: '#c2a57e' } },
          axisTick: { show: false },
          axisLabel: { show: false },
          splitLine: { show: false }
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: { show: false },
          axisLine: { lineStyle: { color: '#c2a57e' } },
          axisLabel: { color: '#544332', fontSize: 11 },
          splitLine: {
            show: true,
            lineStyle: { color: '#efe6d5' }
          }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: isDrilldown 
            ? 0 
            : currentYearIndex >= 0 
            ? Math.max(0, ((currentYearIndex - 12) / Math.max(1, currentBars.length)) * 100) 
            : 0,
          end: isDrilldown 
            ? 100 
            : currentYearIndex >= 0 
            ? Math.min(100, ((currentYearIndex + 14) / Math.max(1, currentBars.length)) * 100) 
            : 100,
        },
        {
          show: false,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: '1%',
          start: 0,
          end: 100,
        }
      ],
      series: [
        // 1. Past Solid Candlestick
        {
          name: '实盘K线',
          type: 'candlestick',
          data: pastValues,
          itemStyle: {
            color: '#2d8b68', // Green for rising
            color0: '#c93f28', // Red for falling
            borderColor: '#237053',
            borderColor0: '#a22d1b',
          },
          markLine: currentYearIndex >= 0 ? {
            symbol: ['none', 'none'],
            data: [
              {
                xAxis: currentYearIndex,
                lineStyle: {
                  color: '#c93f28',
                  type: 'dashed',
                  width: 1.5,
                },
                label: {
                  formatter: `今 · ${currentYear}`,
                  position: 'insideStartTop',
                  backgroundColor: '#c93f28',
                  color: '#fff',
                  padding: [2, 6],
                  borderRadius: 3,
                  fontSize: 11,
                  fontFamily: 'serif'
                }
              }
            ]
          } : undefined
        },

        // 2. Future Projection Dotted/Hollow Candlestick
        {
          name: '推演(虚框)',
          type: 'candlestick',
          data: futureValues,
          itemStyle: {
            color: 'rgba(45, 139, 104, 0.15)', // Hollow green
            color0: 'rgba(201, 63, 40, 0.15)', // Hollow red
            borderColor: '#2d8b68',
            borderColor0: '#c93f28',
            borderType: 'dashed',
            borderWidth: 1.5,
          }
        },

        // 3. 一年线 (Ma1Year Smooth Trend Curve)
        {
          name: '一年线',
          type: 'line',
          data: ma1YearValues,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: '#4a55a2',
            width: 2,
            opacity: 0.85
          }
        },

        // 4. 命理原判 (Golden Dotted Curve)
        {
          name: '命理原判',
          type: 'line',
          data: originalBaselineValues,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            color: '#d4af37',
            width: 2,
            type: 'dotted'
          }
        },

        // 5. 吉事散点标记
        {
          name: '吉事',
          type: 'scatter',
          data: auspiciousMarks,
          symbol: 'triangle',
          symbolSize: 9,
          itemStyle: { color: '#2d8b68' },
          tooltip: { show: false }
        },

        // 6. 凶事散点标记
        {
          name: '凶事',
          type: 'scatter',
          data: inauspiciousMarks,
          symbol: 'triangle',
          symbolRotate: 180,
          symbolSize: 9,
          itemStyle: { color: '#c93f28' },
          tooltip: { show: false }
        },

        // 7. 转折点散点标记
        {
          name: '转折',
          type: 'scatter',
          data: turningMarks,
          symbol: 'diamond',
          symbolSize: 8,
          itemStyle: { color: '#352b20' },
          tooltip: { show: false }
        },

        // 8. 下方指标副图: 事件量 (Volume)
        ...(filter.showVolume ? [
          {
            name: '事件量',
            type: 'bar' as const,
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: volumeValues,
            barWidth: '55%',
          }
        ] : [])
      ]
    };

    chart.setOption(option, true);

    // Click handler to drilldown to Month K
    const handleChartClick = (params: any) => {
      if (!isDrilldown && params.dataIndex !== undefined) {
        const selectedBar = currentBars[params.dataIndex];
        if (selectedBar) {
          setFilter(prev => ({
            ...prev,
            selectedYearForMonthK: selectedBar.year,
            klineType: 'month'
          }));
          setIsDrilldown(true);
        }
      }
    };

    chart.on('click', handleChartClick);

    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chart.off('click', handleChartClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [currentBars, filter, isDrilldown, bazi]);

  // Dimension switch handler
  const handleDimensionChange = (dim: FortuneDimension) => {
    setFilter(prev => ({ ...prev, dimension: dim }));
  };

  // Switch back from Month K to Year K
  const handleBackToYearK = () => {
    setIsDrilldown(false);
    setFilter(prev => ({ ...prev, klineType: 'year' }));
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!chartInstance.current) return;
    chartInstance.current.dispatchAction({
      type: 'dataZoom',
      batch: [
        {
          xAxisIndex: [0, 1],
          start: direction === 'in' ? 25 : 0,
          end: direction === 'in' ? 75 : 100
        }
      ]
    });
  };

  return (
    <div className="parchment-card rounded-lg p-3 sm:p-5 text-[#2c2523] select-none shadow-md">
      {/* 1. Header Section: Chapter Title & Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-[#dfd3c1] gap-2">
        <div className="flex items-center space-x-3">
          <span className="chinese-stamp text-sm sm:text-base font-bold px-2 py-0.5">
            卷一
          </span>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide font-serif text-[#352b20] flex items-center gap-2">
              运势总览
              {isDrilldown && (
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-[#c93f28]/10 text-[#c93f28] border border-[#c93f28]/30">
                  {filter.selectedYearForMonthK}年 逐月月K详卷
                </span>
              )}
            </h2>
            <p className="text-xs text-[#786b59] font-serif">
              命运K线 · 综合与四维 · 金色虚线为命理原判
            </p>
          </div>
        </div>

        {/* Drilldown Back Button */}
        {isDrilldown && (
          <button
            onClick={handleBackToYearK}
            className="flex items-center space-x-1 px-3 py-1 bg-[#efe6d5] hover:bg-[#dfd3c1] border border-[#c2a57e] rounded text-xs font-medium transition self-start md:self-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>返回人生年K全景</span>
          </button>
        )}
      </div>

      {/* 2. Dimension & Indicator Filter Bar */}
      <div className="flex flex-wrap items-center justify-between py-3 border-b border-[#dfd3c1] gap-3 text-xs sm:text-sm">
        {/* Left: Dimension Switcher */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-[#efe6d5]/50 p-1 rounded border border-[#dfd3c1]">
          {DIMENSION_TABS.map(tab => {
            const isActive = filter.dimension === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleDimensionChange(tab.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded transition font-medium ${
                  isActive
                    ? 'bg-[#c93f28] text-white shadow-sm'
                    : 'text-[#544332] hover:bg-[#dfd3c1]/60'
                }`}
              >
                {tab.id !== 'overall' && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : tab.dotColor}`} />
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Middle: Technical Indicators Checkboxes */}
        <div className="flex items-center flex-wrap gap-2 text-xs text-[#544332]">
          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.showOriginalBaseline}
              onChange={e => setFilter({ ...filter, showOriginalBaseline: e.target.checked })}
              className="accent-[#b8860b]"
            />
            <span>命理原判</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.showMa1Year}
              onChange={e => setFilter({ ...filter, showMa1Year: e.target.checked })}
              className="accent-[#4a55a2]"
            />
            <span>一年线</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.showVolume}
              onChange={e => setFilter({ ...filter, showVolume: e.target.checked })}
              className="accent-[#2d8b68]"
            />
            <span>事件量</span>
          </label>

          <label className="flex items-center space-x-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filter.showRSI}
              onChange={e => setFilter({ ...filter, showRSI: e.target.checked })}
              className="accent-[#c93f28]"
            />
            <span>RSI</span>
          </label>
        </div>

        {/* Right: Time Range & Resolution Switcher */}
        <div className="flex items-center space-x-1 bg-[#efe6d5]/50 p-1 rounded border border-[#dfd3c1] text-xs">
          <button
            onClick={() => { setIsDrilldown(false); setFilter({ ...filter, timeRange: 'all', klineType: 'year' }); }}
            className={`px-2 py-0.5 rounded transition ${
              !isDrilldown && filter.timeRange === 'all' ? 'bg-[#544332] text-white font-medium' : 'text-[#544332] hover:bg-[#dfd3c1]'
            }`}
          >
            年K·全卷
          </button>
          <button
            onClick={() => { setIsDrilldown(false); setFilter({ ...filter, timeRange: 'recent', klineType: 'year' }); }}
            className={`px-2 py-0.5 rounded transition ${
              !isDrilldown && filter.timeRange === 'recent' ? 'bg-[#544332] text-white font-medium' : 'text-[#544332] hover:bg-[#dfd3c1]'
            }`}
          >
            近年
          </button>
          <button
            onClick={() => { setIsDrilldown(false); setFilter({ ...filter, timeRange: 'projection', klineType: 'year' }); }}
            className={`px-2 py-0.5 rounded transition ${
              !isDrilldown && filter.timeRange === 'projection' ? 'bg-[#544332] text-white font-medium' : 'text-[#544332] hover:bg-[#dfd3c1]'
            }`}
          >
            推演
          </button>
          <button
            onClick={() => { setIsDrilldown(true); setFilter({ ...filter, klineType: 'month' }); }}
            className={`px-2 py-0.5 rounded transition ${
              isDrilldown ? 'bg-[#c93f28] text-white font-medium' : 'text-[#544332] hover:bg-[#dfd3c1]'
            }`}
          >
            月K·逐月
          </button>
        </div>
      </div>

      {/* 3. DaYun Top Ribbon Bar */}
      <div className="my-2 px-4 py-1.5 rounded bg-[#e3ece8]/70 border border-[#b8d4c9] text-xs flex items-center justify-between text-[#2d5f4e]">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-[#1e4639]">【行经大运】</span>
          <span className="font-bold tracking-wider">{activeDaYunName}</span>
        </div>
        <div className="text-[11px] text-[#4b7a69] hidden sm:block">
          管运十年吉凶大势 · 流年引动吉凶聚散
        </div>
      </div>

      {/* 4. Candlestick Canvas Container */}
      <div className="relative w-full h-[460px] sm:h-[500px]">
        <div ref={chartRef} className="w-full h-full" />
      </div>

      {/* 5. Chart Legend Bar */}
      <div className="pt-2 border-t border-[#dfd3c1] flex items-center flex-wrap justify-between gap-2 text-[11px] text-[#786b59]">
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#2d8b68] mr-1 rounded-sm" /> 走高
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 bg-[#c93f28] mr-1 rounded-sm" /> 走低
          </span>
          <span className="flex items-center">
            <span className="w-2.5 h-2.5 border border-[#2d8b68] border-dashed mr-1 rounded-sm" /> 推演(虚框)
          </span>
          <span className="flex items-center">
            <span className="w-3 h-0.5 bg-[#4a55a2] mr-1" /> 一年线
          </span>
          <span className="flex items-center">
            <span className="w-3 h-0.5 border-t border-[#d4af37] border-dotted mr-1" /> 命理原判
          </span>
          <span className="flex items-center text-[#2d8b68]">
            <span className="mr-0.5">▲</span> 吉事
          </span>
          <span className="flex items-center text-[#c93f28]">
            <span className="mr-0.5">▼</span> 凶事
          </span>
          <span className="flex items-center text-[#352b20]">
            <span className="mr-0.5">◆</span> 转折
          </span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoom('in')}
            className="p-1 rounded bg-[#efe6d5] hover:bg-[#dfd3c1] border border-[#c2a57e] transition"
            title="放大视角"
          >
            <ZoomIn className="w-3.5 h-3.5 text-[#544332]" />
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="p-1 rounded bg-[#efe6d5] hover:bg-[#dfd3c1] border border-[#c2a57e] transition"
            title="缩放全览"
          >
            <ZoomOut className="w-3.5 h-3.5 text-[#544332]" />
          </button>
        </div>
      </div>

      {/* 6. Classical Interactive Footer Guide */}
      <div className="mt-2 py-1.5 px-3 rounded bg-[#f5eedf]/60 border border-[#e5d6be] text-[11px] text-[#8c7a6b] flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <div>
          滚轮缩放，拖动平移 · 点击蜡烛下钻至该年逐月月K · 悬停可透视流年干支、神煞与命理批语
        </div>
        <div className="font-serif text-[#a22d1b] font-medium">
          天道有常，变易维新 · 命自我立，福自己求
        </div>
      </div>
    </div>
  );
};
