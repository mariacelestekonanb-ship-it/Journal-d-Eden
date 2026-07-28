# EJP Hub

Application SaaS de centralisation de l'organisation des conducteurs de prière de l'EJP.

> **Statut : fondations.** Cette base ne contient volontairement aucune fonctionnalité
> métier (planning, sujets de prière, comptes rendus, témoignages, administration) —
> uniquement une architecture, un design system et des pages vides prêts à les accueillir.
> Voir [ROADMAP.md](./ROADMAP.md) pour la suite.
>
> Ce projet vit dans `ejp-hub/`, à côté de LexWatch (à la racine du dépôt), en attendant que
> l'organisation définitive du dépôt soit décidée. Les deux projets sont totalement
> indépendants (dépendances, build, déploiement).

## Stack

- **Next.js 15** (App Router) — routage par groupes `(auth)` / `(app)`.
- **TypeScript strict** — aucun `any`, `noUncheckedIndexedAccess` activé.
- **Tailwind CSS v4** — variables CSS, dark mode natif.
- **shadcn/ui** — primitives réécrites à la main (pas d'accès réseau au registre dans
  cet environnement), alignées sur les conventions officielles.
- **Supabase** — Auth, Database (Postgres + RLS), Storage.
- **React Query** — état serveur / cache.
- **React Hook Form + Zod** — formulaires et validation.
- **Lucide React** — icônes.
- **Sonner** — notifications toast.
- **next-themes** — clair / sombre / système.
- **date-fns** — formatage de dates (locale `fr`).

## Démarrage

```bash
cd ejp-hub
npm install
cp .env.example .env.local   # renseigner les clés Supabase (optionnel pour consulter le shell)
npm run dev
```

Le shell de l'application (sidebar, header, pages) est consultable **sans** configurer
Supabase : un profil de démonstration est utilisé tant qu'aucune session réelle n'existe
(voir `src/shared/constants/placeholder-profile.ts` et `ARCHITECTURE.md`).

## Scripts

| Script | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run typecheck` | Vérification TypeScript stricte |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (écriture) |
| `npm run validate` | `typecheck` + `lint` |

## Base de données

Le schéma complet (tables, triggers, RLS, storage) est dans `src/docs/database.sql`. Exécutez-le
dans l'éditeur SQL de votre projet Supabase avant de brancher l'authentification et les futurs
modules. Une fois le projet lié, régénérez `src/shared/types/database.ts` avec
`supabase gen types typescript`.

## Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — organisation du code et choix techniques.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — conventions de contribution.
- [`ROADMAP.md`](./ROADMAP.md) — ce qui est fait, ce qui reste.

## Rôles

Deux rôles : `admin` (accès complet) et `conducteur` (accès limité — sera précisé module
par module au fil des sprints). Le menu **Administration** est déjà filtré par rôle dans la
sidebar (`src/shared/components/layout/nav-items.ts`).
