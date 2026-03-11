import { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, RefreshCw } from 'lucide-react';
import type { Plan, Session } from '../types';
import { DAY_NAMES, BLOCK_LABELS, BLOCK_COLORS } from '../types';
import SessionCard from '../components/SessionCard';
import SessionModal from '../components/SessionModal';

interface Props {
  plan: Plan;
  onComplete: (id: string, postNotes?: string) => void;
  onSkip: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Session>) => void;
  onReset: () => void;
}

export default function PlanView({ plan, onComplete, onSkip, onUpdate, onReset }: Props) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Plan 10 semaines</h2>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-orange transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Régénérer
        </button>
      </div>

      {plan.map((weekPlan) => {
        const isExpanded = expandedWeek === weekPlan.week;
        const done = weekPlan.sessions.filter((s) => s.status === 'done').length;
        const total = weekPlan.sessions.length;
        const runsCompleted = weekPlan.sessions.filter(
          (s) => s.category === 'run' && s.status === 'done',
        ).length;
        const runTarget = weekPlan.sessions.filter((s) => s.category === 'run').length;
        const runAchieved = runsCompleted >= Math.min(2, runTarget);

        return (
          <div key={weekPlan.week} className={`rounded-xl border ${BLOCK_COLORS[weekPlan.block]} overflow-hidden`}>
            {/* Week Header */}
            <button
              onClick={() => toggleWeek(weekPlan.week)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">S{weekPlan.week}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-300 font-medium">
                  {BLOCK_LABELS[weekPlan.block]}
                </span>
                <span className="text-xs text-gray-500">
                  {done}/{total} séances
                </span>
                {runAchieved && (
                  <span className="flex items-center gap-1 text-xs text-blue-400">
                    <Trophy className="w-3.5 h-3.5" /> Course {runsCompleted}/{runTarget}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-orange rounded-full transition-all"
                    style={{ width: `${total > 0 ? (done / total) * 100 : 0}%` }}
                  />
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </button>

            {/* Week Grid */}
            {isExpanded && (
              <div className="px-4 pb-4">
                <div className="grid grid-cols-7 gap-2">
                  {DAY_NAMES.map((day, dayIdx) => {
                    const daySessions = weekPlan.sessions.filter((s) => s.day === dayIdx);
                    return (
                      <div key={dayIdx} className="min-h-[80px]">
                        <div className="text-xs font-semibold text-gray-500 mb-1.5 text-center">
                          {day}
                        </div>
                        <div className="space-y-1">
                          {daySessions.length > 0 ? (
                            daySessions.map((session) => (
                              <SessionCard
                                key={session.id}
                                session={session}
                                compact
                                onClick={setSelectedSession}
                              />
                            ))
                          ) : (
                            <div className="text-xs text-gray-700 text-center py-2">—</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onComplete={(id, notes) => {
            onComplete(id, notes);
            setSelectedSession(null);
          }}
          onSkip={(id) => {
            onSkip(id);
            setSelectedSession(null);
          }}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
