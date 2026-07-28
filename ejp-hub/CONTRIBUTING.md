# Contribuer à EJP Hub

## Prérequis

- Node.js ≥ 18.18
- Un projet Supabase (optionnel pour travailler sur le shell/UI, requis pour l'authentification
  et les futures features)

## Mise en route

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Langue

- **Interface (UI)** : entièrement en français (« Sujets de prière », pas « Prayer topics »).
- **Code** : entièrement en anglais (noms de fichiers, variables, fonctions, types).

Exemple : le dossier `features/prayer-topics/` affiche « Sujets de prière » à l'écran.

## Conventions de code

- **Feature First** : tout code propre à un seul module vit dans
  `src/features/<module>/`. Le code partagé par plusieurs modules va dans `src/shared/`.
- **TypeScript strict, zéro `any`.** Si un type est difficile à exprimer, préférez `unknown`
  et un garde de type explicite.
- **Composants réutilisables** : utilisez le design system (`AppButton`, `AppCard`,
  `AppEmptyState`, …) plutôt que des primitives shadcn brutes directement dans les pages.
- **Pas de couleur codée en dur** — toujours passer par les tokens Tailwind
  (`bg-primary`, `text-muted-foreground`, `border-border`, …).
- **Toujours prévoir** : un état de chargement (`AppLoader` ou squelette), un état vide
  (`AppEmptyState`), un état d'erreur, et une confirmation avant toute suppression.
- **Commentaires** : uniquement quand ils expliquent un « pourquoi » non évident (contrainte
  cachée, contournement). Ne pas commenter ce que le code dit déjà par lui-même.
- **Pas de duplication** : si une même logique apparaît deux fois, elle doit être extraite
  dans `shared/`.

## Avant de committer

```bash
npm run validate   # typecheck + lint
npm run build      # vérifie que le build de production passe
```

## Ajouter un nouveau module

1. Créer `src/features/<module>/` avec les sous-dossiers pertinents
   (`components/`, `hooks/`, `services/`, `types/`, `validation/`, `actions/`).
2. Ajouter la route dans `src/app/(app)/<route>/page.tsx`.
3. Ajouter l'entrée de navigation dans
   `src/shared/components/layout/nav-items.ts` (avec les rôles autorisés).
4. Si le module a besoin de nouvelles tables, les ajouter à
   `src/docs/database.sql` puis régénérer `src/shared/types/database.ts`.

## Git

- Messages de commit clairs, en français, qui expliquent le *pourquoi* du changement.
- Une pull request par module ou par sujet cohérent.
