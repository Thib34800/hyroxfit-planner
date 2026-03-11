# HyroxFit Planner — Architecture & Règles métier

## Stack technique
- **React 18** (Vite) + **TypeScript**
- **Tailwind CSS** — thème sombre, accent orange (#F97316)
- **recharts** — graphiques (PieChart, BarChart)
- **date-fns** — gestion des dates, locale `fr`
- **lucide-react** — icônes
- **localStorage** — persistance (pas de backend)

## Structure du projet

```
src/
├── types/index.ts          # Types TS, constantes, helpers
├── utils/generatePlan.ts   # Générateur de plan 10 semaines
├── hooks/
│   ├── useLocalStorage.ts  # Hook localStorage générique
│   ├── usePlan.ts          # CRUD plan + sessions
│   └── useStats.ts         # Calculs statistiques
├── components/
│   ├── Layout.tsx           # Header + bottom nav
│   ├── SessionCard.tsx      # Carte séance (compact + full)
│   └── SessionModal.tsx     # Modal détail + timer
├── views/
│   ├── WelcomeScreen.tsx    # Écran initial (génère le plan)
│   ├── PlanView.tsx         # Vue 10 semaines (grille 7 jours)
│   ├── TodayView.tsx        # Séances du jour avec sélecteur
│   ├── DashboardView.tsx    # Stats, graphiques, badges
│   └── HistoryView.tsx      # Historique filtrable
└── App.tsx                  # Router (state-based)
```

## Logique de génération du plan

### 3 blocs + deload
| Bloc    | Semaines | Volume   | Intensité |
|---------|----------|----------|-----------|
| Base    | 1-3      | Modéré   | 2-3/5     |
| Build   | 4-6      | Croissant| 3-4/5     |
| Peak    | 7-9      | Maximum  | 4-5/5     |
| Deload  | 10       | Réduit   | 1-2/5     |

### Répartition hebdomadaire par défaut
| Jour     | Base           | Build          | Peak           | Deload        |
|----------|----------------|----------------|----------------|---------------|
| Lundi    | Course         | Course         | Course         | Course        |
| Mardi    | CrossFit       | CrossFit       | CrossFit       | CrossFit Skill|
| Mercredi | (Course si 3)  | Course         | Course         | —             |
| Jeudi    | CrossFit       | CrossFit       | CrossFit       | —             |
| Vendredi | Hyrox station  | Hyrox          | Hyrox sim      | Hyrox léger   |
| Samedi   | Course         | Course/Hyrox   | Hyrox full sim | Course        |
| Dimanche | Récupération   | Récupération   | Récupération   | Repos complet |

### Règles métier critiques
1. **Minimum 2-3 courses/semaine** — Obligatoire, réparties lun/mer/sam
2. **2 séances CrossFit** — 1 force + 1 WOD minimum
3. **1-2 séances Hyrox** — Stations isolées → simulations en phase peak
4. **1 jour récupération** — Dimanche systématique
5. **Progression** — Volume et intensité croissent de base → peak
6. **Deload (S10)** — Volume réduit, intensité basse, pas de simulation full

### Types de séances
- **Course** : `endurance` (Z2), `intervals` (fractionné), `tempo`, `hyrox-run` (simulation)
- **CrossFit** : `wod` (AMRAP/ForTime/EMOM), `strength` (force), `skill` (gymnastique)
- **Hyrox** : `station` (isolée), `simulation-partial` (3-4 stations), `full-simulation` (8 stations)
- **Récupération** : `mobility`, `rest`

## Clés localStorage
- `hyroxfit_plan` — Plan complet (WeekPlan[])
- `hyroxfit_startDate` — Date de début du programme

## Codes couleur
| Catégorie     | Couleur  | Tailwind            |
|---------------|----------|---------------------|
| Course        | Bleu     | `bg-session-run`    |
| CrossFit      | Orange   | `bg-session-crossfit` |
| Hyrox         | Violet   | `bg-session-hyrox`  |
| Récupération  | Vert     | `bg-session-recovery` |

## Navigation
4 vues via bottom nav : Plan 10 sem. | Aujourd'hui | Dashboard | Historique

## Commandes
```bash
npm install     # Installer les dépendances
npm run dev     # Serveur de développement
npm run build   # Build production
```
