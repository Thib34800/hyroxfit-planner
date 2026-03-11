import { useState, useMemo } from 'react';
import { Filter, Calendar, Clock, Route } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Session, SessionCategory, SessionStatus, Block } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS, BLOCK_LABELS, getBlockForWeek } from '../types';

interface Props {
  sessions: Session[];
  onClick?: (session: Session) => void;
}

type FilterCategory = 'all' | SessionCategory;
type FilterStatus = 'all' | SessionStatus;
type FilterBlock = 'all' | Block;

export default function HistoryView({ sessions, onClick }: Props) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('done');
  const [filterBlock, setFilterBlock] = useState<FilterBlock>('all');
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');

  const filtered = useMemo(() => {
    return sessions
      .filter((s) => filterCategory === 'all' || s.category === filterCategory)
      .filter((s) => filterStatus === 'all' || s.status === filterStatus)
      .filter((s) => filterBlock === 'all' || getBlockForWeek(s.week) === filterBlock)
      .filter((s) => filterWeek === 'all' || s.week === filterWeek)
      .sort((a, b) => {
        if (a.completedAt && b.completedAt) {
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        }
        return b.week - a.week || b.day - a.day;
      });
  }, [sessions, filterCategory, filterStatus, filterBlock, filterWeek]);

  const totalDuration = filtered.filter(s => s.status === 'done').reduce((sum, s) => sum + s.duration, 0);
  const totalDistance = filtered.filter(s => s.status === 'done' && s.distance).reduce((sum, s) => sum + (s.distance || 0), 0);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Historique</h2>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-500">
          <Filter className="w-4 h-4" /> Filtres
        </div>
        <div className="flex flex-wrap gap-2">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-brand-orange"
          >
            <option value="all">Tous types</option>
            <option value="run">Course</option>
            <option value="crossfit">CrossFit</option>
            <option value="hyrox">Hyrox</option>
            <option value="recovery">Récupération</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-brand-orange"
          >
            <option value="all">Tous statuts</option>
            <option value="done">Complétées</option>
            <option value="planned">Planifiées</option>
            <option value="skipped">Skippées</option>
          </select>

          {/* Block Filter */}
          <select
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value as FilterBlock)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-brand-orange"
          >
            <option value="all">Tous blocs</option>
            <option value="base">Base (S1-3)</option>
            <option value="build">Build (S4-6)</option>
            <option value="peak">Peak (S7-9)</option>
            <option value="deload">Deload (S10)</option>
          </select>

          {/* Week Filter */}
          <select
            value={filterWeek}
            onChange={(e) => setFilterWeek(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-brand-orange"
          >
            <option value="all">Toutes semaines</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Semaine {i + 1}</option>
            ))}
          </select>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 mt-3 pt-3 border-t border-gray-800 text-xs text-gray-500">
          <span>{filtered.length} séance{filtered.length !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {totalDuration}min</span>
          {totalDistance > 0 && (
            <span className="flex items-center gap-1"><Route className="w-3 h-3" /> {totalDistance.toFixed(1)}km</span>
          )}
        </div>
      </div>

      {/* Session List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map((session) => (
            <div
              key={session.id}
              onClick={() => onClick?.(session)}
              className={`bg-gray-900 rounded-lg border border-gray-800 px-4 py-3 flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 transition-colors ${
                session.status === 'skipped' ? 'opacity-50' : ''
              }`}
            >
              <div className={`w-2 h-8 rounded-full ${CATEGORY_COLORS[session.category]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{session.name}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    session.status === 'done'
                      ? 'bg-green-900/30 text-green-400'
                      : session.status === 'skipped'
                        ? 'bg-gray-800 text-gray-500'
                        : 'bg-blue-900/30 text-blue-400'
                  }`}>
                    {session.status === 'done' ? 'Faite' : session.status === 'skipped' ? 'Skippée' : 'Planifiée'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span>S{session.week}</span>
                  <span>{CATEGORY_LABELS[session.category]}</span>
                  {session.duration > 0 && <span>{session.duration}min</span>}
                  {session.distance && <span>{session.distance}km</span>}
                  {session.completedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(session.completedAt), 'dd MMM', { locale: fr })}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full ${i <= session.intensity ? 'bg-brand-orange' : 'bg-gray-700'}`}
                    style={{ height: `${6 + i * 1.5}px` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-600">
          <p>Aucune séance trouvée avec ces filtres</p>
        </div>
      )}
    </div>
  );
}
