// ─── Session Types ───────────────────────────────────────────────
export type SessionCategory = 'run' | 'crossfit' | 'hyrox' | 'recovery';

export type RunType = 'endurance' | 'intervals' | 'tempo' | 'hyrox-run';
export type CrossFitType = 'wod' | 'strength' | 'skill';
export type HyroxType = 'station' | 'simulation-partial' | 'full-simulation';
export type RecoveryType = 'mobility' | 'rest';

export type SessionSubType = RunType | CrossFitType | HyroxType | RecoveryType;

export type SessionStatus = 'planned' | 'done' | 'skipped';

export type Intensity = 1 | 2 | 3 | 4 | 5;

export type SectionType = 'warmup' | 'main' | 'cooldown';

export interface SessionSection {
  title: string; // "Échauffement", "Corps de séance", "Retour au calme"
  type: SectionType;
  items: string[];
}

export interface Session {
  id: string;
  week: number; // 1-10
  day: number; // 0=Mon, 1=Tue, ..., 6=Sun
  category: SessionCategory;
  subType: SessionSubType;
  name: string;
  duration: number; // minutes
  intensity: Intensity;
  distance?: number; // km, for runs
  exercises: string[]; // flat list (retro-compat)
  sections?: SessionSection[]; // structured warmup/main/cooldown
  objective?: string; // 1-line goal for the session
  workflow?: string; // short summary e.g. "10' échauf → 12×400m → 10' retour calme"
  status: SessionStatus;
  notes: string;
  completedAt?: string; // ISO date
  postNotes?: string; // post-session comment
  isDouble?: boolean; // true if this is a 2nd session of the day
}

// ─── Plan Structure ──────────────────────────────────────────────
export type Block = 'base' | 'build' | 'peak' | 'deload';

export interface WeekPlan {
  week: number;
  block: Block;
  sessions: Session[];
}

export type Plan = WeekPlan[];

// ─── User Profile & Questionnaire ───────────────────────────────
export type Level = 1 | 2 | 3; // 1=débutant, 2=intermédiaire, 3=avancé

export type PaceRange = '>30min' | '25-30min' | '20-25min' | '<20min';

export type MasteredMovement =
  | 'pull-ups'
  | 'muscle-ups'
  | 'double-unders'
  | 'hspu'
  | 'oly-lifting'
  | 'toes-to-bar';

export type HyroxExperience = 'never' | '1-2' | 'regular';

export type HyroxGoal = 'finish' | 'sub-90' | 'podium';

export interface UserProfile {
  runLevel: Level;
  pace: PaceRange;
  strengthLevel: Level;
  masteredMovements: MasteredMovement[];
  hyroxExperience: HyroxExperience;
  goal: HyroxGoal;
  globalLevel: Level;
}

// ─── WOD Roulette ────────────────────────────────────────────────
export type WodType = 'amrap' | 'fortime' | 'emom' | 'chipper' | 'couplet' | 'triplet' | 'deathby' | 'tabata' | 'buyin' | 'ladder';

export type WodTheme = 'random' | 'heavy' | 'gymnastics' | 'cardio' | 'hyrox-prep' | 'full-send' | 'kb-only';

export type MovementCategory = 'gym' | 'haltero' | 'cardio' | 'kettlebell';

export interface WodMovement {
  name: string;
  category: MovementCategory;
  scaledReps: string;
  rxReps: string;
  rxPlusReps?: string;
  scaledLoad?: string;
  rxLoad?: string;
  rxPlusLoad?: string;
  tags: string[];
}

export interface GeneratedWod {
  type: WodType;
  name: string;
  funName?: string;
  duration: number; // minutes
  movements: { movement: WodMovement; reps: string; load?: string }[];
  description: string;
}

// ─── Timer ───────────────────────────────────────────────────────
export type TimerMode = 'amrap' | 'emom' | 'fortime' | 'tabata';

export interface TimerConfig {
  mode: TimerMode;
  duration: number; // seconds
  rounds?: number;
  workTime?: number; // seconds (tabata)
  restTime?: number; // seconds (tabata)
}

// ─── Navigation ──────────────────────────────────────────────────
export type View = 'plan' | 'today' | 'dashboard' | 'history' | 'wod' | 'timer';

// ─── Helpers ─────────────────────────────────────────────────────
export const DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'] as const;
export const DAY_NAMES_FULL = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;

export const BLOCK_LABELS: Record<Block, string> = {
  base: 'Base',
  build: 'Build',
  peak: 'Peak',
  deload: 'Deload',
};

export const BLOCK_COLORS: Record<Block, string> = {
  base: 'bg-blue-900/40 border-blue-700',
  build: 'bg-orange-900/40 border-orange-700',
  peak: 'bg-red-900/40 border-red-700',
  deload: 'bg-green-900/40 border-green-700',
};

export const CATEGORY_COLORS: Record<SessionCategory, string> = {
  run: 'bg-session-run',
  crossfit: 'bg-session-crossfit',
  hyrox: 'bg-session-hyrox',
  recovery: 'bg-session-recovery',
};

export const CATEGORY_LABELS: Record<SessionCategory, string> = {
  run: 'Course',
  crossfit: 'CrossFit',
  hyrox: 'Hyrox',
  recovery: 'Récupération',
};

export function getBlockForWeek(week: number): Block {
  if (week <= 3) return 'base';
  if (week <= 6) return 'build';
  if (week <= 9) return 'peak';
  return 'deload';
}
