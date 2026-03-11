import { useState } from 'react';
import { Dumbbell, Play, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import type { UserProfile, Level, PaceRange, MasteredMovement, HyroxExperience, HyroxGoal } from '../types';

interface Props {
  onStart: (profile: UserProfile) => void;
}

// ─── Questions Data ──────────────────────────────────────────────

interface SingleQuestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'single';
  options: { value: string; label: string; description: string }[];
}

interface MultiQuestion {
  id: string;
  title: string;
  subtitle: string;
  type: 'multi';
  options: { value: string; label: string }[];
}

type Question = SingleQuestion | MultiQuestion;

const QUESTIONS: Question[] = [
  {
    id: 'runLevel',
    title: 'Ton niveau en course à pied ?',
    subtitle: 'Fréquence et distance habituelle',
    type: 'single',
    options: [
      { value: '1', label: 'Débutant', description: 'Je cours < 2 fois/semaine, < 5km' },
      { value: '2', label: 'Intermédiaire', description: 'Je cours 2-3 fois/semaine, 5-10km confortable' },
      { value: '3', label: 'Avancé', description: 'Je cours 3+ fois/semaine, 10km+ facile, tempo < 5:00/km' },
    ],
  },
  {
    id: 'pace',
    title: 'Ton allure sur 5km ?',
    subtitle: 'Temps approximatif',
    type: 'single',
    options: [
      { value: '>30min', label: '> 30 min', description: 'Plus de 6:00/km' },
      { value: '25-30min', label: '25-30 min', description: '5:00 à 6:00/km' },
      { value: '20-25min', label: '20-25 min', description: '4:00 à 5:00/km' },
      { value: '<20min', label: '< 20 min', description: 'Moins de 4:00/km' },
    ],
  },
  {
    id: 'strengthLevel',
    title: 'Ton niveau en force / CrossFit ?',
    subtitle: 'Expérience en musculation et CrossFit',
    type: 'single',
    options: [
      { value: '1', label: 'Débutant', description: "Peu d'expérience en musculation / CrossFit" },
      { value: '2', label: 'Intermédiaire', description: 'Je maîtrise squat, deadlift, press. 1-2 ans de pratique' },
      { value: '3', label: 'Avancé', description: "2+ ans de CrossFit, à l'aise sur les mouvements olympiques" },
    ],
  },
  {
    id: 'masteredMovements',
    title: 'Quels mouvements maîtrises-tu ?',
    subtitle: 'Sélectionne tous ceux que tu fais régulièrement',
    type: 'multi',
    options: [
      { value: 'pull-ups', label: 'Pull-ups stricts' },
      { value: 'muscle-ups', label: 'Muscle-ups (ring ou bar)' },
      { value: 'double-unders', label: 'Double-unders' },
      { value: 'hspu', label: 'Handstand Push-ups' },
      { value: 'oly-lifting', label: 'Snatch / Clean & Jerk' },
      { value: 'toes-to-bar', label: 'Toes-to-bar' },
    ],
  },
  {
    id: 'hyroxExperience',
    title: 'Ton expérience Hyrox ?',
    subtitle: "Participation à des courses Hyrox",
    type: 'single',
    options: [
      { value: 'never', label: 'Découverte', description: "Jamais participé, je découvre" },
      { value: '1-2', label: '1-2 courses', description: "J'ai fait 1-2 courses Hyrox" },
      { value: 'regular', label: 'Compétiteur', description: 'Compétiteur régulier / objectif chrono' },
    ],
  },
  {
    id: 'goal',
    title: 'Ton objectif ?',
    subtitle: 'Ce que tu vises avec ce programme',
    type: 'single',
    options: [
      { value: 'finish', label: 'Finisher', description: 'Finir ma première course Hyrox' },
      { value: 'sub-90', label: 'Sub 1h30', description: 'Améliorer mon chrono (< 1h30)' },
      { value: 'podium', label: 'Performer', description: 'Objectif < 1h15 / podium' },
    ],
  },
];

// ─── Scoring ─────────────────────────────────────────────────────

function computeProfile(answers: Record<string, string | string[]>): UserProfile {
  const runLevel = Number(answers.runLevel) as Level;
  const pace = answers.pace as PaceRange;
  const strengthLevel = Number(answers.strengthLevel) as Level;
  const masteredMovements = (answers.masteredMovements || []) as MasteredMovement[];
  const hyroxExperience = answers.hyroxExperience as HyroxExperience;
  const goal = answers.goal as HyroxGoal;

  // Global level: weighted average
  const hyroxScore: Level =
    hyroxExperience === 'regular' ? 3 : hyroxExperience === '1-2' ? 2 : 1;
  const goalScore: Level =
    goal === 'podium' ? 3 : goal === 'sub-90' ? 2 : 1;

  const avg = (runLevel * 2 + strengthLevel * 2 + hyroxScore + goalScore) / 6;
  const globalLevel: Level = avg >= 2.5 ? 3 : avg >= 1.5 ? 2 : 1;

  return { runLevel, pace, strengthLevel, masteredMovements, hyroxExperience, goal, globalLevel };
}

// ─── Component ───────────────────────────────────────────────────

export default function WelcomeScreen({ onStart }: Props) {
  const [step, setStep] = useState(-1); // -1 = intro screen
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    masteredMovements: [],
  });

  const currentQuestion = step >= 0 ? QUESTIONS[step] : null;
  const totalSteps = QUESTIONS.length;

  const canNext = () => {
    if (!currentQuestion) return false;
    const val = answers[currentQuestion.id];
    if (currentQuestion.type === 'multi') return true; // multi can be empty
    return val !== undefined && val !== '';
  };

  const handleSingle = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleMulti = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const current = (prev[questionId] || []) as string[];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [questionId]: next };
    });
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Done — compute profile and start
      const profile = computeProfile(answers);
      onStart(profile);
    }
  };

  const handleBack = () => {
    setStep(Math.max(-1, step - 1));
  };

  // ─── Intro Screen ──────────────────────────────────────────────
  if (step === -1) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <Dumbbell className="w-16 h-16 text-brand-orange mx-auto" />
            <h1 className="text-4xl font-bold">
              <span className="text-brand-orange">Hyrox</span>
              <span className="text-white">Fit</span>{' '}
              <span className="text-gray-400 font-normal">Planner</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Programme d'entraînement 10 semaines<br />
              CrossFit + Hyrox + Course à pied
            </p>
          </div>

          <div className="space-y-3 text-sm text-gray-500">
            <div className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3">
              <div className="w-3 h-3 rounded-full bg-session-run" />
              <span>2-3 séances course / semaine</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3">
              <div className="w-3 h-3 rounded-full bg-session-crossfit" />
              <span>2 séances CrossFit (force + WOD)</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3">
              <div className="w-3 h-3 rounded-full bg-session-hyrox" />
              <span>1-2 séances Hyrox spécifiques</span>
            </div>
            <div className="flex items-center gap-3 bg-gray-900 rounded-lg px-4 py-3">
              <div className="w-3 h-3 rounded-full bg-session-recovery" />
              <span>Dimanche = repos complet</span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-600">
            <p>Base (S1-3) → Build (S4-6) → Peak (S7-9) → Deload (S10)</p>
          </div>

          <button
            onClick={() => setStep(0)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-orange hover:bg-orange-500 text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-orange-900/30"
          >
            <Play className="w-5 h-5" /> Commencer le questionnaire
          </button>
        </div>
      </div>
    );
  }

  // ─── Question Screen ───────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Question {step + 1}/{totalSteps}</span>
            <span>{Math.round(((step + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-orange rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{currentQuestion.title}</h2>
            <p className="text-gray-500 text-sm">{currentQuestion.subtitle}</p>
          </div>
        )}

        {/* Options */}
        {currentQuestion && currentQuestion.type === 'single' && (
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => {
              const selected = answers[currentQuestion.id] === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSingle(currentQuestion.id, opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    selected
                      ? 'border-brand-orange bg-orange-950/40 text-white'
                      : 'border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{opt.description}</div>
                    </div>
                    {selected && <Check className="w-5 h-5 text-brand-orange flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {currentQuestion && currentQuestion.type === 'multi' && (
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => {
              const selected = ((answers[currentQuestion.id] || []) as string[]).includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => handleMulti(currentQuestion.id, opt.value)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    selected
                      ? 'border-brand-orange bg-orange-950/40 text-white'
                      : 'border-gray-800 bg-gray-900 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{opt.label}</span>
                    {selected && <Check className="w-5 h-5 text-brand-orange flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
            <p className="text-xs text-gray-600 mt-1">Tu peux en sélectionner plusieurs (ou aucun)</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-orange hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
          >
            {step === totalSteps - 1 ? (
              <>
                <Play className="w-4 h-4" /> Générer mon plan
              </>
            ) : (
              <>
                Suivant <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
