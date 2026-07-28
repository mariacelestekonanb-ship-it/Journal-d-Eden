# Architecture

## Principe : Feature First

Le code est organisé par **fonctionnalité métier**, pas par type technique. Chaque module
sous `src/features/` est autonome et regroupe ses composants, hooks, services, types,
schémas de validation et Server Actions.

```
src/
├── app/                    # Routage Next.js (App Router) — fin, délègue aux features
│   ├── (auth)/             # Connexion, mot de passe oublié — layout centré, sans sidebar
│   ├── (app)/              # Application authentifiée — layout avec sidebar + header
│   └── auth/callback/      # Échange de code Supabase (reset password, invitations)
│
├── features/
│   ├── auth/               # Authentification (fonctionnel)
│   ├── dashboard/           # Tableau de bord (placeholder)
│   ├── planning/            # Planning (placeholder)
│   ├── prayer-topics/       # Sujets de prière (placeholder)
│   ├── reports/             # Comptes rendus (placeholder)
│   ├── testimonies/         # Témoignages (placeholder)
│   ├── profile/             # Mon profil (placeholder)
│   └── admin/               # Administration (placeholder)
│
├── shared/
│   ├── components/          # Design system (App*) + layout global + providers
│   ├── ui/                  # Primitives shadcn/ui brutes
│   ├── hooks/                # Hooks transverses
│   ├── lib/                  # Intégrations externes (Supabase) + utilitaires bas niveau
│   ├── services/             # Services transverses
│   ├── types/                 # Types globaux (dont le schéma Supabase)
│   ├── utils/                  # Fonctions pures (dates, initiales)
│   └── constants/               # Constantes globales (nom de l'app, routes)
│
├── styles/                 # globals.css (tokens Tailwind v4, dark mode)
└── docs/                   # Documentation technique interne (schéma SQL)
```

Chaque dossier contient un `README.md` expliquant son rôle — en particulier les dossiers
encore vides, pour que le Sprint 2 sache où poser le code.

### Pourquoi séparer `shared/ui` et `shared/components` ?

- **`shared/ui/`** : primitives shadcn/ui « brutes ». On ne les modifie pas pour un besoin
  ponctuel — elles restent la base neutre, réutilisable partout.
- **`shared/components/`** : composants applicatifs, dont le **design system maison**
  (`AppButton`, `AppCard`, `AppBadge`, `AppAvatar`, `AppEmptyState`, `AppPageHeader`,
  `AppSection`, `AppLoader`). Ce sont eux qu'on importe dans les pages — ils encapsulent les
  primitives avec les conventions et comportements par défaut de l'application (ex.
  `AppButton` gère un état `isLoading`).

Cette séparation permet de mettre à jour shadcn/ui sans risquer de casser les conventions
propres à EJP Hub, et inversement.

## Design system

| Composant | Rôle |
| --- | --- |
| `AppButton` | Bouton avec état de chargement intégré |
| `AppCard` | Conteneur de carte (+ Header/Title/Description/Content/Footer) |
| `AppBadge` | Étiquette de statut (variantes success/warning/destructive/…) |
| `AppAvatar` | Avatar avec repli sur les initiales du nom |
| `AppEmptyState` | État vide illustré (icône + titre + description + action) |
| `AppPageHeader` | En-tête de page (titre + description + actions) |
| `AppSection` | Regroupement de contenu avec titre optionnel |
| `AppLoader` | Indicateur de chargement générique (spinner) |

Aucune couleur n'est codée en dur : tout passe par les variables CSS définies dans
`src/styles/globals.css` (`--background`, `--primary`, `--border`, …), exposées à Tailwind
via `@theme inline`. Le mode sombre est piloté par `next-themes` (classe `.dark` sur `<html>`).

## Authentification (état actuel)

Le module `auth` est fonctionnel (connexion, mot de passe oublié, déconnexion, rafraîchissement
de session dans `src/middleware.ts`), mais **le shell applicatif n'est pas encore strictement
gaté** : `src/app/(app)/layout.tsx` retombe sur un profil de démonstration
(`shared/constants/placeholder-profile.ts`) si aucune session Supabase n'est active, afin que
la navigation, le responsive et le dark mode restent vérifiables sans configurer de projet
Supabase. Ce repli est documenté en commentaire (`// Sprint 2 (TODO)`) directement dans le
code concerné (`middleware.ts`, `(app)/layout.tsx`) et devra être retiré dès que
l'authentification sera branchée sur de vraies données.

## Base de données

Le schéma Postgres (tables, enums, triggers, Row Level Security, bucket Storage) est décrit
dans `src/docs/database.sql`. Les types TypeScript correspondants sont maintenus à la main
dans `src/shared/types/database.ts` (à régénérer avec `supabase gen types typescript` une
fois un projet Supabase lié).

## Pourquoi ces choix

- **Next.js App Router** : Server Components par défaut, layouts imbriqués, Server Actions —
  réduit le JS envoyé au client et simplifie la sécurité des mutations sensibles.
- **TypeScript strict** : `noUncheckedIndexedAccess` + zéro `any` pour détecter les bugs à la
  compilation plutôt qu'en production.
- **Supabase** : Auth + Postgres + Storage + RLS dans un seul service managé, évite de
  réinventer une couche d'autorisation côté application.
- **React Query** : cache, revalidation et états de chargement/erreur cohérents pour toutes
  les données serveur, sans état global fait main.
- **Zod + React Hook Form** : un seul schéma de validation partagé entre l'UI (messages
  d'erreur) et, plus tard, les Server Actions (garde-fou côté serveur).
