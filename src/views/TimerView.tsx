import { useState, useCallback, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import type { TimerMode } from '../types';

// ─── Sound Utils ─────────────────────────────────────────────────

function beep(freq = 800, duration = 200, volume = 0.3) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.start();
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    // AudioContext not available
  }
}

function beepCountdown() {
  beep(600, 150, 0.2);
}

function beepGo() {
  beep(1000, 400, 0.4);
}

function beepEnd() {
  beep(500, 600, 0.5);
  setTimeout(() => beep(700, 600, 0.5), 700);
  setTimeout(() => beep(1000, 800, 0.5), 1400);
}

function vibrate(ms = 200) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

// ─── Timer Modes Config ──────────────────────────────────────────

const MODES: { mode: TimerMode; label: string; description: string }[] = [
  { mode: 'amrap', label: 'AMRAP', description: 'Compte à rebours — max de rounds dans le temps' },
  { mode: 'emom', label: 'EMOM', description: 'Every Minute On the Minute — bip chaque minute' },
  { mode: 'fortime', label: 'For Time', description: 'Chronomètre montant — enregistre ton temps' },
  { mode: 'tabata', label: 'Tabata', description: '20s travail / 10s repos × rounds' },
];

// ─── Format Helpers ──────────────────────────────────────────────

function formatTime(seconds: number): string {
  const m = Math.floor(Math.abs(seconds) / 60);
  const s = Math.abs(seconds) % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Component ───────────────────────────────────────────────────

export default function TimerView() {
  const [mode, setMode] = useState<TimerMode>('amrap');
  const [duration, setDuration] = useState(12); // minutes
  const [rounds, setRounds] = useState(8); // for tabata/emom
  const [workTime, setWorkTime] = useState(20); // seconds tabata work
  const [restTime, setRestTime] = useState(10); // seconds tabata rest
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // seconds elapsed
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(true); // tabata: work or rest phase
  const [finished, setFinished] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastBeepRef = useRef(0);

  const totalSeconds = (() => {
    if (mode === 'amrap' || mode === 'emom') return duration * 60;
    if (mode === 'tabata') return rounds * (workTime + restTime);
    return 0; // fortime has no cap
  })();

  // ── EMOM minute tracking ──
  const emomMinute = Math.floor(elapsed / 60) + 1;

  // ── Tabata phase tracking ──
  const tabataCycleLength = workTime + restTime;
  const tabataElapsedInCycle = elapsed % tabataCycleLength;
  const tabataCurrentRound = Math.floor(elapsed / tabataCycleLength) + 1;
  const tabataIsWork = tabataElapsedInCycle < workTime;
  const tabataPhaseRemaining = tabataIsWork
    ? workTime - tabataElapsedInCycle
    : tabataCycleLength - tabataElapsedInCycle;

  // ── Countdown display (AMRAP/EMOM) ──
  const remaining = totalSeconds - elapsed;

  // ── Tick logic ──
  const tick = useCallback(() => {
    setElapsed((prev) => {
      const next = prev + 1;

      // AMRAP / EMOM: countdown
      if (mode === 'amrap' || mode === 'emom') {
        const rem = totalSeconds - next;
        if (rem <= 3 && rem > 0 && soundEnabled && lastBeepRef.current !== rem) {
          beepCountdown();
          lastBeepRef.current = rem;
        }
        if (rem <= 0) {
          if (soundEnabled) { beepEnd(); vibrate(500); }
          setFinished(true);
          setRunning(false);
          return next;
        }
        // EMOM: beep each minute
        if (mode === 'emom' && next % 60 === 0 && next < totalSeconds && soundEnabled) {
          beepGo();
          vibrate(200);
        }
      }

      // Tabata
      if (mode === 'tabata') {
        const cycle = workTime + restTime;
        const elInCycle = next % cycle;
        const round = Math.floor(next / cycle) + 1;

        // Transition beeps
        if (elInCycle === 0 && next > 0 && soundEnabled) {
          beepGo(); // start of work
          vibrate(200);
        }
        if (elInCycle === workTime && soundEnabled) {
          beep(400, 300, 0.3); // start of rest
          vibrate(100);
        }

        // Countdown beeps (last 3s of each phase)
        const inWork = elInCycle < workTime;
        const phaseRem = inWork ? workTime - elInCycle : cycle - elInCycle;
        if (phaseRem <= 3 && phaseRem > 0 && soundEnabled && lastBeepRef.current !== next) {
          beepCountdown();
          lastBeepRef.current = next;
        }

        setCurrentRound(round);
        setIsWork(inWork);

        if (round > rounds) {
          if (soundEnabled) { beepEnd(); vibrate(500); }
          setFinished(true);
          setRunning(false);
          return next;
        }
      }

      return next;
    });
  }, [mode, totalSeconds, rounds, workTime, restTime, soundEnabled]);

  // ── Start / Stop ──
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, tick]);

  const handleStart = () => {
    if (finished) handleReset();
    if (soundEnabled && elapsed === 0) beepGo();
    setRunning(true);
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    setCurrentRound(1);
    setIsWork(true);
    setFinished(false);
    lastBeepRef.current = 0;
  };

  // ── Display value ──
  const displayTime = (() => {
    if (mode === 'fortime') return formatTime(elapsed);
    if (mode === 'amrap' || mode === 'emom') return formatTime(Math.max(0, remaining));
    if (mode === 'tabata') return formatTime(tabataPhaseRemaining);
    return formatTime(0);
  })();

  const progressPercent = (() => {
    if (mode === 'fortime') return 0;
    if (totalSeconds === 0) return 0;
    return Math.min(100, (elapsed / totalSeconds) * 100);
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Timer className="w-6 h-6 text-brand-orange" />
          Minuteur
        </h2>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          {soundEnabled ? (
            <Volume2 className="w-5 h-5 text-brand-orange" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Mode Selector */}
      <div className="grid grid-cols-4 gap-2">
        {MODES.map(({ mode: m, label }) => (
          <button
            key={m}
            onClick={() => { if (!running) { setMode(m); handleReset(); } }}
            className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === m
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-900/30'
                : 'bg-gray-900 border border-gray-800 text-gray-400 hover:border-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mode Description */}
      <p className="text-xs text-gray-500 text-center">
        {MODES.find(m => m.mode === mode)?.description}
      </p>

      {/* Settings */}
      {!running && !finished && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
          <div className="flex flex-wrap gap-6 justify-center">
            {/* Duration (AMRAP, EMOM) */}
            {(mode === 'amrap' || mode === 'emom') && (
              <div className="text-center">
                <label className="text-xs text-gray-500 block mb-2">Durée (min)</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-2xl font-mono font-bold text-white w-12 text-center">{duration}</span>
                  <button
                    onClick={() => setDuration(Math.min(60, duration + 1))}
                    className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Rounds (Tabata) */}
            {mode === 'tabata' && (
              <>
                <div className="text-center">
                  <label className="text-xs text-gray-500 block mb-2">Rounds</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRounds(Math.max(1, rounds - 1))}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-mono font-bold text-white w-12 text-center">{rounds}</span>
                    <button
                      onClick={() => setRounds(Math.min(20, rounds + 1))}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <label className="text-xs text-gray-500 block mb-2">Travail (s)</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setWorkTime(Math.max(5, workTime - 5))}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-mono font-bold text-white w-12 text-center">{workTime}</span>
                    <button
                      onClick={() => setWorkTime(Math.min(120, workTime + 5))}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <label className="text-xs text-gray-500 block mb-2">Repos (s)</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRestTime(Math.max(5, restTime - 5))}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <span className="text-2xl font-mono font-bold text-white w-12 text-center">{restTime}</span>
                    <button
                      onClick={() => setRestTime(Math.min(120, restTime + 5))}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="relative bg-gray-900 rounded-2xl border border-gray-800 p-8 text-center overflow-hidden">
        {/* Progress bar background */}
        {progressPercent > 0 && (
          <div
            className="absolute inset-0 bg-brand-orange/10 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        )}

        <div className="relative z-10">
          {/* Phase indicator (tabata) */}
          {mode === 'tabata' && (running || finished) && (
            <div className={`text-lg font-bold mb-2 ${tabataIsWork ? 'text-red-400' : 'text-green-400'}`}>
              {tabataIsWork ? 'TRAVAIL' : 'REPOS'}
            </div>
          )}

          {/* Round indicator (tabata/emom) */}
          {(mode === 'tabata' || mode === 'emom') && (running || elapsed > 0) && (
            <div className="text-sm text-gray-500 mb-2">
              {mode === 'tabata'
                ? `Round ${Math.min(tabataCurrentRound, rounds)} / ${rounds}`
                : `Minute ${emomMinute} / ${duration}`}
            </div>
          )}

          {/* Time Display */}
          <div
            className={`font-mono font-bold transition-all ${
              finished
                ? 'text-green-400 text-7xl'
                : mode === 'tabata' && !tabataIsWork
                  ? 'text-green-400 text-7xl'
                  : 'text-white text-7xl'
            }`}
          >
            {displayTime}
          </div>

          {/* Finished message */}
          {finished && (
            <div className="mt-4 text-brand-orange font-bold text-lg animate-bounce">
              Terminé !
            </div>
          )}

          {/* For Time: elapsed display */}
          {mode === 'fortime' && elapsed > 0 && !running && !finished && (
            <div className="mt-2 text-sm text-gray-500">
              En pause
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        {!running ? (
          <button
            onClick={handleStart}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg transition-colors"
          >
            <Play className="w-6 h-6" />
            {elapsed > 0 && !finished ? 'Reprendre' : 'Démarrer'}
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 py-4 bg-yellow-600 hover:bg-yellow-500 text-white rounded-xl font-bold text-lg transition-colors"
          >
            <Pause className="w-6 h-6" />
            Pause
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold text-lg transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      {/* Quick presets */}
      {!running && !finished && (mode === 'amrap' || mode === 'emom') && (
        <div className="flex justify-center gap-2">
          {[8, 10, 12, 15, 20].map((min) => (
            <button
              key={min}
              onClick={() => setDuration(min)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                duration === min
                  ? 'bg-brand-orange text-white'
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              }`}
            >
              {min} min
            </button>
          ))}
        </div>
      )}

      {!running && !finished && mode === 'tabata' && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => { setWorkTime(20); setRestTime(10); setRounds(8); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-500 hover:bg-gray-700"
          >
            Classique 20/10 ×8
          </button>
          <button
            onClick={() => { setWorkTime(30); setRestTime(15); setRounds(8); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-500 hover:bg-gray-700"
          >
            Long 30/15 ×8
          </button>
          <button
            onClick={() => { setWorkTime(40); setRestTime(20); setRounds(6); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-500 hover:bg-gray-700"
          >
            Endurance 40/20 ×6
          </button>
        </div>
      )}
    </div>
  );
}
