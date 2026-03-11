import type { WodType, WodMovement, GeneratedWod, Level, MovementCategory, WodTheme } from '../types';

// ─── Movement Bank (~55-60 movements) ──────────────────────────────

const MOVEMENTS: WodMovement[] = [
  // ── Gym ──
  { name: 'Air Squats', category: 'gym', scaledReps: '15', rxReps: '20', rxPlusReps: '25', tags: ['squat'] },
  { name: 'Push-ups', category: 'gym', scaledReps: '10', rxReps: '15', rxPlusReps: '20', tags: ['push'] },
  { name: 'Pull-ups', category: 'gym', scaledReps: '5 (bande)', rxReps: '10', rxPlusReps: '15 (strict)', tags: ['pull', 'gymnastics'] },
  { name: 'Burpees', category: 'gym', scaledReps: '8', rxReps: '12', rxPlusReps: '15', tags: ['push', 'squat', 'monostructural'] },
  { name: 'Box Jumps', category: 'gym', scaledReps: '10 (50cm)', rxReps: '12 (60cm)', rxPlusReps: '15 (60cm)', tags: ['squat'] },
  { name: 'Sit-ups', category: 'gym', scaledReps: '15', rxReps: '20', rxPlusReps: '25 (GHD)', tags: ['core'] },
  { name: 'Toes-to-bar', category: 'gym', scaledReps: '8 (knee raises)', rxReps: '12', rxPlusReps: '15', tags: ['pull', 'core', 'gymnastics'] },
  { name: 'Handstand Push-ups', category: 'gym', scaledReps: '5 (pike)', rxReps: '8', rxPlusReps: '10 (deficit 5cm)', tags: ['push', 'gymnastics'] },
  { name: 'Muscle-ups (ring)', category: 'gym', scaledReps: '3 (C2B)', rxReps: '5', rxPlusReps: '7 (strict)', tags: ['pull', 'push', 'gymnastics'] },
  { name: 'Bar Muscle-ups', category: 'gym', scaledReps: '3 (C2B)', rxReps: '5', rxPlusReps: '7', tags: ['pull', 'push', 'gymnastics'] },
  { name: 'Double-unders', category: 'gym', scaledReps: '30 (single-unders ×60)', rxReps: '50', rxPlusReps: '75', tags: ['monostructural'] },
  { name: 'Pistol Squats', category: 'gym', scaledReps: '6/jambe (assisté)', rxReps: '10/jambe', rxPlusReps: '12/jambe', tags: ['squat', 'gymnastics'] },
  { name: 'Ring Dips', category: 'gym', scaledReps: '8 (bande)', rxReps: '12', rxPlusReps: '15 (strict)', tags: ['push', 'gymnastics'] },
  { name: 'Wall Walks', category: 'gym', scaledReps: '3', rxReps: '5', rxPlusReps: '7', tags: ['push', 'gymnastics'] },
  { name: 'Lunges', category: 'gym', scaledReps: '10/jambe', rxReps: '15/jambe', rxPlusReps: '20/jambe', tags: ['squat'] },
  { name: 'Box Step-ups', category: 'gym', scaledReps: '10/jambe', rxReps: '12/jambe', rxPlusReps: '15/jambe', tags: ['squat'] },
  { name: 'Hollow Rocks', category: 'gym', scaledReps: '15', rxReps: '20', rxPlusReps: '30', tags: ['core', 'gymnastics'] },
  { name: 'Burpee Box Jump Overs', category: 'gym', scaledReps: '8', rxReps: '12', rxPlusReps: '15', tags: ['push', 'squat', 'monostructural'] },
  { name: 'V-ups', category: 'gym', scaledReps: '12', rxReps: '20', rxPlusReps: '25', tags: ['core'] },
  { name: 'Handstand Walks', category: 'gym', scaledReps: '5m', rxReps: '10m', rxPlusReps: '15m', tags: ['push', 'gymnastics'] },
  { name: 'Devil Press', category: 'gym', scaledReps: '6', rxReps: '10', rxPlusReps: '12', scaledLoad: '2×10kg', rxLoad: '2×15kg', rxPlusLoad: '2×22.5kg', tags: ['push', 'hinge'] },

  // ── Haltero ──
  { name: 'Thrusters', category: 'haltero', scaledReps: '10', rxReps: '12', rxPlusReps: '15', scaledLoad: '30/20kg', rxLoad: '43/30kg', rxPlusLoad: '52/35kg', tags: ['squat', 'push', 'olympic'] },
  { name: 'Power Cleans', category: 'haltero', scaledReps: '8', rxReps: '10', rxPlusReps: '12', scaledLoad: '40/25kg', rxLoad: '60/40kg', rxPlusLoad: '70/50kg', tags: ['pull', 'hinge', 'olympic'] },
  { name: 'Deadlifts', category: 'haltero', scaledReps: '10', rxReps: '12', rxPlusReps: '15', scaledLoad: '60/40kg', rxLoad: '100/70kg', rxPlusLoad: '120/85kg', tags: ['hinge', 'heavy'] },
  { name: 'Snatches (power)', category: 'haltero', scaledReps: '6', rxReps: '8', rxPlusReps: '10', scaledLoad: '30/20kg', rxLoad: '43/30kg', rxPlusLoad: '52/35kg', tags: ['pull', 'olympic'] },
  { name: 'Clean & Jerk', category: 'haltero', scaledReps: '5', rxReps: '7', rxPlusReps: '9', scaledLoad: '40/25kg', rxLoad: '60/40kg', rxPlusLoad: '70/50kg', tags: ['pull', 'push', 'olympic'] },
  { name: 'Front Squats', category: 'haltero', scaledReps: '8', rxReps: '10', rxPlusReps: '12', scaledLoad: '40/25kg', rxLoad: '60/40kg', rxPlusLoad: '70/50kg', tags: ['squat', 'heavy'] },
  { name: 'Overhead Squats', category: 'haltero', scaledReps: '6', rxReps: '8', rxPlusReps: '10', scaledLoad: '30/20kg', rxLoad: '43/30kg', rxPlusLoad: '52/35kg', tags: ['squat', 'olympic'] },
  { name: 'Push Press', category: 'haltero', scaledReps: '8', rxReps: '10', rxPlusReps: '12', scaledLoad: '30/20kg', rxLoad: '43/30kg', rxPlusLoad: '52/35kg', tags: ['push'] },
  { name: 'Hang Cleans', category: 'haltero', scaledReps: '8', rxReps: '10', rxPlusReps: '12', scaledLoad: '40/25kg', rxLoad: '60/40kg', rxPlusLoad: '70/50kg', tags: ['pull', 'olympic'] },
  { name: 'Sumo Deadlift High Pull', category: 'haltero', scaledReps: '10', rxReps: '12', rxPlusReps: '15', scaledLoad: '30/20kg', rxLoad: '43/30kg', rxPlusLoad: '52/35kg', tags: ['pull', 'hinge'] },
  { name: 'Wall Balls', category: 'haltero', scaledReps: '15', rxReps: '20', rxPlusReps: '25', scaledLoad: '6/4kg', rxLoad: '9/6kg', rxPlusLoad: '9/6kg', tags: ['squat', 'push'] },
  { name: 'Squat Clean', category: 'haltero', scaledReps: '6', rxReps: '8', rxPlusReps: '10', scaledLoad: '40/25kg', rxLoad: '60/40kg', rxPlusLoad: '70/50kg', tags: ['squat', 'pull', 'olympic'] },
  { name: 'Cluster', category: 'haltero', scaledReps: '5', rxReps: '7', rxPlusReps: '9', scaledLoad: '40/25kg', rxLoad: '60/40kg', rxPlusLoad: '70/50kg', tags: ['squat', 'push', 'olympic'] },

  // ── Cardio ──
  { name: 'Row (Cal)', category: 'cardio', scaledReps: '12 Cal', rxReps: '20 Cal', rxPlusReps: '25 Cal', tags: ['monostructural'] },
  { name: 'SkiErg (Cal)', category: 'cardio', scaledReps: '12 Cal', rxReps: '18 Cal', rxPlusReps: '22 Cal', tags: ['monostructural'] },
  { name: 'Assault Bike (Cal)', category: 'cardio', scaledReps: '10 Cal', rxReps: '15 Cal', rxPlusReps: '20 Cal', tags: ['monostructural'] },
  { name: 'Echo Bike (Cal)', category: 'cardio', scaledReps: '10 Cal', rxReps: '15 Cal', rxPlusReps: '20 Cal', tags: ['monostructural'] },
  { name: 'Run 200m', category: 'cardio', scaledReps: '200m', rxReps: '200m', rxPlusReps: '200m', tags: ['monostructural'] },
  { name: 'Run 400m', category: 'cardio', scaledReps: '400m', rxReps: '400m', rxPlusReps: '400m', tags: ['monostructural'] },
  { name: 'Rope Climbs', category: 'cardio', scaledReps: '1 (lay-down)', rxReps: '2', rxPlusReps: '3 (legless)', tags: ['pull', 'gymnastics'] },
  { name: 'Sled Push', category: 'cardio', scaledReps: '25m', rxReps: '25m', rxPlusReps: '25m', tags: ['squat', 'monostructural'] },
  { name: 'Sandbag Carry', category: 'cardio', scaledReps: '50m', rxReps: '50m', rxPlusReps: '50m', scaledLoad: '15kg', rxLoad: '20kg', rxPlusLoad: '30kg', tags: ['core', 'monostructural'] },

  // ── Kettlebell ──
  { name: 'KB Swings', category: 'kettlebell', scaledReps: '12', rxReps: '15', rxPlusReps: '20', scaledLoad: '16/12kg', rxLoad: '24/16kg', rxPlusLoad: '32/24kg', tags: ['hinge'] },
  { name: 'KB Goblet Squats', category: 'kettlebell', scaledReps: '10', rxReps: '12', rxPlusReps: '15', scaledLoad: '16/12kg', rxLoad: '24/16kg', rxPlusLoad: '32/24kg', tags: ['squat'] },
  { name: 'KB Turkish Get-ups', category: 'kettlebell', scaledReps: '2/côté', rxReps: '3/côté', rxPlusReps: '4/côté', scaledLoad: '12/8kg', rxLoad: '16/12kg', rxPlusLoad: '24/16kg', tags: ['core'] },
  { name: 'KB Clean & Press', category: 'kettlebell', scaledReps: '6/bras', rxReps: '8/bras', rxPlusReps: '10/bras', scaledLoad: '16/12kg', rxLoad: '24/16kg', rxPlusLoad: '32/24kg', tags: ['push', 'pull'] },
  { name: 'KB Farmers Carry', category: 'kettlebell', scaledReps: '50m', rxReps: '50m', rxPlusReps: '50m', scaledLoad: '2×16kg', rxLoad: '2×24kg', rxPlusLoad: '2×32kg', tags: ['core'] },
  { name: 'KB Snatches', category: 'kettlebell', scaledReps: '6/bras', rxReps: '8/bras', rxPlusReps: '10/bras', scaledLoad: '16/12kg', rxLoad: '24/16kg', rxPlusLoad: '32/24kg', tags: ['pull', 'hinge'] },
  { name: 'KB Box Step-overs', category: 'kettlebell', scaledReps: '8/jambe', rxReps: '10/jambe', rxPlusReps: '12/jambe', scaledLoad: '16/12kg', rxLoad: '24/16kg', rxPlusLoad: '32/24kg', tags: ['squat'] },
  { name: 'KB Thrusters', category: 'kettlebell', scaledReps: '8', rxReps: '12', rxPlusReps: '15', scaledLoad: '2×12kg', rxLoad: '2×16kg', rxPlusLoad: '2×24kg', tags: ['squat', 'push'] },
];

// ─── Fun Names Pool ─────────────────────────────────────────────

const FUN_NAMES = [
  'Le Broyeur', 'Pain Train', 'The Furnace', 'Storm Warning', 'La Machine',
  'Ticket to Hell', 'Full Send Friday', 'Le Baptême', 'Muscle Party', 'Engine Builder',
  'The Grinder', 'Sueur & Larmes', 'Beast Mode', 'No Mercy', 'Chaos Theory',
  'Le Mur', 'Cardio Killer', 'Iron Lung', 'Burn Notice', 'Le Calvaire',
  'Savage Sunday', 'Feu de Forge', 'Dark Horse', 'Plein Gaz', 'The Inferno',
  'Acid Bath', 'Thunder Road', 'Legs of Steel', 'La Tempête', 'Wrecking Ball',
  'Le Tsunami', 'Fire & Ice', 'Death Valley', 'Full Throttle', 'Le Verdict',
  'Blackout', 'Apocalypse Now', 'Hell Week', 'Le Défi', 'Nitro',
];

// ─── Hyrox-prep whitelist ───────────────────────────────────────

const HYROX_PREP_NAMES = new Set([
  'Wall Balls', 'Sled Push', 'Sandbag Carry', 'KB Farmers Carry',
  'SkiErg (Cal)', 'Row (Cal)', 'Burpee Box Jump Overs', 'Run 200m', 'Run 400m',
]);

// ─── Buy-in / Buy-out options ───────────────────────────────────

const BUYIN_OPTIONS = [
  'Row 1000m', 'Run 800m', '50 Cal Assault Bike', '50 Cal Echo Bike', 'Run 400m ×2', '40 Cal SkiErg',
];

const BUYOUT_OPTIONS = [
  '50 GHD Sit-ups', '100 Double-unders', '30 Toes-to-bar', '50 Sit-ups', '40 V-ups', '75 Double-unders',
];

// ─── WOD Type Config ─────────────────────────────────────────────

interface WodConfig {
  name: string;
  movementCount: number;
  durationMin: number;
  durationMax: number;
  buildDescription: (movements: { movement: WodMovement; reps: string; load?: string }[], duration: number) => string;
}

function formatMove(m: { movement: WodMovement; reps: string; load?: string }): string {
  return `${m.reps} ${m.movement.name}${m.load ? ` (${m.load})` : ''}`;
}

const WOD_CONFIGS: Record<WodType, WodConfig> = {
  amrap: {
    name: 'AMRAP',
    movementCount: 3,
    durationMin: 10,
    durationMax: 20,
    buildDescription: (moves, dur) =>
      `AMRAP ${dur} minutes :\n${moves.map(m => `  ${formatMove(m)}`).join('\n')}`,
  },
  fortime: {
    name: 'For Time',
    movementCount: 3,
    durationMin: 8,
    durationMax: 20,
    buildDescription: (moves, dur) =>
      `For Time (cap ${dur}') :\n  3 rounds of :\n${moves.map(m => `    ${formatMove(m)}`).join('\n')}`,
  },
  emom: {
    name: 'EMOM',
    movementCount: 3,
    durationMin: 12,
    durationMax: 24,
    buildDescription: (moves, dur) =>
      `EMOM ${dur} minutes (${dur / moves.length} rounds) :\n${moves.map((m, i) => `  Min ${i + 1}: ${formatMove(m)}`).join('\n')}`,
  },
  chipper: {
    name: 'Chipper',
    movementCount: 5,
    durationMin: 15,
    durationMax: 30,
    buildDescription: (moves, dur) =>
      `For Time (Chipper, cap ${dur}') :\n${moves.map(m => `  ${formatMove(m)}`).join('\n')}`,
  },
  couplet: {
    name: 'Couplet',
    movementCount: 2,
    durationMin: 8,
    durationMax: 15,
    buildDescription: (moves, dur) =>
      `AMRAP ${dur} minutes (Couplet) :\n${moves.map(m => `  ${formatMove(m)}`).join('\n')}`,
  },
  triplet: {
    name: 'Triplet',
    movementCount: 3,
    durationMin: 12,
    durationMax: 20,
    buildDescription: (moves) =>
      `5 Rounds For Time (Triplet) :\n${moves.map(m => `  ${formatMove(m)}`).join('\n')}`,
  },
  deathby: {
    name: 'Death By',
    movementCount: 1,
    durationMin: 10,
    durationMax: 15,
    buildDescription: (_moves, _dur) => '', // built separately
  },
  tabata: {
    name: 'Tabata',
    movementCount: 2,
    durationMin: 8,
    durationMax: 8,
    buildDescription: (_moves, _dur) => '', // built separately
  },
  buyin: {
    name: 'Buy-in/Out',
    movementCount: 3,
    durationMin: 15,
    durationMax: 25,
    buildDescription: (_moves, _dur) => '', // built separately
  },
  ladder: {
    name: 'Ladder',
    movementCount: 2,
    durationMin: 10,
    durationMax: 15,
    buildDescription: (_moves, _dur) => '', // built separately
  },
};

// ─── Utilities ──────────────────────────────────────────────────

function pick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFunName(): string {
  return pickOne(FUN_NAMES);
}

// ─── Theme-based filtering ──────────────────────────────────────

function applyThemeFilter(pool: WodMovement[], theme: WodTheme): WodMovement[] {
  switch (theme) {
    case 'heavy':
      return pool.filter(m =>
        m.category === 'haltero' || m.name === 'Wall Balls'
      );
    case 'gymnastics':
      return pool.filter(m => m.category === 'gym' && m.tags.includes('gymnastics'));
    case 'cardio':
      return pool.filter(m =>
        m.category === 'cardio' ||
        (m.category === 'gym' && m.tags.includes('monostructural'))
      );
    case 'hyrox-prep':
      return pool.filter(m => HYROX_PREP_NAMES.has(m.name));
    case 'full-send':
      // no filter, but enforce variety in generator
      return pool;
    case 'kb-only':
      return pool.filter(m => m.category === 'kettlebell');
    case 'random':
    default:
      return pool;
  }
}

// ─── Anti-combo validation ──────────────────────────────────────

function tagsKey(tags: string[]): string {
  return [...tags].sort().join(',');
}

function isHeavyBarbell(m: WodMovement): boolean {
  return m.category === 'haltero' && (m.tags.includes('heavy') || m.tags.includes('olympic'));
}

function validateCombo(selected: WodMovement[], theme: WodTheme): boolean {
  // Max 1 heavy barbell movement (unless theme is 'heavy')
  if (theme !== 'heavy') {
    const heavyCount = selected.filter(isHeavyBarbell).length;
    if (heavyCount > 1) return false;
  }

  // Always include at least 1 monostructural/cardio (unless gymnastics or kb-only)
  if (theme !== 'gymnastics' && theme !== 'kb-only') {
    const hasMono = selected.some(m => m.tags.includes('monostructural') || m.category === 'cardio');
    if (!hasMono) return false;
  }

  // Never 2 movements with the same exact tag combination
  const tagKeys = selected.map(m => tagsKey(m.tags));
  if (new Set(tagKeys).size !== tagKeys.length) return false;

  // Never more than 2 'push' movements
  const pushCount = selected.filter(m => m.tags.includes('push')).length;
  if (pushCount > 2) return false;

  return true;
}

function selectMovements(pool: WodMovement[], count: number, theme: WodTheme): WodMovement[] {
  // For full-send, ensure at least 1 from each: haltero, gym, cardio
  if (theme === 'full-send' && count >= 3) {
    for (let attempt = 0; attempt < 50; attempt++) {
      const selected = pick(pool, count);
      const cats = new Set(selected.map(m => m.category));
      if (cats.has('haltero') && cats.has('gym') && cats.has('cardio') && validateCombo(selected, theme)) {
        return selected;
      }
    }
  }

  // General selection with validation retry
  for (let attempt = 0; attempt < 50; attempt++) {
    const selected = pick(pool, count);
    if (validateCombo(selected, theme)) {
      return selected;
    }
  }

  // Fallback: just return what we can
  return pick(pool, count);
}

// ─── Level-based reps/load ──────────────────────────────────────

function getReps(movement: WodMovement, level: Level): string {
  if (level === 3 && movement.rxPlusReps) return movement.rxPlusReps;
  if (level >= 2) return movement.rxReps;
  return movement.scaledReps;
}

function getLoad(movement: WodMovement, level: Level): string | undefined {
  if (level === 3 && movement.rxPlusLoad) return movement.rxPlusLoad;
  if (level >= 2) return movement.rxLoad;
  return movement.scaledLoad;
}

// ─── Generator ──────────────────────────────────────────────────

export function generateWod(
  level: Level,
  wodType?: WodType,
  categoryFilter?: MovementCategory,
  theme: WodTheme = 'random',
): GeneratedWod {
  // Pick random type if not specified
  const types: WodType[] = ['amrap', 'fortime', 'emom', 'chipper', 'couplet', 'triplet', 'deathby', 'tabata', 'buyin', 'ladder'];
  const type = wodType || pickOne(types);
  const config = WOD_CONFIGS[type];

  // Build movement pool: category filter first, then theme filter
  let pool = [...MOVEMENTS];
  if (categoryFilter) {
    pool = pool.filter(m => m.category === categoryFilter);
  }
  pool = applyThemeFilter(pool, theme);

  // Ensure enough movements in pool
  if (pool.length < config.movementCount) {
    pool = [...MOVEMENTS];
    if (categoryFilter) {
      pool = pool.filter(m => m.category === categoryFilter);
    }
    if (pool.length < config.movementCount) {
      pool = [...MOVEMENTS];
    }
  }

  const funName = getRandomFunName();

  // ── Death By ──
  if (type === 'deathby') {
    const deathPool = pool.filter(m =>
      !m.tags.includes('monostructural') || m.name === 'Burpees' || m.name === 'Burpee Box Jump Overs'
    );
    const mov = pickOne(deathPool.length > 0 ? deathPool : pool);
    const startReps = randomInt(1, 2);
    const increment = randomInt(1, 2);
    const dur = randomInt(10, 15);
    const reps = getReps(mov, level);
    const load = getLoad(mov, level);

    const description =
      `☠️ DEATH BY ${mov.name}\nDépart : ${startReps} rep(s), +${increment} rep(s) par minute\nCap : ${dur} minutes\nQuand tu ne peux plus finir dans la minute, c'est fini !`;

    return {
      type,
      name: config.name,
      funName,
      duration: dur,
      movements: [{ movement: mov, reps, load }],
      description,
    };
  }

  // ── Tabata ──
  if (type === 'tabata') {
    const selected = selectMovements(pool, 2, theme);
    const movements = selected.map(movement => ({
      movement,
      reps: getReps(movement, level),
      load: getLoad(movement, level),
    }));

    const description =
      `⏱ TABATA — 8 rounds (20s ON / 10s OFF)\nMouvement A : ${formatMove(movements[0])}\nMouvement B : ${formatMove(movements[1])}\nAlternez A et B chaque round`;

    return {
      type,
      name: config.name,
      funName,
      duration: 8,
      movements,
      description,
    };
  }

  // ── Buy-in / Buy-out ──
  if (type === 'buyin') {
    const selected = selectMovements(pool, 3, theme);
    const movements = selected.map(movement => ({
      movement,
      reps: getReps(movement, level),
      load: getLoad(movement, level),
    }));
    const dur = randomInt(15, 25);
    const buyin = pickOne(BUYIN_OPTIONS);
    const buyout = pickOne(BUYOUT_OPTIONS);

    const movLines = movements.map(m => `    ${formatMove(m)}`).join('\n');
    const description =
      `🎫 BUY-IN / BUY-OUT — For Time (cap ${dur}')\n\n🔓 Buy-in : ${buyin}\n\nCorps :\n  3 rounds :\n${movLines}\n\n🔒 Buy-out : ${buyout}`;

    return {
      type,
      name: config.name,
      funName,
      duration: dur,
      movements,
      description,
    };
  }

  // ── Ascending Ladder ──
  if (type === 'ladder') {
    const selected = selectMovements(pool, 2, theme);
    const movements = selected.map(movement => ({
      movement,
      reps: getReps(movement, level),
      load: getLoad(movement, level),
    }));
    const dur = randomInt(10, 15);

    const description =
      `📈 ASCENDING LADDER — For Time (cap ${dur}')\n${movements[0].movement.name} / ${movements[1].movement.name}\n  2-4-6-8-10-12-14...${movements[0].load ? `\n  ${movements[0].movement.name} : ${movements[0].load}` : ''}${movements[1].load ? `\n  ${movements[1].movement.name} : ${movements[1].load}` : ''}`;

    return {
      type,
      name: config.name,
      funName,
      duration: dur,
      movements,
      description,
    };
  }

  // ── Standard types (AMRAP, For Time, EMOM, Chipper, Couplet, Triplet) ──
  const selected = selectMovements(pool, config.movementCount, theme);

  // Apply heavy theme rep reduction
  const movements = selected.map(movement => {
    let reps = getReps(movement, level);
    let load = getLoad(movement, level);

    if (theme === 'heavy') {
      // Halve reps for heavy theme
      const numMatch = reps.match(/^\d+/);
      if (numMatch) {
        const halved = Math.max(1, Math.round(parseInt(numMatch[0]) / 2));
        reps = reps.replace(/^\d+/, String(halved));
      }
    }

    if (theme === 'full-send') {
      // Increase reps for full-send
      const numMatch = reps.match(/^\d+/);
      if (numMatch) {
        const boosted = Math.round(parseInt(numMatch[0]) * 1.3);
        reps = reps.replace(/^\d+/, String(boosted));
      }
    }

    return { movement, reps, load };
  });

  // Chipper multiplier
  if (type === 'chipper') {
    movements.forEach(m => {
      const numMatch = m.reps.match(/^\d+/);
      if (numMatch) {
        const base = parseInt(numMatch[0]);
        const multiplied = base * (level >= 3 ? 3 : level >= 2 ? 2 : 1.5);
        m.reps = m.reps.replace(/^\d+/, String(Math.round(multiplied)));
      }
    });
  }

  // Duration
  const duration = type === 'emom'
    ? config.movementCount * randomInt(4, 8) // must be divisible by movement count
    : randomInt(config.durationMin, config.durationMax);

  const description = config.buildDescription(movements, duration);

  return {
    type,
    name: config.name,
    funName,
    duration,
    movements,
    description,
  };
}

// ─── Labels ─────────────────────────────────────────────────────

export const WOD_TYPE_LABELS: Record<WodType, string> = {
  amrap: 'AMRAP',
  fortime: 'For Time',
  emom: 'EMOM',
  chipper: 'Chipper',
  couplet: 'Couplet',
  triplet: 'Triplet',
  deathby: 'Death By ☠️',
  tabata: 'Tabata ⏱',
  buyin: 'Buy-in/Out 🎫',
  ladder: 'Ladder 📈',
};

export const CATEGORY_FILTER_LABELS: Record<MovementCategory | 'all', string> = {
  all: 'Tous',
  gym: 'Gymnastique',
  haltero: 'Haltérophilie',
  cardio: 'Cardio',
  kettlebell: 'Kettlebell',
};

export const THEME_LABELS: Record<WodTheme, string> = {
  random: 'Aléatoire',
  heavy: 'Heavy Day 🏋️',
  gymnastics: 'Gymnastics Party 🤸',
  cardio: 'Cardio Burner 🔥',
  'hyrox-prep': 'Hyrox Prep 🏃',
  'full-send': 'Full Send 💀',
  'kb-only': 'KB Only 🔔',
};
