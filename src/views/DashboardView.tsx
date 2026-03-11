import { Trophy, Route, Flame, Calendar, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Session } from '../types';
import { BLOCK_LABELS } from '../types';
import { useStats } from '../hooks/useStats';

interface Props {
  sessions: Session[];
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: typeof Trophy;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color || 'text-gray-500'}`} />
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function DashboardView({ sessions }: Props) {
  const {
    completionPercent,
    totalKm,
    streak,
    categoryBreakdown,
    weeklyLoad,
    weekRunCheck,
    blockStats,
  } = useStats(sessions);

  const completedCount = sessions.filter((s) => s.status === 'done').length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={TrendingUp}
          label="Progression"
          value={`${completionPercent}%`}
          sub={`${completedCount} séances complétées`}
          color="text-brand-orange"
        />
        <StatCard
          icon={Route}
          label="Distance totale"
          value={`${totalKm.toFixed(1)} km`}
          sub="Course cumulée"
          color="text-session-run"
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={`${streak} j`}
          sub="Jours consécutifs"
          color="text-red-500"
        />
        <StatCard
          icon={Calendar}
          label="Courses / sem."
          value={`${weekRunCheck.filter((w) => w.achieved).length}/10`}
          sub="Semaines validées"
          color="text-blue-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pie Chart */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Répartition des séances</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {categoryBreakdown.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart - Weekly Load */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">Charge hebdomadaire</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyLoad}>
                <XAxis dataKey="week" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                />
                <Bar dataKey="done" fill="#F97316" radius={[4, 4, 0, 0]} name="Faites" />
                <Bar dataKey="planned" fill="#374151" radius={[4, 4, 0, 0]} name="Planifiées" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Block Progress */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">Progression par bloc</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {blockStats.map(({ block, done, total, percent }) => (
            <div key={block} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{BLOCK_LABELS[block]}</div>
              <div className="relative w-16 h-16 mx-auto">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#1F2937" strokeWidth="3" />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeDasharray={`${percent * 0.942} 94.2`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                  {percent}%
                </span>
              </div>
              <div className="text-xs text-gray-600 mt-1">{done}/{total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Run Badges */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-blue-400" /> Badge "Course atteinte"
        </h3>
        <div className="flex flex-wrap gap-2">
          {weekRunCheck.map(({ week, runs, achieved }) => (
            <div
              key={week}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                achieved
                  ? 'bg-blue-900/30 border-blue-700 text-blue-300'
                  : 'bg-gray-800 border-gray-700 text-gray-500'
              }`}
            >
              S{week}: {runs} run{runs !== 1 ? 's' : ''}
              {achieved && ' ✓'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
