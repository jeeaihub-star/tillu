import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { BatteryCharging, Brain, TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { StoredReport } from '../types';

interface MoodHistoryChartProps {
  reports: StoredReport[];
}

interface DayTrendPoint {
  dateKey: string;
  displayDate: string;
  dayName: string;
  battery: number | null;
  overthinking: number | null;
  checkInCount: number;
  moodEmoji: string;
  moodTitle: string;
}

export const MoodHistoryChart: React.FC<MoodHistoryChartProps> = ({ reports }) => {
  const [metricView, setMetricView] = useState<'both' | 'battery' | 'overthinking'>('both');

  // Compute 7-day timeline from today back to 6 days ago
  const { chartData, avgBattery, avgOverthinking, totalCheckIns, dominantMood } = useMemo(() => {
    const days: DayTrendPoint[] = [];
    const now = new Date();
    const moodCounts: Record<string, { count: number; emoji: string }> = {};

    let totalBatterySum = 0;
    let totalBatteryCount = 0;
    let totalOverthinkSum = 0;
    let totalOverthinkCount = 0;

    // Generate last 7 days in chronological order
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split('T')[0]; // YYYY-MM-DD
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Yest.' : d.toLocaleDateString([], { weekday: 'short' });
      const displayDate = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

      // Find all reports submitted on this calendar day
      const dayReports = reports.filter((r) => {
        if (!r.timestamp) return false;
        const rDateKey = new Date(r.timestamp).toISOString().split('T')[0];
        return rDateKey === dateKey;
      });

      if (dayReports.length > 0) {
        // Compute day average
        let dayBatterySum = 0;
        let dayOverthinkSum = 0;
        let dayBatteryCount = 0;
        let dayOverthinkCount = 0;
        let latestMood = dayReports[dayReports.length - 1].selectedMood;

        dayReports.forEach((r) => {
          if (typeof r.batteryLevel === 'number') {
            dayBatterySum += r.batteryLevel * 10; // convert to 0-100 scale
            dayBatteryCount++;
            totalBatterySum += r.batteryLevel * 10;
            totalBatteryCount++;
          }
          if (typeof r.overthinkingLevel === 'number') {
            dayOverthinkSum += r.overthinkingLevel; // 1-10 scale
            dayOverthinkCount++;
            totalOverthinkSum += r.overthinkingLevel;
            totalOverthinkCount++;
          }
          if (r.selectedMood?.title) {
            const title = r.selectedMood.title;
            const emoji = r.selectedMood.emoji || '✨';
            if (!moodCounts[title]) moodCounts[title] = { count: 0, emoji };
            moodCounts[title].count++;
          }
        });

        days.push({
          dateKey,
          displayDate,
          dayName,
          battery: dayBatteryCount > 0 ? Math.round(dayBatterySum / dayBatteryCount) : null,
          overthinking: dayOverthinkCount > 0 ? Number((dayOverthinkSum / dayOverthinkCount).toFixed(1)) : null,
          checkInCount: dayReports.length,
          moodEmoji: latestMood?.emoji || '✨',
          moodTitle: latestMood?.title || 'Active',
        });
      } else {
        days.push({
          dateKey,
          displayDate,
          dayName,
          battery: null,
          overthinking: null,
          checkInCount: 0,
          moodEmoji: '—',
          moodTitle: 'No Entry',
        });
      }
    }

    // Find dominant mood
    let bestMood = 'Soft & Tender';
    let bestEmoji = '🌸';
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([title, info]) => {
      if (info.count > maxCount) {
        maxCount = info.count;
        bestMood = title;
        bestEmoji = info.emoji;
      }
    });

    return {
      chartData: days,
      avgBattery: totalBatteryCount > 0 ? Math.round(totalBatterySum / totalBatteryCount) : 65,
      avgOverthinking: totalOverthinkCount > 0 ? (totalOverthinkSum / totalOverthinkCount).toFixed(1) : '4.5',
      totalCheckIns: reports.length,
      dominantMood: `${bestEmoji} ${bestMood}`,
    };
  }, [reports]);

  // Check if we have at least one valid data point in the 7 days
  const hasDataPoints = chartData.some((d) => d.battery !== null);

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 space-y-3">
      {/* Title & View selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-outfit font-bold text-xs text-slate-100 flex items-center gap-1.5">
              <span>Mood & Mental Energy History</span>
              <span className="text-[10px] text-slate-400 font-normal">Last 7 Days</span>
            </h3>
            <span className="text-[10px] text-slate-400">
              Visualized trends across her social battery & overthinking levels
            </span>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="inline-flex p-0.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px]">
          <button
            onClick={() => setMetricView('both')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
              metricView === 'both'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setMetricView('battery')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
              metricView === 'battery'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Battery %
          </button>
          <button
            onClick={() => setMetricView('overthinking')}
            className={`px-2 py-0.5 rounded-lg font-medium transition-all cursor-pointer ${
              metricView === 'overthinking'
                ? 'bg-indigo-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overthinking
          </button>
        </div>
      </div>

      {/* Metric Quick Stats Chips */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
        <div className="p-2 bg-slate-900/90 border border-slate-850 rounded-xl">
          <span className="text-slate-500 block flex items-center justify-center gap-1">
            <BatteryCharging className="w-2.5 h-2.5 text-rose-400" />
            <span>Avg Battery</span>
          </span>
          <span className="font-outfit font-bold text-xs text-rose-400 mt-0.5 block">
            {hasDataPoints ? `${avgBattery}%` : '—'}
          </span>
        </div>

        <div className="p-2 bg-slate-900/90 border border-slate-850 rounded-xl">
          <span className="text-slate-500 block flex items-center justify-center gap-1">
            <Brain className="w-2.5 h-2.5 text-indigo-400" />
            <span>Overthink Index</span>
          </span>
          <span className="font-outfit font-bold text-xs text-indigo-400 mt-0.5 block">
            {hasDataPoints ? `${avgOverthinking}/10` : '—'}
          </span>
        </div>

        <div className="p-2 bg-slate-900/90 border border-slate-850 rounded-xl">
          <span className="text-slate-500 block flex items-center justify-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>Dominant Vibe</span>
          </span>
          <span className="font-outfit font-bold text-xs text-amber-300 mt-0.5 block truncate">
            {hasDataPoints ? dominantMood : '—'}
          </span>
        </div>
      </div>

      {/* The Recharts Visual Area */}
      <div className="w-full min-h-[175px] pt-1">
        <ResponsiveContainer width="100%" height={175}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="overthinkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="dayName"
              stroke="#64748b"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={9}
              domain={[0, 100]}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as DayTrendPoint;
                  return (
                    <div className="p-2.5 bg-slate-900 border border-slate-750 rounded-xl shadow-xl text-[11px] space-y-1">
                      <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between gap-3">
                        <span>{data.displayDate} ({data.dayName})</span>
                        {data.checkInCount > 0 && (
                          <span className="text-[10px] text-purple-400">
                            {data.moodEmoji} {data.moodTitle}
                          </span>
                        )}
                      </div>
                      {data.battery !== null ? (
                        <div className="space-y-0.5 pt-0.5">
                          <div className="flex items-center justify-between gap-3 text-rose-300">
                            <span>Social Battery:</span>
                            <span className="font-bold font-mono">{data.battery}%</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-indigo-300">
                            <span>Overthinking Index:</span>
                            <span className="font-bold font-mono">{data.overthinking}/10</span>
                          </div>
                          <div className="text-[9px] text-slate-500 pt-0.5">
                            {data.checkInCount} check-in{data.checkInCount > 1 ? 's' : ''} recorded
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-500 text-[10px] italic py-0.5">
                          No check-ins on this day
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            {(metricView === 'both' || metricView === 'battery') && (
              <Area
                type="monotone"
                dataKey="battery"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#batteryGrad)"
                connectNulls
                dot={{ r: 3, fill: '#f43f5e', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 5, fill: '#f43f5e' }}
              />
            )}
            {(metricView === 'both' || metricView === 'overthinking') && (
              <Area
                type="monotone"
                // Scale overthinking from 1-10 to 10-100 for visual parity with battery
                dataKey={(d: DayTrendPoint) => (d.overthinking !== null ? d.overthinking * 10 : null)}
                stroke="#818cf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#overthinkGrad)"
                connectNulls
                dot={{ r: 3, fill: '#818cf8', strokeWidth: 1, stroke: '#ffffff' }}
                activeDot={{ r: 5, fill: '#818cf8' }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400 pt-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
          <span>Social Battery (0–100%)</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block"></span>
          <span>Overthinking Index (1–10)</span>
        </span>
      </div>
    </div>
  );
};
