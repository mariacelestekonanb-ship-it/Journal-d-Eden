# EJP Hub

Application SaaS de centralisation de l'organisation des conducteurs de prière de l'EJP.

> **Statut : fondations + authentification.** L'architecture, le design system et
> l'authentification Supabase (connexion, mot de passe oublié, rôles, protection des routes)
> sont en place. Aucune fonctionnalité métier (planning, sujets de prière, comptes rendus,
> témoignages) n'est encore développée — voir [ROADMAP.md](./ROADMAP.md) pour la suite.
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
cp .env.example .env.local   # renseigner les clés Supabase — voir SUPABASE_SETUP.md
npm run dev
```

Sans configuration Supabase, l'application tourne en **mode démo** (shell consultable, pas
d'authentification réelle). Voir [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) pour provisionner un
vrai projet et [`AUTHENTICATION.md`](./AUTHENTICATION.md#mode-démo) pour le détail de ce mode.

```bash
npm run db:seed   # crée 1 admin + 2 conducteurs de prière de démonstration
```

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

## Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — organisation du code et choix techniques.
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) — provisionner et configurer Supabase.
- [`AUTHENTICATION.md`](./AUTHENTICATION.md) — flux d'authentification, rôles, middleware.
- [`DATABASE.md`](./DATABASE.md) — schéma, migrations, RLS, seed.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — conventions de contribution.
- [`ROADMAP.md`](./ROADMAP.md) — ce qui est fait, ce qui reste.

## Rôles

Deux rôles : `ADMIN` (accès complet) et `PRAYER_LEADER` / conducteur de prière (accès limité —
sera précisé module par module au fil des sprints). Le menu **Administration** est déjà filtré
par rôle dans la sidebar et bloqué par le middleware pour les non-administrateurs — voir
`AUTHENTICATION.md`.
