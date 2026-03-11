import type { Plan, Session, SessionSection, WeekPlan, Block, Intensity, SessionCategory, SessionSubType, UserProfile, Level } from '../types';
import { getBlockForWeek } from '../types';

let idCounter = 0;
function uid(): string {
  return `s_${Date.now()}_${++idCounter}`;
}

// ─── Session Templates ───────────────────────────────────────────

interface SessionTemplate {
  category: SessionCategory;
  subType: SessionSubType;
  name: string;
  baseDuration: number;
  baseIntensity: Intensity;
  distance?: number;
  exercises: string[];
  sections: SessionSection[];
  objective: string;
  workflow: string;
}

type LevelTemplates = Record<Block, SessionTemplate[]>;

// ─── Helper: build template with sections ────────────────────────

function tpl(
  base: Omit<SessionTemplate, 'exercises' | 'sections'> & {
    sections: SessionSection[];
    objective: string;
    workflow: string;
  },
): SessionTemplate {
  const exercises = base.sections.flatMap(s => s.items);
  return { ...base, exercises };
}

// ═══════════════════════════════════════════════════════════════════
// ─── RUN TEMPLATES ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

const runTemplates: Record<Level, LevelTemplates> = {
  // ══════════════════ Débutant (Level 1) ══════════════════
  1: {
    base: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie Z2 — Endurance fondamentale',
        baseDuration: 40, baseIntensity: 2, distance: 5,
        objective: 'Développer la base aérobie en course continue à allure conversationnelle.',
        workflow: "5' marche rapide → 30' Z2 → 5' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Marche rapide 5min',
            'Gammes dynamiques : montées de genoux, talons-fesses, pas chassés (2min)',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Course continue Z2 (FC 130-145) — 30min',
            'Garder une allure conversationnelle',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Étirements mollets, quadriceps, ischio-jambiers — 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné débutant 6×200m',
        baseDuration: 35, baseIntensity: 3, distance: 3.5,
        objective: 'Initier le travail de vitesse avec des fractions courtes et récupération longue.',
        workflow: "10' échauf → 6×200m (repos 1'30) → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing léger 8min',
            'Gammes dynamiques : montées de genoux, talons-fesses, pas chassés',
            '2 accélérations progressives sur 60m',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '6×200m à allure 5K — repos 1min30 marche',
            'Focus : foulée relâchée, pas de sprint',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing très léger 8min',
            'Étirements ischio-jambiers, mollets, hanches — 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo facile 15min',
        baseDuration: 35, baseIntensity: 2, distance: 4,
        objective: 'Découvrir le tempo : maintenir une allure soutenue sans forcer.',
        workflow: "10' échauf → 15' tempo → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            '4 accélérations progressives sur 60m',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo 15min à allure confortable mais soutenue',
            'RPE 6/10 — phrases courtes possibles',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements quadriceps, mollets — 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie longue Z2 progressive',
        baseDuration: 45, baseIntensity: 2, distance: 6,
        objective: 'Allonger la durée en Z2 avec une légère accélération finale.',
        workflow: "5' marche → 30' Z2 → 5' Z2 haute → 5' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Marche rapide 5min',
            'Gammes dynamiques légères (2min)',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Course continue Z2 — 30min',
            'Derniers 5min : légère accélération (Z2 haute)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Étirements complets — 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné 6×400m',
        baseDuration: 40, baseIntensity: 3, distance: 4.5,
        objective: 'Progresser en fractionné avec des 400m à allure contrôlée.',
        workflow: "10' échauf → 6×400m @5K (repos 1'30) → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing léger 8min',
            'Gammes : montées de genoux, talons-fesses, pas chassés',
            '2 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '6×400m à allure 5K — repos 1min30 trot',
            'Maintenir un rythme régulier sur chaque fraction',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements dynamiques 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo 20min',
        baseDuration: 40, baseIntensity: 3, distance: 5,
        objective: 'Tenir 20 minutes à allure semi-marathon pour travailler le seuil.',
        workflow: "10' échauf → 20' tempo semi → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            '3 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo 20min — allure semi-marathon (RPE 7/10)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements complets 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie longue Z2',
        baseDuration: 50, baseIntensity: 2, distance: 7,
        objective: 'Maintenir une longue sortie Z2 pour la capacité aérobie maximale.',
        workflow: "5' marche → 40' Z2 → 5' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Marche rapide 5min',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Course continue Z2 — 40min',
            'Objectif : endurance sans fatigue excessive',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Étirements complets — 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné 8×400m',
        baseDuration: 45, baseIntensity: 4, distance: 5,
        objective: 'Augmenter le volume de fractionné pour la capacité de vitesse.',
        workflow: "10' échauf → 8×400m @5K (repos 1'15) → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing léger 8min',
            'Gammes dynamiques complètes',
            '3 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '8×400m à allure 5K — repos 1min15 trot',
            'Focus : régularité des splits',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements complets 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'hyrox-run', name: 'Simulation course Hyrox',
        baseDuration: 50, baseIntensity: 4, distance: 4.5,
        objective: 'Simuler les runs Hyrox avec transitions pour préparer le format course.',
        workflow: "10' échauf → 4×1km + 2' repos marche → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Gammes dynamiques',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '4× (1km run à allure course + 2min repos marche)',
            'Entre chaque km : simuler une transition station',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements complets 5min',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Footing récupération',
        baseDuration: 30, baseIntensity: 1, distance: 3.5,
        objective: 'Récupérer activement avec un footing très facile.',
        workflow: "25' Z1-Z2 → 5' étirements",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Course facile Z1-Z2 — 25min',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Étirements légers 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo très léger 10min',
        baseDuration: 25, baseIntensity: 2, distance: 3,
        objective: 'Garder le contact avec le tempo sans stress musculaire.',
        workflow: "10' échauf → 10' tempo léger → 5' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing léger 8min',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo léger 10min (RPE 5/10)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing très léger 5min',
          ]},
        ],
      }),
    ],
  },

  // ══════════════════ Intermédiaire (Level 2) ══════════════════
  2: {
    base: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie longue Z2 — Aérobie',
        baseDuration: 50, baseIntensity: 2, distance: 8.5,
        objective: 'Construire une base aérobie solide avec du terrain varié.',
        workflow: "5' échauf → 40' Z2 terrain varié → 5' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 5min',
            'Gammes dynamiques : montées de genoux, talons-fesses, pas chassés',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Course continue Z2 (FC 140-155) — 40min',
            'Terrain varié si possible (côtes légères)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing très léger 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné 8×400m',
        baseDuration: 45, baseIntensity: 3, distance: 5.5,
        objective: 'Développer la VMA avec des fractions régulières.',
        workflow: "10' échauf + gammes → 8×400m @5K (repos 1'15) → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Gammes dynamiques : montées de genoux, talons-fesses, pas chassés',
            '3 accélérations progressives sur 80m',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '8×400m à allure 5K — repos 1min15 trot',
            'Focus : régularité des splits (±3s)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements complets 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo run 25min',
        baseDuration: 45, baseIntensity: 3, distance: 7,
        objective: 'Travailler le seuil aérobie avec un tempo soutenu.',
        workflow: "10' échauf → 25' tempo semi → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            '4 accélérations progressives sur 80m',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo 25min à allure semi-marathon',
            'RPE 7/10 — phrases courtes possibles',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie longue Z2 progressive',
        baseDuration: 55, baseIntensity: 2, distance: 9,
        objective: 'Développer la capacité aérobie avec un finish fast en allure marathon.',
        workflow: "5' échauf → 35' Z2 → 10' allure marathon → 5' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 5min',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Course Z2 — 35min',
            'Finish fast : derniers 10min à allure marathon',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 3min',
            'Étirements complets 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné 10×400m',
        baseDuration: 50, baseIntensity: 4, distance: 6,
        objective: 'Augmenter le volume VMA avec 10 fractions à allure 5K.',
        workflow: "10' échauf → 10×400m @5K (repos 1') → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Gammes dynamiques : montées de genoux, talons-fesses, pas chassés',
            '3 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '10×400m à allure 5K — repos 1min trot',
            'Splits cible : réguliers ou négatif split',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements complets 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'hyrox-run', name: 'Course Hyrox simulation',
        baseDuration: 55, baseIntensity: 4, distance: 5.5,
        objective: 'Simuler les transitions Hyrox avec des burpees entre les kilomètres.',
        workflow: "10' échauf → 5×1km + 10 burpees entre chaque → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Gammes dynamiques',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '5× (1km run à allure Hyrox + 1min30 repos)',
            'Simuler transitions : 10 burpees entre chaque km',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo 30min seuil',
        baseDuration: 50, baseIntensity: 4, distance: 7.5,
        objective: 'Repousser le seuil lactique avec un tempo prolongé.',
        workflow: "10' échauf → 30' tempo seuil → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            '3 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo 30min à allure seuil (RPE 8/10)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie longue Z2',
        baseDuration: 60, baseIntensity: 2, distance: 10,
        objective: 'Sortie longue de capacité pour simuler la durée de compétition.',
        workflow: "55' Z2 terrain mixte → 5' retour calme",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Course continue Z2 — 55min',
            'Terrain mixte recommandé',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Étirements complets 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné 12×400m pyramidal',
        baseDuration: 55, baseIntensity: 5, distance: 7,
        objective: 'Travailler la résistance à la vitesse en fatigue avec un format pyramidal.',
        workflow: "10' échauf → 4×400m @5K → 4×400m @3K → 4×400m @5K (repos 1') → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Gammes dynamiques complètes',
            '3 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '4×400m @5K, 4×400m @3K, 4×400m @5K — repos 1min',
            'Focus : maintenir la forme en fatigue',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements complets 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'hyrox-run', name: 'Course Hyrox race pace',
        baseDuration: 60, baseIntensity: 5, distance: 8,
        objective: 'Simuler 8km de course à allure compétition avec transitions.',
        workflow: "10' échauf → 8×1km race pace (récup trot 200m) → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Gammes dynamiques',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '8×1km à allure compétition',
            'Récup trot 200m entre chaque (simulant transition)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements profonds 5min',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Footing récupération',
        baseDuration: 30, baseIntensity: 1, distance: 4.5,
        objective: 'Récupération active avec footing très facile.',
        workflow: "25' Z1-Z2 → 5' stretching",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Course très facile Z1-Z2 — 25min',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching léger 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo léger 15min',
        baseDuration: 30, baseIntensity: 2, distance: 4,
        objective: 'Garder le contact avec le rythme tempo sans stress.',
        workflow: "10' échauf → 15' tempo léger → 5' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing léger 8min',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo léger 15min (RPE 5/10)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing très léger 5min',
          ]},
        ],
      }),
    ],
  },

  // ══════════════════ Avancé (Level 3) ══════════════════
  3: {
    base: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie longue Z2 — Foncier vallonné',
        baseDuration: 60, baseIntensity: 3, distance: 11,
        objective: 'Construire un foncier exigeant sur terrain vallonné avec negative split final.',
        workflow: "5' échauf → 40' Z2 vallonné → 15' negative split → retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 5min',
            'Gammes dynamiques : montées de genoux, talons-fesses, pas chassés',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Course Z2 (FC 145-160) — 40min sur terrain vallonné',
            'Negative split : derniers 15min plus rapide que le début',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 3min',
            'Routine mobilité hanches/chevilles 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné 12×400m @3K',
        baseDuration: 55, baseIntensity: 4, distance: 7.5,
        objective: 'Travail VMA haute intensité avec fractions à allure 3K et repos courts.',
        workflow: "10' échauf + gammes + accélérations → 12×400m @3K (repos 45s) → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 10min',
            'Gammes dynamiques : montées de genoux, talons-fesses, pas chassés',
            '3 accélérations progressives sur 100m',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '12×400m à allure 3K — repos 45s trot',
            'Objectif : régularité absolue des splits, pas de déclin',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 10min',
            'Étirements profonds ischio/mollets/hanches 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo 35min allure semi-marathon',
        baseDuration: 55, baseIntensity: 4, distance: 9,
        objective: 'Tenir 35 minutes à allure semi-marathon pour repousser le seuil.',
        workflow: "10' échauf + accélérations → 35' tempo semi → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            '4 accélérations 100m',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo 35min à allure semi-marathon (RPE 7-8/10)',
            'Focus : relâchement du haut du corps, foulée économique',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements complets 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'hyrox-run', name: 'Hyrox Run — 5×1km + transitions',
        baseDuration: 55, baseIntensity: 4, distance: 7,
        objective: 'Préparer le format Hyrox dès la base avec des transitions fonctionnelles.',
        workflow: "8' échauf → 5×1km race pace + exercice transition → 8' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Gammes dynamiques',
            '2 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '5× (1km à allure Hyrox race pace)',
            'Entre chaque km : 15 wall balls + 10 KB swings (transition simulée)',
            'Repos marche 30s entre chaque transition et le km suivant',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements complets 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie longue progressive',
        baseDuration: 65, baseIntensity: 3, distance: 12,
        objective: 'Sortie longue avec progression allure marathon puis semi pour simuler la fatigue.',
        workflow: "40' Z2 → 10' allure marathon → 10' allure semi → 5' retour calme",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Course Z2 — 40min',
            'Progression : 10min allure marathon, 10min allure semi',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné mixte 3K/5K',
        baseDuration: 55, baseIntensity: 4, distance: 7.5,
        objective: 'Alterner les allures pour développer la résistance à haute intensité.',
        workflow: "10' échauf → 5×400m @3K → 5×400m @5K → 3×200m sprint → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 10min',
            'Gammes dynamiques complètes',
            '3 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '5×400m @3K pace — repos 1min',
            '5×400m @5K pace — repos 45s',
            '3×200m sprint finish — repos 1min',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'hyrox-run', name: 'Hyrox Run Simulation complète',
        baseDuration: 60, baseIntensity: 5, distance: 7,
        objective: 'Simulation Hyrox avec wall balls et farmers carry entre chaque km.',
        workflow: "10' échauf → 6×1km race pace + stations → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Activation : 10 air squats + 10 push-ups',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '6×1km à allure Hyrox race pace',
            'Entre chaque : 15 wall balls + 200m farmers carry',
            'Transitions rapides < 20s',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements profonds 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo seuil 35min',
        baseDuration: 55, baseIntensity: 4, distance: 9,
        objective: 'Repousser le seuil lactique avec un effort prolongé intense.',
        workflow: "10' échauf → 35' tempo seuil (RPE 8/10) → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            '3 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo seuil 35min (RPE 8/10)',
            'Focus : relâchement en fatigue',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Sortie longue finish fast',
        baseDuration: 65, baseIntensity: 3, distance: 12,
        objective: 'Simuler la progression en compétition : Z2 puis accélération progressive.',
        workflow: "40' Z2 → 10' allure marathon → 10' allure semi → 5' allure 10K",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Course Z2 — 40min',
            'Progression : 10min allure marathon, 10min allure semi',
            'Derniers 5min : allure 10K',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'intervals', name: 'Fractionné pyramidal 200-800m',
        baseDuration: 60, baseIntensity: 5, distance: 8,
        objective: 'Séance clé pyramidale pour affûter la capacité de changement de rythme.',
        workflow: "12' échauf → 200-400-600-800-600-400-200m (repos 1:1) → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 10min',
            'Gammes dynamiques complètes',
            '3 accélérations progressives',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '200m @mile — 400m @3K — 600m @5K — 800m @10K',
            'Redescente : 600m — 400m — 200m',
            'Repos : temps de fraction (1:1)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements profonds 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'hyrox-run', name: 'Hyrox Full Race Simulation Run',
        baseDuration: 70, baseIntensity: 5, distance: 9,
        objective: 'Simulation course complète Hyrox : 8×1km avec exercices stations entre chaque.',
        workflow: "8' échauf → 8×1km race pace + transitions stations → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Activation neuromusculaire : 10 air squats + 5 burpees',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '8×1km à allure compétition (cible sub 5:00/km)',
            'Transitions : exercice station simulé entre chaque km',
            'Objectif : maintenir le rythme même en fatigue',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 8min',
            'Étirements profonds 5min',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'run', subType: 'endurance', name: 'Footing régénération',
        baseDuration: 35, baseIntensity: 1, distance: 6,
        objective: 'Régénérer le corps avec un footing très facile, respiration nasale.',
        workflow: "30' Z1 + 5' stretching",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Course Z1 — 30min',
            'Focus : plaisir, respiration nasale',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'run', subType: 'tempo', name: 'Tempo léger 15min',
        baseDuration: 30, baseIntensity: 2, distance: 5,
        objective: 'Garder le contact avec le rythme sans fatigue.',
        workflow: "10' échauf → 15' tempo léger → 5' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing léger 8min',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Tempo léger 15min',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing très léger 5min',
          ]},
        ],
      }),
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════
// ─── CROSSFIT TEMPLATES ──────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

const crossfitTemplates: Record<Level, LevelTemplates> = {
  // ══════════════════ Débutant (Level 1) ══════════════════
  1: {
    base: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Squat fondamentaux',
        baseDuration: 50, baseIntensity: 2,
        objective: 'Construire les fondations de force en squat avec des charges légères.',
        workflow: "10' rameur + mobilité → Goblet Squat 4×10 → accessoires → 5' étirements",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur léger 8min',
            'Mobilité articulaire : hanches (90/90, world greatest stretch), chevilles (genou au mur)',
            'Montée en charge progressive : 2×10 goblet squat léger',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Goblet Squat : 4×10 — RPE 6',
            'Leg Press ou Squat assisté : 3×12',
            'Fentes marchées : 3×10/jambe',
            'Plank : 3×30s',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Étirements quadriceps, ischio-jambiers, hanches — 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — AMRAP 12min (scaled)',
        baseDuration: 40, baseIntensity: 3,
        objective: 'Découvrir le format AMRAP avec des mouvements accessibles.',
        workflow: "5' rameur + technique → AMRAP 12' → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 5min',
            'Révision technique : box step-ups, push-ups',
            'Mini activation : 2min — 5 air squats + 5 push-ups + 5 ring rows',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'AMRAP 12min :',
            '  10 Box Step-ups (50cm)',
            '  10 Push-ups (genoux si besoin)',
            '  200m Run ou 250m Row',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'skill', name: 'Skill — Mouvements de base',
        baseDuration: 45, baseIntensity: 2,
        objective: 'Travailler les progressions gymnastiques fondamentales.',
        workflow: "10' mobilité → Pull-up prog + Hollow + Single-unders → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Mobilité générale 8min (épaules, hanches, poignets)',
            'Activation : 10 scap pull-ups + 10 hollow rocks',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Pull-up progressions : 4×5 (bande ou négatifs)',
            'Hollow hold : 4×20s',
            'Single-unders : 4×50 (pratique régularité)',
            'Knee raises : 3×10',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching épaules, dos — 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Back Squat progression',
        baseDuration: 55, baseIntensity: 3,
        objective: 'Progresser en back squat avec un cycle 5×5 et des accessoires.',
        workflow: "10' rameur + mobilité → Back Squat 5×5 @65-70% → accessoires → 5' étirements",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité hanches/chevilles ciblée',
            'Montée en charge : 3 séries progressives back squat',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Back Squat : 5×5 @65-70% 1RM — repos 2min30',
            'Romanian Deadlift : 3×10 — RPE 7',
            'Step-ups haltères : 3×8/jambe',
            'Plank : 3×40s',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Étirements complets 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — For Time 21-15-9 (scaled)',
        baseDuration: 45, baseIntensity: 3,
        objective: 'Travailler le format For Time avec un couplet classique.',
        workflow: "8' rameur + révision → 21-15-9 Thrusters/Ring Rows → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 6min',
            'Révision technique thrusters (barre vide) et ring rows',
            'Mini activation : 2min — 5 thrusters légers + 5 ring rows',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'For Time (cap 15min) :',
            '  21-15-9',
            '  Thrusters (barre vide ou 30/20kg)',
            '  Ring Rows ou Pull-ups bande',
            'Objectif : rythme constant',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Press & tirage',
        baseDuration: 50, baseIntensity: 3,
        objective: 'Équilibrer la force press/tirage avec un travail épaules.',
        workflow: "10' rameur + mobilité épaules → Strict Press 5×5 → accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité épaules ciblée (pass-throughs, rotations externes)',
            'Montée en charge : 3 séries progressives press',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Strict Press : 5×5 @60% — repos 2min',
            'Bent-over Row : 4×8',
            'Dumbbell Push Press : 3×10',
            'Face Pulls bande : 3×15',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching épaules 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Squat & Deadlift',
        baseDuration: 55, baseIntensity: 4,
        objective: 'Monter en charge avec des triples lourds pour le pic de force.',
        workflow: "10' rameur + mobilité → Back Squat 5×3 @75% → Deadlift 4×5 → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité complète hanches/chevilles/thoracique',
            'Montée en charge progressive squat',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Back Squat : 5×3 @75% — repos 3min',
            'Deadlift : 4×5 @70%',
            'Bulgarian Split Squat : 3×8/jambe',
            'Plank weighted : 3×30s (5kg)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching profond 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — AMRAP 15min',
        baseDuration: 50, baseIntensity: 4,
        objective: 'AMRAP de capacité avec des mouvements complets.',
        workflow: "8' activation → AMRAP 15' → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 5min',
            'Révision technique box jumps',
            'Mini activation : 2min — 5 box step-ups + 5 push-ups + 5 air squats',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'AMRAP 15min :',
            '  10 Box Jumps (50cm) ou Step-ups',
            '  10 Push-ups',
            '  10 Air Squats',
            '  200m Run',
            'Objectif : régularité, pas de burnout',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'crossfit', subType: 'skill', name: 'Skill & mobilité',
        baseDuration: 40, baseIntensity: 1,
        objective: 'Récupération active avec mobilité et progressions légères.',
        workflow: "15' mobilité → Pull-up négatifs + Hollow + Foam rolling",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Mobilité complète : 15min (hanches, épaules, chevilles)',
            'Pull-up négatifs : 3×5 lents',
            'Hollow body holds : 3×20s',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Foam rolling complet : 10min',
          ]},
        ],
      }),
    ],
  },

  // ══════════════════ Intermédiaire (Level 2) ══════════════════
  2: {
    base: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Back Squat & accessoires',
        baseDuration: 55, baseIntensity: 3,
        objective: 'Cycle de force squat intermédiaire avec accessoires fonctionnels.',
        workflow: "10' rameur + mobilité → Back Squat 5×5 @70% → Front Squat + accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité hanches/chevilles ciblée (90/90, ATG squat hold)',
            'Montée en charge progressive : 3 séries back squat',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Back Squat : 5×5 @70% 1RM — repos 2min30',
            'Front Squat : 3×8 @55% — repos 2min',
            'Bulgarian Split Squat : 3×10/jambe — RPE 7',
            'GHD Hip Extension : 3×15',
            'Plank : 3×45s',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Étirements quadriceps, ischio-jambiers — 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — AMRAP 15min',
        baseDuration: 50, baseIntensity: 3,
        objective: 'AMRAP de base avec mouvements fonctionnels multi-articulaires.',
        workflow: "8' rameur + mobilité → AMRAP 15' → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 6min',
            'Révision technique box jumps, wall balls',
            'Mini activation : 2min AMRAP léger — 5 box step-ups + 5 wall balls légers',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'AMRAP 15min :',
            '  10 Box Jumps (60cm)',
            '  10 Push-ups',
            '  15 Wall Balls (9/6kg)',
            '  200m Run',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'skill', name: 'Skill — Double-unders & Pull-ups',
        baseDuration: 45, baseIntensity: 2,
        objective: 'Progresser sur les double-unders et pull-ups stricts.',
        workflow: "10' mobilité + activation → DU drill + Pull-ups + Hollow + T2B → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Mobilité épaules/poignets 5min',
            'Activation : 10 scap pull-ups + 10 hollow rocks + 20 single-unders',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Double-unders drill : 4×30 (ou 4×2min pratique)',
            'Strict Pull-ups : 4×max (bande si < 5)',
            'Hollow hold : 4×30s',
            'Toes-to-bar progressions : 3×8',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching épaules, dos — 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Deadlift & Clean',
        baseDuration: 60, baseIntensity: 4,
        objective: 'Développer la force de tirage avec deadlift lourd et power clean technique.',
        workflow: "10' rameur + mobilité → Deadlift 5×3 @80% → Power Clean + accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité complète hanches/chaîne postérieure',
            'Montée en charge progressive deadlift : 3 séries',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Deadlift : 5×3 @80% 1RM — repos 3min',
            'Power Clean : 5×3 @70% — focus technique',
            'Barbell Row : 3×10 @RPE 7',
            'Weighted Plank : 3×45s (10kg)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching postérieur 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — For Time "Fran-like"',
        baseDuration: 50, baseIntensity: 4,
        objective: 'Travailler le 21-15-9 classique pour développer la capacité anaérobie.',
        workflow: "8' rameur + technique → 21-15-9 Thrusters/Pull-ups → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 6min',
            'Révision technique thrusters et pull-ups',
            'Mini activation : 2min — 5 thrusters légers + 5 pull-ups',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'For Time :',
            '  21-15-9',
            '  Thrusters (43/30kg)',
            '  Pull-ups',
            'Time cap : 12min',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Press & Snatch',
        baseDuration: 60, baseIntensity: 4,
        objective: 'Développer la force overhead et la technique snatch.',
        workflow: "10' rameur + complexe barre → Press 5×5 + Snatch 5×3 + accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité épaules ciblée',
            'Complexe barre vide : 3 positions snatch (sol, genou, hang)',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Strict Press : 5×5 @75% — repos 2min',
            'Power Snatch : 5×3 @65% — focus réception',
            'Push Press : 3×8 @70%',
            'Core circuit : 3 rounds (15 sit-ups + 10 Russian twists + 15s L-sit)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Mobilité épaules 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Max Effort Squat',
        baseDuration: 60, baseIntensity: 5,
        objective: 'Pic de force squat avec doubles lourds et front squat.',
        workflow: "10' rameur + mobilité → Back Squat 3×2 @87% → Front Squat 3×3 → accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité profonde hanches/chevilles',
            'Montée en charge progressive : 4 séries back squat',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Back Squat : 3×2 @87% — repos 3min30',
            'Front Squat : 3×3 @80%',
            'Pistol Squat progressions : 3×5/jambe',
            'GHD Sit-ups : 3×15',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Foam rolling + stretching 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — Chipper long',
        baseDuration: 55, baseIntensity: 5,
        objective: 'Chipper de compétition pour tester la capacité à gérer plusieurs mouvements en fatigue.',
        workflow: "8' activation → For Time chipper 5 mouvements (cap 25') → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 5min',
            'Activation complète : 5 wall balls + 5 burpees + 250m row',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'For Time (cap 25min) :',
            '  50 Wall Balls (9/6kg)',
            '  40 Cal Row',
            '  30 Burpees',
            '  20 Power Cleans (60/40kg)',
            '  10 Pull-ups (strict ou kipping)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'crossfit', subType: 'skill', name: 'Skill & mobilité active',
        baseDuration: 45, baseIntensity: 2,
        objective: 'Récupération active avec du skill work léger et de la mobilité.',
        workflow: "Handstand 10' → L-sit + Mobility flow 15' → DU + Foam rolling",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Handstand practice : 10min (contre mur ou libre)',
            'L-sit progressions : 4×15s',
            'Mobility flow : 15min (hanches, thoracique, épaules)',
            'Double-unders légers : 3×30',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Foam rolling complet : 10min',
          ]},
        ],
      }),
    ],
  },

  // ══════════════════ Avancé (Level 3) ══════════════════
  3: {
    base: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Complexe Clean + Front Squat + Jerk',
        baseDuration: 65, baseIntensity: 4,
        objective: 'Construire la force avec des complexes haltéro exigeants dès la base.',
        workflow: "10' rameur + mobilité → Complexe C+FS+J 5×2 @80% → Back Squat + accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité hanches/chevilles profonde (90/90, ATG hold, world greatest stretch)',
            'Complexe barre vide : 3× (clean + front squat + jerk)',
            'Montée en charge progressive : 3 séries',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Complexe (Clean + Front Squat + Jerk) : 5×2 @80% — repos 2min30',
            'Back Squat : 4×5 @80% 1RM — repos 2min30',
            'Bulgarian Split Squat : 3×10/jambe — DB lourds',
            'GHD Hip Extension : 3×20',
            'Weighted Plank : 3×45s (15kg)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching profond 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — AMRAP 25min technique',
        baseDuration: 60, baseIntensity: 4,
        objective: 'AMRAP long avec mouvements techniques pour tester la capacité de travail.',
        workflow: "8' rameur + technique → AMRAP 25' (MU, HSPU, OHS) → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 6min',
            'Révision technique : muscle-ups (ou progressions), HSPU, overhead squat',
            'Mini activation : 2min AMRAP léger — 3 strict pull-ups + 3 strict press + 3 OHS barre vide',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'AMRAP 25min :',
            '  3 Bar Muscle-ups (ou 5 C2B Pull-ups)',
            '  5 HSPU (strict ou kipping)',
            '  7 Overhead Squats (50/35kg)',
            '  200m Run',
            'Objectif : rythme soutenable sur 25min, pas de burnout',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'skill', name: 'Skill — Ring Muscle-up & Gymnastics complexes',
        baseDuration: 55, baseIntensity: 3,
        objective: 'Progresser sur le muscle-up strict et les skills gymnastiques avancés.',
        workflow: "10' activation → Ring MU strict drill + Deficit HSPU + Complexe gym → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Mobilité épaules, poignets, thoracique — 5min',
            'Activation : 10 scap pull-ups + 10 strict dips + 10 hollow rocks',
            'Transition drill aux anneaux : 3×5',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Ring Muscle-up strict : 5×2-3 (ou négatifs lents si pas encore acquis)',
            'Deficit HSPU (5cm) : 4×3-5',
            'Complexe gymnastique : 3 rounds (2 MU + 3 HSPU + 5 T2B)',
            'Handstand Walk : 4×10m (ou wall facing hold 4×30s)',
            'L-sit : 4×20s',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching épaules, poignets — 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Deadlift & Clean complexe',
        baseDuration: 65, baseIntensity: 4,
        objective: 'Développer la force de tirage maximale et la puissance clean.',
        workflow: "10' rameur + complexe → Deadlift 5×3 @85% → Squat Clean + accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité hanches/chaîne postérieure',
            'Complexe barre vide : clean deadlift + hang clean + clean',
            'Montée en charge progressive deadlift',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Deadlift : 5×3 @85% — repos 3min',
            'Squat Clean : 5×2 @75% — focus réception basse',
            'Clean Pull : 3×3 @90% DL',
            'Barbell Row : 4×8 @RPE 8',
            'Weighted Plank : 3×1min (20kg)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching postérieur 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — Couplet intense',
        baseDuration: 55, baseIntensity: 5,
        objective: 'Couplet haute intensité 21-15-9 avec GHD en finisher.',
        workflow: "8' rameur + technique → 21-15-9 Thrusters/C2B → GHD finisher → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 6min',
            'Révision technique thrusters et C2B',
            'Mini activation : 2min — 5 thrusters légers + 3 C2B',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'For Time :',
            '  21-15-9',
            '  Thrusters (43/30kg RX)',
            '  Chest-to-bar Pull-ups',
            'Time cap : 10min',
            'Puis : 3×20 GHD Sit-ups (repos 1min)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Snatch & OHS',
        baseDuration: 65, baseIntensity: 4,
        objective: 'Force overhead avec snatch technique et overhead squat lourd.',
        workflow: "10' rameur + Snatch complex → Power Snatch 5×2 + OHS 4×5 + accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 8min',
            'Mobilité épaules overhead ciblée',
            'Snatch Warm-up complex : 3× (snatch DL + hang snatch + OHS) barre vide',
            'Montée en charge progressive snatch',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Power Snatch : 5×2 @75% — repos 2min',
            'Overhead Squat : 4×5 @65%',
            'Snatch Grip Deadlift : 3×5 @80% DL',
            'Strict HSPU : 4×max (ou deficit)',
            'Core : 3 rounds (20 V-ups + 15s L-sit + 10 GHD)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Mobilité épaules 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'crossfit', subType: 'strength', name: 'Force — Max Effort Day',
        baseDuration: 70, baseIntensity: 5,
        objective: 'Jour de max effort : singles lourds en squat et clean & jerk.',
        workflow: "12' rameur + mobilité → Back Squat 3×1 @93% → C&J 5×1 @87% → accessoires → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 10min',
            'Mobilité profonde hanches/chevilles/thoracique',
            'Montée en charge progressive squat : 5 séries',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Back Squat : 3×1 @93-95% — repos 4min',
            'Clean & Jerk : 5×1 @87% — repos 3min',
            'Pistol Squats : 3×5/jambe (weighted si possible)',
            'Strict HSPU : 3×max',
            'Core : GHD Sit-ups 3×20',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Foam rolling complet + stretching 5min',
          ]},
        ],
      }),
      tpl({
        category: 'crossfit', subType: 'wod', name: 'WOD — Chipper compétition',
        baseDuration: 60, baseIntensity: 5,
        objective: 'Chipper de compétition avec bar muscle-ups pour simuler un event.',
        workflow: "8' activation → For Time chipper 5 mouvements (cap 30') → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Rameur 5min',
            'Activation complète : 5 wall balls + 3 burpees + 250m row + 3 pull-ups',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'For Time (cap 30min) :',
            '  50 Wall Balls (9/6kg)',
            '  40 Cal Row',
            '  30 Box Jump Overs (60cm)',
            '  20 Clean & Jerk (60/40kg)',
            '  10 Bar Muscle-ups (ou 15 C2B)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'crossfit', subType: 'skill', name: 'Skill & mobilité avancée',
        baseDuration: 50, baseIntensity: 2,
        objective: 'Récupération active avec skill work léger et mobilité profonde.',
        workflow: "HS walk 10' → Ring MU drill + L-sit → Mobilité deep 15' → Foam rolling 10'",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Handstand walk / freestanding practice : 10min',
            'Ring Muscle-up drill léger : 5×2',
            'L-sit : 4×20s',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Mobility deep : 15min (hanches, thoracique, épaules, poignets)',
            'Foam rolling complet : 10min',
          ]},
        ],
      }),
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════
// ─── HYROX TEMPLATES ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

const hyroxTemplates: Record<Level, LevelTemplates> = {
  // ══════════════════ Débutant (Level 1) ══════════════════
  1: {
    base: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Station découverte — SkiErg & Wall Balls',
        baseDuration: 40, baseIntensity: 2,
        objective: 'Découvrir les stations Hyrox avec un focus technique.',
        workflow: "8' échauf → SkiErg 4×250m → Wall Balls 4×15 → Farmers Carry 3×30m → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing léger 5min',
            'Mobilité hanches, épaules — 3min',
            'Activation : 20 air squats + 10 push-ups',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'SkiErg : 4×250m — repos 1min30 (focus technique)',
            'Wall Balls : 4×15 (6/4kg) — repos 1min',
            'Farmers Carry : 3×30m avec DB légers',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Station — Sled & Rowing',
        baseDuration: 45, baseIntensity: 3,
        objective: 'Progresser sur les stations sled et rameur avec du volume.',
        workflow: "8' échauf → Sled Push/Pull 4×15m → Rowing 4×500m → Burpee BJ 3×5 → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing léger 5min',
            'Mobilité hanches — 3min',
            'Activation : 20 air squats + 10 push-ups + 10 KB swings légers',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Sled Push : 4×15m (poids modéré)',
            'Rowing : 4×500m — repos 1min30',
            'Sled Pull : 4×15m',
            'Burpee Broad Jump : 3×5 (technique)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'hyrox', subType: 'simulation-partial', name: 'Mini simulation 3 stations',
        baseDuration: 45, baseIntensity: 3,
        objective: 'Première simulation partielle avec 3 stations et runs.',
        workflow: "10' footing → 3× (800m Run + 1 station) repos 2' → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Activation : 10 air squats + 5 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '3× (800m Run + 1 station) :',
            '  Station 1 : SkiErg 500m',
            '  Station 2 : Wall Balls ×30',
            '  Station 3 : Rowing 500m',
            'Repos 2min entre chaque circuit',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'hyrox', subType: 'simulation-partial', name: 'Simulation 4 stations',
        baseDuration: 55, baseIntensity: 4,
        objective: 'Simulation 4 stations pour se rapprocher du format compétition.',
        workflow: "10' footing → 4× (1km Run + station) repos 2' → 10' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Activation : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '4× (1km Run + station) :',
            '  SkiErg 500m',
            '  Sled Push 15m',
            '  Wall Balls ×30',
            '  Rowing 500m',
            'Repos 2min entre chaque circuit',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 5min',
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Stations légères technique',
        baseDuration: 35, baseIntensity: 1,
        objective: 'Travail technique léger sur les stations sans fatigue.',
        workflow: "Wall Balls 3×10 → Rowing 3×500m → Farmers Carry 3×30m → 10' stretching",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Wall Balls : 3×10 léger — focus technique',
            'Rowing : 3×500m facile',
            'Farmers Carry : 3×30m léger',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 10min',
          ]},
        ],
      }),
    ],
  },

  // ══════════════════ Intermédiaire (Level 2) ══════════════════
  2: {
    base: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Station — SkiErg, Wall Balls & Sled',
        baseDuration: 50, baseIntensity: 3,
        objective: 'Développer la maîtrise des stations principales à allure modérée.',
        workflow: "8' échauf → SkiErg 4×500m → Wall Balls 4×20 → Sled Push 4×25m → Farmers 3×50m → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing 5min',
            'Mobilité hanches, épaules — 3min',
            'Activation neuromusculaire : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'SkiErg : 4×500m — repos 1min30',
            'Wall Balls : 4×20 (9/6kg) — repos 1min',
            'Sled Push : 4×25m (poids compétition)',
            'Farmers Carry : 3×50m (24/16kg KB)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Station — Sled, Rowing & Burpee BJ',
        baseDuration: 55, baseIntensity: 4,
        objective: 'Augmenter le volume sur les stations à allure compétition.',
        workflow: "8' échauf → Sled Push/Pull + Rowing + Burpee BJ + Sandbag Lunges → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing 5min',
            'Mobilité — 3min',
            'Activation : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'Sled Push : 4×25m @compétition — repos 1min30',
            'Rowing : 4×500m — repos 1min',
            'Sled Pull : 4×25m',
            'Burpee Broad Jump : 4×25m',
            'Sandbag Lunges : 3×25m (20kg)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'hyrox', subType: 'simulation-partial', name: 'Simulation 4 stations',
        baseDuration: 60, baseIntensity: 4,
        objective: 'Simulation 4 stations avec 1km run entre chaque.',
        workflow: "10' footing → 4× (1km Run + station) repos 1'30 → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Activation : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '4× (1km Run à allure Hyrox + station) :',
            '  Station 1 : SkiErg 1000m',
            '  Station 2 : Sled Push 25m',
            '  Station 3 : Burpee Broad Jump 25m',
            '  Station 4 : Rowing 1000m',
            'Repos 1min30 entre circuits',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 3min',
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'hyrox', subType: 'simulation-partial', name: 'Simulation 5 stations',
        baseDuration: 70, baseIntensity: 5,
        objective: 'Simulation 5 stations à allure compétition avec repos réduit.',
        workflow: "10' footing → 5× (1km Run + station) repos 1' → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Activation : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '5× (1km Run + station) :',
            '  SkiErg 1000m',
            '  Sled Push 25m',
            '  Sled Pull 25m',
            '  Burpee Broad Jump 25m',
            '  Wall Balls ×75 (9/6kg)',
            'Repos 1min entre circuits',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Marche 5min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'hyrox', subType: 'full-simulation', name: 'Full Hyrox Simulation',
        baseDuration: 80, baseIntensity: 5,
        objective: 'Simulation complète 8 stations à allure compétition, objectif chrono.',
        workflow: "8× (1km Run + Station) — full race simulation chronométrée",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            '8× (1km Run + Station) — full race simulation',
            '1. SkiErg 1000m',
            '2. Sled Push 25m',
            '3. Sled Pull 25m',
            '4. Burpee Broad Jump 80m',
            '5. Rowing 1000m',
            '6. Farmers Carry 200m (2×24kg)',
            '7. Sandbag Lunges 100m (20kg)',
            '8. Wall Balls ×100 (9/6kg)',
            'Transitions rapides — objectif chrono',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Stations légères récup',
        baseDuration: 35, baseIntensity: 2,
        objective: 'Récupération active avec stations légères et focus technique.',
        workflow: "Wall Balls 3×15 → Rowing 3×500m → Farmers 3×40m → SkiErg 3×300m → 5' stretching",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Wall Balls : 3×15 léger',
            'Rowing : 3×500m facile',
            'Farmers Carry : 3×40m léger',
            'SkiErg : 3×300m facile',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
  },

  // ══════════════════ Avancé (Level 3) ══════════════════
  3: {
    base: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Station haute volume — Toutes stations Hyrox',
        baseDuration: 60, baseIntensity: 4,
        objective: 'Construire un volume élevé sur toutes les stations dès la base.',
        workflow: "8' échauf → SkiErg 4×1000m → Sled 4×25m → Wall Balls 4×30 → Rowing + Burpee BJ + Farmers → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing 5min',
            'Mobilité hanches, épaules — 3min',
            'Activation neuromusculaire : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'SkiErg : 4×1000m — repos 1min (focus puissance)',
            'Sled Push : 4×25m @compétition — repos 1min',
            'Sled Pull : 3×25m — repos 1min',
            'Wall Balls : 4×30 (9/6kg) — repos 45s',
            'Rowing : 3×500m — repos 1min',
            'Burpee Broad Jump : 3×25m',
            'Farmers Carry : 3×200m (2×24kg)',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'hyrox', subType: 'station', name: 'Station transitions rapides',
        baseDuration: 50, baseIntensity: 4,
        objective: 'Travailler les transitions rapides entre stations enchaînées.',
        workflow: "8' échauf → 4 rounds (2 stations enchaînées sans repos) → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing 5min',
            'Mobilité — 3min',
            'Activation : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '4 rounds — enchaînement sans repos entre les 2 stations :',
            '  Round 1 : SkiErg 500m → Wall Balls ×20 (repos 2min)',
            '  Round 2 : Sled Push 25m → Rowing 500m (repos 2min)',
            '  Round 3 : Farmers Carry 100m → Burpee BJ ×10 (repos 2min)',
            '  Round 4 : Sandbag Lunges 50m → SkiErg 500m (repos 2min)',
            'Objectif : transition < 10s entre les 2 stations',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    build: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Station Race Pace — Toutes stations',
        baseDuration: 60, baseIntensity: 5,
        objective: 'Toutes les stations à race pace avec repos réduit.',
        workflow: "8' échauf → Stations race pace (repos 1') → 5' stretching",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing 5min',
            'Mobilité — 3min',
            'Activation : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            'SkiErg : 3×1000m à race pace — repos 1min',
            'Sled Push : 4×25m sprint — repos 1min',
            'Sled Pull : 4×25m — repos 1min',
            'Burpee BJ : 3×25m — repos 1min',
            'Sandbag Lunges : 3×50m (20kg)',
            'Wall Balls : 2×50 unbroken',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'hyrox', subType: 'simulation-partial', name: 'Simulation 5 stations race pace',
        baseDuration: 70, baseIntensity: 5,
        objective: 'Simulation 5 stations avec runs à allure compétition et transitions chronométrées.',
        workflow: "10' footing → 5× (1km Run race pace + station) transitions < 15s → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Activation : 20 air squats + 10 push-ups + 10 KB swings',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '5× (1km Run @race pace + station) :',
            '  SkiErg 1000m',
            '  Sled Push 25m',
            '  Rowing 1000m',
            '  Burpee BJ 80m',
            '  Wall Balls ×75',
            'Transitions < 15s — chronométré',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 5min',
            'Stretching complet 5min',
          ]},
        ],
      }),
    ],
    peak: [
      tpl({
        category: 'hyrox', subType: 'simulation-partial', name: 'Simulation 6 stations compétition',
        baseDuration: 75, baseIntensity: 5,
        objective: 'Simulation 6 stations à allure compétition avec transitions < 10s.',
        workflow: "8' footing → 6× (1km Run + station) @race pace transitions < 10s → 10' retour calme",
        sections: [
          { title: 'Échauffement', type: 'warmup', items: [
            'Footing progressif 8min',
            'Activation : 10 air squats + 5 burpees',
          ]},
          { title: 'Corps de séance', type: 'main', items: [
            '6× (1km Run + station) @race pace :',
            '  SkiErg 1000m, Sled Push 25m, Sled Pull 25m',
            '  Burpee BJ 80m, Rowing 1000m, Wall Balls ×100',
            'Transitions < 10s',
            'Objectif : gérer son effort sur la durée',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Footing léger 5min',
            'Stretching complet 5min',
          ]},
        ],
      }),
      tpl({
        category: 'hyrox', subType: 'full-simulation', name: 'Full Hyrox Race Simulation',
        baseDuration: 90, baseIntensity: 5,
        objective: 'Simulation complète race day : 8 stations, full effort, objectif chrono compétition.',
        workflow: "8× (1km Run + Station) — FULL RACE EFFORT chronométré",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            '8× (1km Run + Station) — FULL RACE EFFORT',
            '1. SkiErg 1000m',
            '2. Sled Push 25m',
            '3. Sled Pull 25m',
            '4. Burpee Broad Jump 80m',
            '5. Rowing 1000m',
            '6. Farmers Carry 200m (2×24/16kg)',
            '7. Sandbag Lunges 100m (20kg)',
            '8. Wall Balls ×100 (9/6kg)',
            'Chronométré — objectif chrono compétition',
          ]},
        ],
      }),
    ],
    deload: [
      tpl({
        category: 'hyrox', subType: 'station', name: 'Stations technique légère',
        baseDuration: 40, baseIntensity: 2,
        objective: 'Travail technique léger sur les stations pour la récupération.',
        workflow: "SkiErg 3×500m → Wall Balls 3×15 → Rowing 3×500m → Farmers 3×40m → 10' stretching",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'SkiErg : 3×500m facile — focus technique bras',
            'Wall Balls : 3×15 léger — focus squat profond',
            'Rowing : 3×500m — focus drive jambes',
            'Farmers Carry : 3×40m léger',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Stretching complet 10min',
          ]},
        ],
      }),
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════
// ─── Generator ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════

function pick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function createSession(template: SessionTemplate, week: number, day: number, isDouble = false): Session {
  // Generate flat exercises from sections for retro-compat
  const exercises = template.sections.flatMap(s => s.items);

  return {
    id: uid(),
    week,
    day,
    category: template.category,
    subType: template.subType,
    name: template.name,
    duration: template.baseDuration,
    intensity: template.baseIntensity,
    distance: template.distance,
    exercises,
    sections: template.sections.map(s => ({ ...s, items: [...s.items] })),
    objective: template.objective,
    workflow: template.workflow,
    status: 'planned',
    notes: '',
    isDouble,
  };
}

function generateWeek(week: number, profile: UserProfile): WeekPlan {
  const block = getBlockForWeek(week);
  const level = profile.globalLevel;
  const sessions: Session[] = [];

  // ── Running: Mon=0, Wed=2, Sat=5 ──
  const runPool = runTemplates[level][block];
  const runCount = block === 'deload' ? 2 : (level === 1 && block === 'base' ? 2 : 3);
  const runDays = runCount === 3 ? [0, 2, 5] : [0, 5];
  const selectedRuns = pick(runPool, Math.min(runCount, runPool.length));
  selectedRuns.forEach((tpl, i) => {
    sessions.push(createSession(tpl, week, runDays[i]));
  });

  // ── CrossFit: Tue=1, Thu=3 ──
  const cfPool = crossfitTemplates[level][block];
  const cfCount = block === 'deload' ? 1 : 2;
  const cfDays = cfCount === 2 ? [1, 3] : [1];
  const selectedCF = pick(cfPool, Math.min(cfCount, cfPool.length));
  selectedCF.forEach((tpl, i) => {
    sessions.push(createSession(tpl, week, cfDays[i]));
  });

  // ── Hyrox: Fri=4 (+ Sat=5 for peak) ──
  const hyroxPool = hyroxTemplates[level][block];
  const hyroxCount = block === 'peak' ? 2 : (block === 'deload' ? 1 : 1);
  const hyroxDays = hyroxCount === 2 ? [4, 5] : [4];

  // If hyrox takes Saturday, move the Saturday run to Wed
  if (hyroxCount === 2 && runCount === 3) {
    const satRunIdx = sessions.findIndex(s => s.category === 'run' && s.day === 5);
    if (satRunIdx !== -1) {
      sessions[satRunIdx].day = 2; // merge on Wed
    }
  }
  const selectedHyrox = pick(hyroxPool, Math.min(hyroxCount, hyroxPool.length));
  selectedHyrox.forEach((tpl, i) => {
    sessions.push(createSession(tpl, week, hyroxDays[i]));
  });

  // ── Double sessions (avancé, build/peak) ──
  if (level === 3 && (block === 'build' || block === 'peak')) {
    // Tuesday: add a short Z2 run as 2nd session
    if (block === 'peak') {
      const doubleRunTpl: SessionTemplate = {
        category: 'run', subType: 'endurance',
        name: 'Course Z2 — double séance',
        baseDuration: 30, baseIntensity: 2, distance: 5.5,
        objective: 'Footing Z2 léger en complément de la séance CrossFit.',
        workflow: "25' Z2 → 5' retour calme",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Footing Z2 léger 25min',
          ]},
          { title: 'Retour au calme', type: 'cooldown', items: [
            'Retour au calme 5min',
          ]},
        ],
        exercises: ['Footing Z2 léger 25min', 'Retour au calme 5min'],
      };
      sessions.push(createSession(doubleRunTpl, week, 1, true));
    }
    // Thursday: add hyrox station work
    if (block === 'peak') {
      const doubleHyroxTpl: SessionTemplate = {
        category: 'hyrox', subType: 'station',
        name: 'Hyrox stations — double séance',
        baseDuration: 30, baseIntensity: 3,
        objective: 'Mini session stations Hyrox pour maintenir le contact technique.',
        workflow: "Wall Balls 3×20 → SkiErg 3×300m → Farmers 3×40m",
        sections: [
          { title: 'Corps de séance', type: 'main', items: [
            'Wall Balls 3×20',
            'SkiErg 3×300m',
            'Farmers Carry 3×40m',
          ]},
        ],
        exercises: ['Wall Balls 3×20', 'SkiErg 3×300m', 'Farmers Carry 3×40m'],
      };
      sessions.push(createSession(doubleHyroxTpl, week, 3, true));
    }
    // Saturday: add skill work
    const doubleSkillTpl: SessionTemplate = {
      category: 'crossfit', subType: 'skill',
      name: 'Skill gymnastique — double séance',
      baseDuration: 30, baseIntensity: 2,
      objective: 'Travail skill léger pour maintenir les acquis gymnastiques.',
      workflow: "Handstand 10' → Muscle-up drill 10' → L-sit + core 10'",
      sections: [
        { title: 'Corps de séance', type: 'main', items: [
          'Handstand practice 10min',
          'Muscle-up drill 10min',
          'L-sit + core 10min',
        ]},
      ],
      exercises: ['Handstand practice 10min', 'Muscle-up drill 10min', 'L-sit + core 10min'],
    };
    sessions.push(createSession(doubleSkillTpl, week, 5, true));
  }

  // ── Recovery: Sunday (6) ──
  const recoverySubType = block === 'deload' ? 'rest' : 'mobility';
  const recoveryName = block === 'deload' ? 'Repos complet' : 'Mobilité & stretching';
  const recoveryDuration = block === 'deload' ? 0 : 30;
  const recoverySections: SessionSection[] = block === 'deload'
    ? [{ title: 'Corps de séance', type: 'main', items: ['Repos total ou marche légère 20min'] }]
    : [
        { title: 'Corps de séance', type: 'main', items: [
          'Foam rolling : 10min',
          'Étirements full body : 15min',
          'Respiration / relaxation : 5min',
        ]},
      ];
  const recoveryExercises = recoverySections.flatMap(s => s.items);

  sessions.push({
    id: uid(),
    week,
    day: 6,
    category: 'recovery',
    subType: recoverySubType,
    name: recoveryName,
    duration: recoveryDuration,
    intensity: 1,
    exercises: recoveryExercises,
    sections: recoverySections,
    objective: block === 'deload' ? 'Repos complet pour la récupération.' : 'Récupération active avec mobilité et relaxation.',
    workflow: block === 'deload' ? 'Repos total ou marche légère' : "Foam rolling 10' → Étirements 15' → Respiration 5'",
    status: 'planned',
    notes: '',
  });

  // Sort by day, then main session before double
  sessions.sort((a, b) => a.day - b.day || (a.isDouble ? 1 : 0) - (b.isDouble ? 1 : 0));

  return { week, block, sessions };
}

export function generatePlan(profile: UserProfile): Plan {
  idCounter = 0;
  return Array.from({ length: 10 }, (_, i) => generateWeek(i + 1, profile));
}
