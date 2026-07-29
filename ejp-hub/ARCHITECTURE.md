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
│   ├── auth/               # Authentification (transverse, voir plus bas)
│   ├── dashboard/           # Tableau de bord
│   ├── planning/            # Planning
│   ├── prayer-topics/       # Sujets de prière
│   ├── reports/             # Comptes rendus
│   ├── members/             # Membres (adhésions, rôles, auto-profil — voir MEMBERS.md)
│   ├── notifications/       # Notifications (centre personnel — voir NOTIFICATIONS.md)
│   ├── admin/               # Administration (voir ADMIN.md)
│   └── testimonies/         # Témoignages (état vide, non développé)
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

### Exception Feature First : `features/auth/`

Le module `auth` exporte, via son `index.ts` public, des providers et des hooks
(`AuthProvider`, `RoleProvider`, `useAuth`, `useUser`, `useRole`) consommés par `shared/` et par
les autres features (ex. `shared/providers/app-providers.tsx` monte
`AuthProvider`/`RoleProvider` ; `useUser` est le moyen standard, dans tous les modules, de lire
le profil courant côté client). C'est la seule feature à qui ce statut « transverse » est
accordé : l'authentification est un prérequis de toute l'application, pas un module métier
comme les autres. Voir [`AUTHENTICATION.md`](./AUTHENTICATION.md) pour le détail.

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

## Authentification et rôles

Authentification complète (connexion, mot de passe oublié, réinitialisation, déconnexion,
rafraîchissement automatique de session) et middleware de protection réelle des routes, avec
deux rôles (`ADMIN`, `PRAYER_LEADER`). Détail complet dans [`AUTHENTICATION.md`](./AUTHENTICATION.md).

Point notable : tant que Supabase n'est pas configuré, l'application tourne en **mode démo**
(profil simulé, aucune redirection) pour rester consultable sans provisionner de projet — voir
la section « Mode démo » du même document.

## Base de données

Le schéma Postgres (tables, enums, triggers, Row Level Security, bucket Storage) vit dans
`supabase/migrations/` (format Supabase CLI). Les types TypeScript correspondants sont
maintenus à la main dans `src/shared/types/database.ts` (à régénérer avec
`supabase gen types typescript` une fois un projet Supabase lié). Détail complet dans
[`DATABASE.md`](./DATABASE.md).

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
