import { useState } from 'react';
import { X, Check, Clock, Flame, Route, Play, Pause, RotateCcw, Dumbbell, Wind } from 'lucide-react';
import type { Session } from '../types';
import { CATEGORY_COLORS, CATEGORY_LABELS, DAY_NAMES_FULL } from '../types';

interface Props {
  session: Session;
  onClose: () => void;
  onComplete: (id: string, postNotes?: string) => void;
  onSkip: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Session>) => void;
}

function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  const toggle = () => {
    if (running && intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    } else {
      const id = setInterval(() => setSeconds((s) => s + 1), 1000);
      setIntervalId(id);
    }
    setRunning(!running);
  };

  const reset = () => {
    if (intervalId) clearInterval(intervalId);
    setIntervalId(null);
    setRunning(false);
    setSeconds(0);
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 bg-gray-800 rounded-lg px-4 py-3">
      <span className="font-mono text-2xl text-brand-orange font-bold">{fmt(seconds)}</span>
      <button onClick={toggle} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
        {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      <button onClick={reset} className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function SessionModal({ session, onClose, onComplete, onSkip, onUpdate }: Props) {
  const [postNotes, setPostNotes] = useState(session.postNotes || '');
  const [notes, setNotes] = useState(session.notes);

  const handleComplete = () => {
    onComplete(session.id, postNotes);
    onClose();
  };

  const handleSkip = () => {
    onSkip(session.id);
    onClose();
  };

  const handleNotesBlur = () => {
    if (notes !== session.notes) {
      onUpdate(session.id, { notes });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold text-white ${CATEGORY_COLORS[session.category]}`}>
                {CATEGORY_LABELS[session.category]}
              </span>
              <span className="text-xs text-gray-500">
                Semaine {session.week} — {DAY_NAMES_FULL[session.day]}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white">{session.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Meta */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
            {session.duration > 0 && (
              <span className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5">
                <Clock className="w-4 h-4" /> {session.duration}min
              </span>
            )}
            {session.distance && (
              <span className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5">
                <Route className="w-4 h-4" /> {session.distance}km
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5">
              <Flame className="w-4 h-4" /> {session.intensity}/5
            </span>
          </div>

          {/* Objective & Workflow */}
          {session.objective && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
              <p className="text-sm text-gray-300 flex items-start gap-2">
                <span className="shrink-0">🎯</span>
                <span>{session.objective}</span>
              </p>
              {session.workflow && (
                <p className="text-xs text-gray-500 mt-1.5 flex items-start gap-2">
                  <span className="shrink-0">→</span>
                  <span>{session.workflow}</span>
                </p>
              )}
            </div>
          )}
          {!session.objective && session.workflow && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500 flex items-start gap-2">
                <span className="shrink-0">→</span>
                <span>{session.workflow}</span>
              </p>
            </div>
          )}

          {/* Sections (structured) or flat Exercises (retro-compat) */}
          {session.sections && session.sections.length > 0 ? (
            <div className="space-y-3">
              {session.sections.map((section, idx) => {
                const config = {
                  warmup: {
                    icon: <Flame className="w-4 h-4 text-amber-500" />,
                    label: 'Échauffement',
                    textColor: 'text-amber-500',
                    bg: 'bg-amber-950/30 border-amber-800/40',
                  },
                  main: {
                    icon: <Dumbbell className="w-4 h-4 text-blue-400" />,
                    label: 'Corps de séance',
                    textColor: 'text-blue-400',
                    bg: 'bg-blue-950/30 border-blue-800/40',
                  },
                  cooldown: {
                    icon: <Wind className="w-4 h-4 text-emerald-400" />,
                    label: 'Retour au calme',
                    textColor: 'text-emerald-400',
                    bg: 'bg-emerald-950/30 border-emerald-800/40',
                  },
                }[section.type];

                return (
                  <div key={idx} className={`rounded-lg border p-3 ${config.bg}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {config.icon}
                      <h3 className={`text-sm font-semibold ${config.textColor}`}>
                        {section.title || config.label}
                      </h3>
                    </div>
                    <ul className="space-y-1 ml-6">
                      {section.items.map((item, i) => (
                        <li key={i} className="text-sm text-gray-400 list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            session.exercises.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Exercices</h3>
                <ul className="space-y-1.5">
                  {session.exercises.map((ex, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-brand-orange mt-0.5 font-bold">{i + 1}.</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}

          {/* Timer */}
          {session.status === 'planned' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Timer</h3>
              <Timer />
            </div>
          )}

          {/* Notes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Ajouter des notes..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-orange resize-none"
              rows={2}
            />
          </div>

          {/* Post-session notes */}
          {session.status === 'planned' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Commentaire post-séance</h3>
              <textarea
                value={postNotes}
                onChange={(e) => setPostNotes(e.target.value)}
                placeholder="Comment s'est passée la séance ?"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-orange resize-none"
                rows={2}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        {session.status === 'planned' && (
          <div className="p-4 border-t border-gray-800 flex gap-3">
            <button
              onClick={handleComplete}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium transition-colors"
            >
              <Check className="w-4 h-4" /> Marquer comme faite
            </button>
            <button
              onClick={handleSkip}
              className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
            >
              Skip
            </button>
          </div>
        )}

        {session.status === 'done' && session.postNotes && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-sm text-gray-400">
              <span className="text-green-500 font-medium">Commentaire :</span> {session.postNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
