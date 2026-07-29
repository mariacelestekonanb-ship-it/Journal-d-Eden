# EJP Hub

Application SaaS de centralisation de l'organisation des conducteurs de prière de l'EJP.

> **Statut : V1 complète.** Les 7 modules métier (Tableau de bord, Planning, Sujets de
> prière, Comptes rendus, Membres, Notifications, Administration) sont développés,
> intégrés et vérifiés. Seul le module **Témoignages** reste un état vide en attente d'un
> futur sprint dédié — voir [`PROJECT.md`](./PROJECT.md) pour la vue d'ensemble du produit
> et [`ROADMAP.md`](./ROADMAP.md) pour l'historique des sprints.
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
- **TanStack Table** — tableaux triables/paginables (Membres, Planning, Comptes rendus, Sujets de prière, Notifications).
- **FullCalendar** — vues Calendrier/Semaine/Mois du Planning (chargé en `next/dynamic`, jamais dans le bundle initial).
- **Recharts** — graphiques d'évolution (chargés en `next/dynamic`).
- **Framer Motion** — animations d'entrée des cartes et statistiques.
- **Lucide React** — icônes.
- **Sonner** — notifications toast.
- **next-themes** — clair / sombre / système.
- **date-fns** — formatage de dates (locale `fr`).

## Modules

| Module | Route | Rôles | Documentation |
| --- | --- | --- | --- |
| Tableau de bord | `/` | Tous | — |
| Planning | `/planning` | Tous (édition réservée aux conducteurs assignés/admin) | [`PLANNING.md`](./PLANNING.md) |
| Sujets de prière | `/sujets-de-priere` | Tous | [`PRAYER_TOPICS.md`](./PRAYER_TOPICS.md) |
| Comptes rendus | `/comptes-rendus` | Tous (rédaction réservée au conducteur assigné) | [`REPORTS.md`](./REPORTS.md) |
| Membres | `/administration/membres` | `ADMIN` (accès à tous) / soi-même | [`MEMBERS.md`](./MEMBERS.md) |
| Notifications | `/notifications` | Tous (strictement personnel) | [`NOTIFICATIONS.md`](./NOTIFICATIONS.md) |
| Administration | `/administration` | `ADMIN` uniquement | [`ADMIN.md`](./ADMIN.md) |
| Témoignages | `/temoignages` | Tous | — (état vide, non développé) |
| Mon profil | `/mon-profil` | Tous | voir `MEMBERS.md#auto-profil` |

## Démarrage

```bash
cd ejp-hub
npm install
cp .env.example .env.local   # renseigner les clés Supabase — voir SUPABASE_SETUP.md
npm run dev
```

Sans configuration Supabase, l'application tourne en **mode démo** (shell consultable avec des
données de démonstration en mémoire, pas d'authentification réelle). Voir
[`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) pour provisionner un vrai projet et
[`AUTHENTICATION.md`](./AUTHENTICATION.md#mode-démo) pour le détail de ce mode.

```bash
npm run db:seed   # crée 1 admin + 2 conducteurs de prière de démonstration
```

## Variables d'environnement

Voir [`.env.example`](./.env.example) pour la liste complète. Résumé :

| Variable | Portée | Rôle |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Client + serveur | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + serveur | Clé publique (soumise à la RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Serveur uniquement** | Contourne la RLS — utilisée par `scripts/seed.ts` et les Server Actions Membres qui appellent l'API Admin (création de compte, changement d'e-mail). Ne jamais exposer côté client ni préfixer `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_APP_URL` | Client + serveur | URL publique de l'application, utilisée dans les liens générés (réinitialisation de mot de passe, notifications) |

Absentes de `.env.local`, les deux premières font basculer l'application en mode démo (voir
ci-dessus) plutôt que de faire échouer le build ou le démarrage.

## Scripts

| Script | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run typecheck` | Vérification TypeScript stricte |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (écriture) |
| `npm run validate` | `typecheck` + `lint` |
| `npm run db:seed` | Crée les comptes de démonstration (voir `DATABASE.md`) |

## Déploiement

1. Provisionner un projet Supabase (production) — voir [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) —
   et y appliquer toutes les migrations de `supabase/migrations/` dans l'ordre.
2. Renseigner les quatre variables d'environnement ci-dessus sur la plateforme d'hébergement
   (Vercel ou équivalent compatible Next.js 15 App Router).
3. `npm run build` doit terminer sans erreur (`typecheck`, `lint` et build de production sont
   exécutés dans le même run — voir `next.config.ts`).
4. Ne jamais réutiliser le mot de passe ni les comptes de `scripts/seed.ts` en production —
   créer le premier compte `ADMIN` via `supabase.auth.admin.createUser` avec un mot de passe
   dédié, ou directement depuis le tableau de bord Supabase.
5. Vérifier dans le tableau de bord Supabase que l'inscription publique par e-mail
   (Authentication → Providers → Email) est dans l'état voulu : ce projet n'appelle jamais
   `supabase.auth.signUp` lui-même (l'inscription passe uniquement par l'API Admin, voir
   `MEMBERS.md`), mais la désactiver côté projet ajoute une couche de défense supplémentaire.

## Documentation

- [`PROJECT.md`](./PROJECT.md) — vue d'ensemble du produit, rôles, modules, décisions clés.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — organisation du code et choix techniques.
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) — provisionner et configurer Supabase.
- [`AUTHENTICATION.md`](./AUTHENTICATION.md) — flux d'authentification, rôles, middleware.
- [`DATABASE.md`](./DATABASE.md) — schéma, migrations, RLS, seed.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — conventions de contribution.
- [`ROADMAP.md`](./ROADMAP.md) — historique des sprints, ce qui reste.
- Documentation par module : [`PLANNING.md`](./PLANNING.md), [`PRAYER_TOPICS.md`](./PRAYER_TOPICS.md),
  [`REPORTS.md`](./REPORTS.md), [`MEMBERS.md`](./MEMBERS.md), [`NOTIFICATIONS.md`](./NOTIFICATIONS.md),
  [`ADMIN.md`](./ADMIN.md).

## Rôles

Deux rôles : `ADMIN` (accès complet, y compris `/administration`) et `PRAYER_LEADER` / conducteur
de prière (accès aux modules métier, restreint à ses propres données là où c'est pertinent —
son planning, ses comptes rendus, ses notifications). Le menu **Administration** est filtré par
rôle dans la sidebar, bloqué par le middleware pour les non-administrateurs, et protégé une
troisième fois par la Row Level Security Postgres — voir `AUTHENTICATION.md` et `ADMIN.md#permissions`.
