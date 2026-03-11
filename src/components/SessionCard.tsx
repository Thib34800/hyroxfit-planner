import { Check, X, Clock, Flame, Route } from 'lucide-react';
import type { Session } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types';

interface Props {
  session: Session;
  compact?: boolean;
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
  onClick?: (session: Session) => void;
}

const intensityBars = (level: number) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className={`w-1.5 rounded-full ${
          i <= level ? 'bg-brand-orange' : 'bg-gray-700'
        }`}
        style={{ height: `${8 + i * 2}px` }}
      />
    ))}
  </div>
);

export default function SessionCard({ session, compact, onComplete, onSkip, onClick }: Props) {
  const statusBorder =
    session.status === 'done'
      ? 'border-green-600/50'
      : session.status === 'skipped'
        ? 'border-gray-600/50 opacity-60'
        : 'border-gray-700/50';

  if (compact) {
    return (
      <div
        onClick={() => onClick?.(session)}
        className={`px-2 py-1.5 rounded-md border ${statusBorder} cursor-pointer hover:bg-gray-800/50 transition-colors`}
      >
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[session.category]}`} />
          <span className="text-xs font-medium truncate">{session.name}</span>
          {session.status === 'done' && <Check className="w-3 h-3 text-green-500 ml-auto flex-shrink-0" />}
          {session.status === 'skipped' && <X className="w-3 h-3 text-gray-500 ml-auto flex-shrink-0" />}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-900 rounded-xl border ${statusBorder} p-4 transition-all hover:bg-gray-800/50`}
      onClick={() => onClick?.(session)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${CATEGORY_COLORS[session.category]}`}>
            {CATEGORY_LABELS[session.category]}
          </span>
          <span className="text-xs text-gray-500 capitalize">{session.subType.replace(/-/g, ' ')}</span>
        </div>
        {intensityBars(session.intensity)}
      </div>

      <h3 className="font-semibold text-white mb-2">{session.name}</h3>

      {(session.objective || session.workflow) && (
        <div className="mb-2 space-y-0.5">
          {session.objective && (
            <p className="text-sm text-gray-400 italic truncate">{session.objective}</p>
          )}
          {session.workflow && (
            <p className="text-xs text-gray-500 truncate">→ {session.workflow}</p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
        {session.duration > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {session.duration}min
          </span>
        )}
        {session.distance && (
          <span className="flex items-center gap-1">
            <Route className="w-3.5 h-3.5" /> {session.distance}km
          </span>
        )}
        <span className="flex items-center gap-1">
          <Flame className="w-3.5 h-3.5" /> Intensité {session.intensity}/5
        </span>
      </div>

      {session.exercises.length > 0 && (
        <ul className="text-xs text-gray-400 space-y-0.5 mb-3">
          {session.exercises.map((ex, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-gray-600 mt-0.5">-</span>
              <span>{ex}</span>
            </li>
          ))}
        </ul>
      )}

      {session.status === 'planned' && (onComplete || onSkip) && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
          {onComplete && (
            <button
              onClick={(e) => { e.stopPropagation(); onComplete(session.id); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 rounded-lg text-sm font-medium transition-colors"
            >
              <Check className="w-4 h-4" /> Fait
            </button>
          )}
          {onSkip && (
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(session.id); }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-700/30 text-gray-400 hover:bg-gray-700/50 rounded-lg text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4" /> Skip
            </button>
          )}
        </div>
      )}

      {session.status === 'done' && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-800 text-green-500 text-sm">
          <Check className="w-4 h-4" />
          <span>Complétée</span>
          {session.postNotes && (
            <span className="text-gray-500 ml-2 text-xs">— {session.postNotes}</span>
          )}
        </div>
      )}

      {session.status === 'skipped' && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-gray-800 text-gray-500 text-sm">
          <X className="w-4 h-4" />
          <span>Skippée</span>
        </div>
      )}
    </div>
  );
}
