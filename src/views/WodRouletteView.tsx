import { useState, useCallback } from 'react';
import { Shuffle, Dices, Flame, Clock, Dumbbell, Sparkles } from 'lucide-react';
import type { GeneratedWod, WodType, MovementCategory, WodTheme, Level } from '../types';
import { generateWod, WOD_TYPE_LABELS, CATEGORY_FILTER_LABELS, THEME_LABELS } from '../utils/wodGenerator';

interface Props {
  level: Level;
}

export default function WodRouletteView({ level }: Props) {
  const [wod, setWod] = useState<GeneratedWod | null>(null);
  const [typeFilter, setTypeFilter] = useState<WodType | 'random'>('random');
  const [categoryFilter, setCategoryFilter] = useState<MovementCategory | 'all'>('all');
  const [themeFilter, setThemeFilter] = useState<WodTheme>('random');
  const [isSpinning, setIsSpinning] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsSpinning(true);

    // Animate a "spin" effect
    let count = 0;
    const interval = setInterval(() => {
      setWod(
        generateWod(
          level,
          typeFilter === 'random' ? undefined : typeFilter,
          categoryFilter === 'all' ? undefined : categoryFilter,
          themeFilter,
        ),
      );
      count++;
      if (count >= 6) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  }, [level, typeFilter, categoryFilter, themeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Dices className="w-6 h-6 text-brand-orange" />
          WOD Roulette
        </h2>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
          Niveau {level === 1 ? 'Scaled' : level === 2 ? 'RX' : 'RX+'}
        </span>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 space-y-3">
        {/* Type Filter */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Type de WOD</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setTypeFilter('random')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                typeFilter === 'random'
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Shuffle className="w-3 h-3 inline mr-1" />
              Aléatoire
            </button>
            {(Object.keys(WOD_TYPE_LABELS) as WodType[]).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  typeFilter === type
                    ? 'bg-brand-orange text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {WOD_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Filter */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Thème
          </label>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(THEME_LABELS) as WodTheme[]).map((theme) => (
              <button
                key={theme}
                onClick={() => setThemeFilter(theme)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  themeFilter === theme
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {THEME_LABELS[theme]}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-1.5">
          <label className="text-xs text-gray-500 font-medium">Catégorie de mouvements</label>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CATEGORY_FILTER_LABELS) as (MovementCategory | 'all')[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {CATEGORY_FILTER_LABELS[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isSpinning}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
          isSpinning
            ? 'bg-orange-600 text-white animate-pulse'
            : 'bg-brand-orange hover:bg-orange-500 text-white shadow-lg shadow-orange-900/30'
        }`}
      >
        <Dices className={`w-6 h-6 ${isSpinning ? 'animate-spin' : ''}`} />
        {isSpinning ? 'Tirage en cours...' : wod ? 'Re-tirer un WOD' : 'Tirer un WOD !'}
      </button>

      {/* Result */}
      {wod && !isSpinning && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          {/* WOD Header */}
          <div className="bg-gradient-to-r from-orange-950/60 to-purple-950/40 px-5 py-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="px-3 py-1 rounded-full bg-brand-orange text-white text-sm font-bold">
                {wod.name}
              </span>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {wod.duration} min
                </span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white">
              {wod.funName ? `"${wod.funName}"` : wod.name} — {wod.duration} min
            </h3>
            {wod.funName && (
              <p className="text-xs text-gray-500 mt-1">{wod.name}</p>
            )}
          </div>

          {/* Movements List */}
          <div className="p-5 space-y-3">
            {wod.movements.map(({ movement, reps, load }, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-4 py-3"
              >
                <span className="text-brand-orange font-bold text-lg w-6 text-center">{idx + 1}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{movement.name}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {reps}
                    </span>
                    {load && (
                      <span className="flex items-center gap-1">
                        <Dumbbell className="w-3 h-3" /> {load}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-gray-700 text-gray-500 capitalize">
                      {movement.category === 'haltero' ? 'Haltéro' : movement.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="px-5 pb-5">
            <div className="bg-gray-800 rounded-lg p-4">
              <h4 className="text-xs font-semibold text-gray-500 mb-2">PRESCRIPTION</h4>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                {wod.description}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!wod && (
        <div className="text-center py-16">
          <Dices className="w-16 h-16 text-gray-800 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Tire un WOD au hasard !</p>
          <p className="text-gray-700 text-sm mt-1">
            Filtre par type, thème ou catégorie, puis lance la roulette
          </p>
        </div>
      )}
    </div>
  );
}
