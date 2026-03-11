import { useState, useMemo } from 'react';
import { CalendarDays, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Plan, Session } from '../types';
import { DAY_NAMES_FULL, BLOCK_LABELS } from '../types';
import SessionCard from '../components/SessionCard';
import SessionModal from '../components/SessionModal';

interface Props {
  plan: Plan;
  onComplete: (id: string, postNotes?: string) => void;
  onSkip: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Session>) => void;
}

export default function TodayView({ plan, onComplete, onSkip, onUpdate }: Props) {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const weekPlan = useMemo(() => plan.find((w) => w.week === selectedWeek), [plan, selectedWeek]);

  const todaySessions = useMemo(
    () => weekPlan?.sessions.filter((s) => s.day === selectedDay) || [],
    [weekPlan, selectedDay],
  );

  const allWeekSessions = useMemo(
    () => weekPlan?.sessions || [],
    [weekPlan],
  );

  const weekDone = allWeekSessions.filter((s) => s.status === 'done').length;
  const weekTotal = allWeekSessions.length;

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedWeek(Math.max(1, selectedWeek - 1))}
          disabled={selectedWeek === 1}
          className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h2 className="text-xl font-bold">Semaine {selectedWeek}</h2>
          <span className="text-sm text-gray-500">
            {weekPlan ? BLOCK_LABELS[weekPlan.block] : ''} — {weekDone}/{weekTotal} séances
          </span>
        </div>
        <button
          onClick={() => setSelectedWeek(Math.min(10, selectedWeek + 1))}
          disabled={selectedWeek === 10}
          className="p-2 rounded-lg hover:bg-gray-800 disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day Selector */}
      <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
        {DAY_NAMES_FULL.map((dayName, idx) => {
          const hasSessions = allWeekSessions.some((s) => s.day === idx);
          const allDone = allWeekSessions
            .filter((s) => s.day === idx)
            .every((s) => s.status === 'done');

          return (
            <button
              key={idx}
              onClick={() => setSelectedDay(idx)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors relative ${
                selectedDay === idx
                  ? 'bg-brand-orange text-white'
                  : hasSessions
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-800'
              }`}
            >
              {dayName.slice(0, 3)}
              {hasSessions && allDone && selectedDay !== idx && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Day Header */}
      <div className="flex items-center gap-2 text-gray-400">
        <CalendarDays className="w-4 h-4" />
        <span className="text-sm">{DAY_NAMES_FULL[selectedDay]}</span>
      </div>

      {/* Sessions */}
      {todaySessions.length > 0 ? (
        <div className="space-y-3">
          {todaySessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onComplete={(id) => onComplete(id)}
              onSkip={onSkip}
              onClick={setSelectedSession}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Sun className="w-12 h-12 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500">Pas de séance programmée ce jour</p>
          <p className="text-gray-700 text-sm mt-1">Profitez pour vous reposer !</p>
        </div>
      )}

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
