# Plan d'implémentation — Nouvelles fonctionnalités HyroxFit Planner

## Vue d'ensemble

4 grands chantiers :
1. **Questionnaire de niveau** → adapte le plan d'entraînement
2. **Séances enrichies** → plus détaillées, plus longues (50min-1h15), niveau relevé, doubles séances possibles, 6 jours entraînés + dimanche repos
3. **WOD Roulette** → générateur aléatoire de WOD CrossFit
4. **Minuteur complet** → AMRAP, EMOM, FOR TIME, TABATA (vue dédiée)

---

## 1. Questionnaire de niveau

### Concept
Multi-step form sur le WelcomeScreen AVANT la génération du plan. 5-6 questions rapides qui évaluent :
- **Niveau course à pied** : fréquence, allure, distance max
- **Niveau force/CrossFit** : expérience, charges, mouvements maîtrisés
- **Expérience Hyrox** : déjà fait une course ? entraîné aux stations ?
- **Disponibilité** : confirmation des 6 jours/semaine

### Questions prévues

**Q1 — Course à pied** (choix unique)
- Débutant : je cours < 2 fois/semaine, < 5km
- Intermédiaire : je cours 2-3 fois/semaine, 5-10km confortable
- Avancé : je cours 3+ fois/semaine, 10km+ facile, tempo < 5:00/km

**Q2 — Allure 5km** (choix unique)
- > 30 min (> 6:00/km)
- 25-30 min (5:00-6:00/km)
- 20-25 min (4:00-5:00/km)
- < 20 min (< 4:00/km)

**Q3 — Niveau force** (choix unique)
- Débutant : peu d'expérience en musculation/CrossFit
- Intermédiaire : je maîtrise squat, deadlift, press. 1-2 ans de pratique
- Avancé : 2+ ans de CrossFit, à l'aise sur les mouvements olympiques

**Q4 — Mouvements maîtrisés** (choix multiples)
- Pull-ups stricts
- Muscle-ups (ring ou bar)
- Double-unders
- Handstand push-ups
- Snatch / Clean & Jerk
- Toes-to-bar

**Q5 — Expérience Hyrox** (choix unique)
- Jamais participé, je découvre
- J'ai fait 1-2 courses Hyrox
- Compétiteur régulier / objectif chrono

**Q6 — Objectif** (choix unique)
- Finir ma première course Hyrox
- Améliorer mon chrono (< 1h30)
- Performer (< 1h15 / podium)

### Scoring
Chaque réponse donne un score. On calcule :
- `runLevel` : 1 (débutant) | 2 (intermédiaire) | 3 (avancé)
- `strengthLevel` : 1 | 2 | 3
- `hyroxLevel` : 1 | 2 | 3
- `globalLevel` : moyenne pondérée → 1 (débutant) | 2 (intermédiaire) | 3 (avancé)

### Impact sur le plan
- **Débutant** : séances 50min, intensité modérée, 1 séance/jour max, exercices simplifiés (scaled)
- **Intermédiaire** : séances 50-60min, intensité croissante, quelques doubles certains jours (build/peak)
- **Avancé** : séances 60-75min, haute intensité, doubles séances sur 2-3 jours/semaine en phase build/peak, mouvements RX

### Stockage
- Nouveau type `UserProfile` dans `types/index.ts`
- Stocké dans localStorage (`hyroxfit_profile`)
- `generatePlan(profile: UserProfile)` prend le profil en paramètre

### Fichiers modifiés
- `src/types/index.ts` — ajout UserProfile, QuestionnaireAnswer
- `src/views/WelcomeScreen.tsx` — refonte complète : multi-step questionnaire
- `src/utils/generatePlan.ts` — refonte : accepte UserProfile, templates x3 niveaux
- `src/hooks/usePlan.ts` — initPlan prend un UserProfile
- `src/App.tsx` — passe le profil à initPlan

---

## 2. Séances enrichies & détaillées

### Principes
- **Durée** : 50min minimum → 75min max (hors warm-up/cool-down déjà inclus)
- **Détail** : chaque exercice inclut sets, reps, charge (% ou RPE), repos, allure
- **6 jours entraînés** : Lundi à Samedi toujours une séance. Dimanche = repos
- **Doubles séances** : pour les profils avancés, certains jours auront 2 séances (ex: force matin + cardio soir)
- **Niveau relevé** : les templates actuels sont trop simples, on crée 3 niveaux de templates

### Répartition hebdomadaire (tous niveaux)
| Jour | Séance principale | Double (avancé, build/peak) |
|------|------------------|-----------------------------|
| Lun  | Course           | —                           |
| Mar  | CrossFit Force   | Course (avancé peak)        |
| Mer  | Course intervals  | —                           |
| Jeu  | CrossFit WOD     | Hyrox station (avancé peak) |
| Ven  | Hyrox spécifique | —                           |
| Sam  | Longue/Simu      | CrossFit skill (avancé)     |
| Dim  | Repos complet    | —                           |

### Templates enrichis (exemple intermédiaire, bloc Build)
Les exercises passeront de 3 lignes à 8-12 lignes détaillées :
```
Force — Back Squat & Accessoires (60min)
1. Échauffement : 10min rameur + mobilité hanches
2. Back Squat : 5x5 @ 75% 1RM — repos 2min30
3. Front Squat : 3x8 @ 60% 1RM — repos 2min
4. Bulgarian Split Squat : 3x10/jambe — RPE 7
5. GHD Hip Extension : 3x15
6. Plank weighted : 3x45s (10kg)
7. Cool-down : étirements quadriceps/ischio 5min
```

### Fichiers modifiés
- `src/utils/generatePlan.ts` — refonte majeure des templates (3 niveaux × 4 blocs × catégories)
- `src/types/index.ts` — éventuellement ajout champ `warmup` / `cooldown` sur Session

---

## 3. WOD Roulette

### Concept
Nouvelle vue accessible depuis la bottom nav. Génère un WOD CrossFit aléatoire avec :
- **Type** : AMRAP / For Time / EMOM / Chipper / Couplet / Triplet
- **Durée** : configurable (10-30min)
- **Mouvements** : piochés dans une banque de ~40 mouvements
- **Scaled/RX** : adapté au profil utilisateur
- Bouton "Relancer" pour régénérer
- Bouton "Lancer le timer" qui ouvre directement le minuteur approprié

### Banque de mouvements
Organisée par catégories :
- **Gym** : Pull-ups, Push-ups, HSPU, T2B, Muscle-ups, Burpees, Box Jumps, Double-unders
- **Haltéro** : Thrusters, Clean & Jerk, Snatch, Deadlift, OHS, Wall Balls
- **Cardio** : Row, Bike, SkiErg, Run
- **Kettlebell** : KB Swing, Turkish Get-up, Goblet Squat

Chaque mouvement a une version scaled et RX avec reps/charge adaptées.

### Navigation
Ajout d'un 5e item dans la bottom nav :
- Icône : `Dice` (lucide-react)
- Label : "WOD"

### Fichiers créés/modifiés
- `src/views/WodRouletteView.tsx` — **nouveau** : vue complète
- `src/utils/wodGenerator.ts` — **nouveau** : logique de génération
- `src/types/index.ts` — ajout View 'wod', types WodMovement, GeneratedWod
- `src/components/Layout.tsx` — ajout 5e nav item
- `src/App.tsx` — ajout rendu WodRouletteView

---

## 4. Minuteur dédié (AMRAP / EMOM / FOR TIME / TABATA)

### Concept
Nouvelle vue "Timer" dans la bottom nav. 4 modes de timer :

**AMRAP** (As Many Rounds As Possible)
- L'utilisateur définit la durée (ex: 12min)
- Compte à rebours
- Compteur de rounds cliquable
- Bip à chaque minute + bip final

**EMOM** (Every Minute On the Minute)
- Durée totale + nombre de minutes
- Compte à rebours par minute (60s → 0 → reset)
- Affiche le round actuel / total
- Bip au début de chaque minute

**FOR TIME**
- Chronomètre ascendant (pas de limite)
- Bouton "Terminé" pour arrêter
- Affichage du temps final

**TABATA**
- 8 rounds par défaut (configurable)
- 20s travail / 10s repos (configurable)
- Alternance visuelle rouge (travail) / vert (repos)
- Bip aux transitions

### UI
- Écran principal : 4 cards pour choisir le mode
- Chaque mode : écran de config (durée, rounds) → écran timer plein écran
- Gros chiffres centrés, couleur selon état (actif/repos/terminé)
- Sons/vibration aux transitions (via Web Audio API)

### Navigation
Ajout d'un 6e item dans la bottom nav :
- Icône : `Timer` (lucide-react)
- Label : "Timer"

→ Total bottom nav : Plan | Aujourd'hui | Dashboard | Historique | WOD | Timer

### Fichiers créés/modifiés
- `src/views/TimerView.tsx` — **nouveau** : vue avec les 4 modes
- `src/utils/timerSounds.ts` — **nouveau** : bips via Web Audio API
- `src/types/index.ts` — ajout View 'timer', types TimerMode, TimerConfig
- `src/components/Layout.tsx` — ajout 6e nav item
- `src/App.tsx` — ajout rendu TimerView

---

## Ordre d'implémentation

1. **Types & profil** — Mettre à jour types/index.ts avec tous les nouveaux types
2. **Questionnaire** — Refonte WelcomeScreen + scoring
3. **Séances enrichies** — Refonte generatePlan.ts avec templates détaillés × 3 niveaux
4. **Branchement** — usePlan + App.tsx pour passer le profil
5. **WOD Roulette** — wodGenerator + vue + nav
6. **Minuteur** — TimerView + sons + nav
7. **Test & polish** — Vérification visuelle, responsive, cohérence

---

## Fichiers impactés (résumé)

| Fichier | Action |
|---------|--------|
| `src/types/index.ts` | Modifié (nouveaux types) |
| `src/views/WelcomeScreen.tsx` | Refonte (questionnaire) |
| `src/utils/generatePlan.ts` | Refonte (3 niveaux, templates enrichis) |
| `src/hooks/usePlan.ts` | Modifié (accepte UserProfile) |
| `src/App.tsx` | Modifié (nouvelles vues, profil) |
| `src/components/Layout.tsx` | Modifié (6 items nav) |
| `src/views/WodRouletteView.tsx` | **Nouveau** |
| `src/utils/wodGenerator.ts` | **Nouveau** |
| `src/views/TimerView.tsx` | **Nouveau** |
| `src/utils/timerSounds.ts` | **Nouveau** |
