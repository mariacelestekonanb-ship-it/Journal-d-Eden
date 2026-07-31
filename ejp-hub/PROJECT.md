# PROJECT — EJP Hub

Vue d'ensemble du produit. Chaque document listé en bas de page détaille un aspect
particulier (architecture technique, schéma de données, module métier) — celui-ci sert de
point d'entrée et de fil conducteur entre tous les sprints qui ont construit l'application.

## Vision

EJP Hub centralise l'organisation des conducteurs de prière de l'EJP (Église/communauté) :
qui prie quand, ce qui a été partagé pendant chaque temps de prière, quels sujets porter, qui
fait partie de l'équipe, et comment l'administrateur pilote l'ensemble. L'objectif est de
remplacer une coordination éclatée (messages, tableurs, mémoire des uns et des autres) par un
outil unique, pensé pour deux profils : l'administrateur qui organise et valide, et le
conducteur de prière qui consulte son planning et rend compte de ses temps de prière.

## Rôles

| Rôle | Description | Accès |
| --- | --- | --- |
| `ADMIN` | Administrateur de la plateforme | Tous les modules, y compris `/administration` ; valide les demandes d'adhésion, gère les rôles, configure la plateforme |
| `PRAYER_LEADER` | Conducteur de prière | Planning, Sujets de prière, Comptes rendus (les siens), Notifications (les siennes), son propre profil |

Il n'existe pas de rôle intermédiaire. L'inscription publique (`/rejoindre`) crée toujours un
compte `PENDING`/`PRAYER_LEADER` en attente de validation — jamais un compte actif ni un
administrateur (voir la section Sécurité ci-dessous).

## Modules

| Module | Ce qu'il fait | Statut | Doc |
| --- | --- | --- | --- |
| Tableau de bord | Vue d'ensemble agrégée (statistiques, prochaines conduites, derniers sujets, notifications, activité récente) | Développé | — |
| Planning | Créneaux de prière, conducteurs assignés, vues Calendrier/Semaine/Mois/Liste, export | Développé | [`PLANNING.md`](./PLANNING.md) |
| Sujets de prière | Sujets à porter en prière par la communauté, catégorie/priorité/statut, archivage | Développé | [`PRAYER_TOPICS.md`](./PRAYER_TOPICS.md) |
| Comptes rendus | Compte rendu détaillé d'un créneau (chaîne de prière : versets, points de prière, présences), workflow de validation | Développé | [`REPORTS.md`](./REPORTS.md) |
| Membres | Demandes d'adhésion, validation, gestion des rôles, auto-profil | Développé | [`MEMBERS.md`](./MEMBERS.md) |
| Notifications | Centre de notifications personnel, strictement isolé par utilisateur | Développé | [`NOTIFICATIONS.md`](./NOTIFICATIONS.md) |
| Administration | Tableau de bord admin, rôles, paramètres, catégories configurables, journal, recherche globale | Développé | [`ADMIN.md`](./ADMIN.md) |
| Témoignages | Partage de témoignages par la communauté | Non développé (état vide uniquement) | — |

## Architecture en un coup d'œil

**Feature First** : chaque module vit sous `src/features/<nom>/` avec ses propres
`types/validation/data/mappers/queries/repositories/services/actions/hooks/utils/components/pages`
et un unique point d'entrée public `index.ts`. Un module n'importe jamais un chemin profond
d'un autre module — uniquement ce que son `index.ts` exporte. Voir
[`ARCHITECTURE.md`](./ARCHITECTURE.md) pour le détail complet et les exceptions justifiées
(`auth`, transverse par nature).

**Trois lignes de défense pour les permissions**, systématiquement superposées, jamais l'une à
la place de l'autre :
1. Middleware (`src/middleware.ts` + `ROUTE_PERMISSIONS`) — bloque l'accès aux routes.
2. Row Level Security Postgres — bloque l'accès aux données, y compris si l'application a un
   bug. C'est la ligne qui protège même un appel direct à l'API Supabase.
3. Guards serveur (`shared/lib/auth/guards.ts`) — protection supplémentaire pour les Server
   Actions qui ont besoin de la clé de service (contournant la RLS par nature).

**Mode démo** : sans variables d'environnement Supabase, l'application entière reste
consultable avec des données de démonstration en mémoire (`data/*.mocks.ts` de chaque module),
pour évaluer le produit sans provisionner d'infrastructure.

## Sécurité — points notables

- Aucun module n'appelle jamais l'API publique `supabase.auth.signUp` : la création de compte
  passe uniquement par l'API Admin (clé de service, côté serveur), qu'il s'agisse d'une
  demande d'adhésion publique ou du script de seed — voir `MEMBERS.md` et
  `scripts/seed.ts`.
- `role`/`status`/`is_active` d'un profil ne sont jamais lus depuis les métadonnées librement
  modifiables par un utilisateur (`user_metadata`/`raw_user_meta_data`) : uniquement depuis
  `app_metadata`/`raw_app_meta_data`, que seule l'API Admin peut renseigner. Voir la migration
  `20260804090001_fix_privilege_escalation_signup.sql` et `DATABASE.md#profiles`.
- Le trigger `prevent_privilege_escalation` empêche tout utilisateur non-admin de modifier son
  propre rôle, statut, `is_active` ou e-mail, même via un appel direct à l'API Supabase.
- Les trois tables du module Administration (`app_settings`, `admin_categories`,
  `admin_audit_log`) n'autorisent **aucune** opération à un non-administrateur, y compris la
  lecture — la règle la plus stricte de tout le schéma.

## Historique des sprints

Voir [`ROADMAP.md`](./ROADMAP.md) pour le détail sprint par sprint. En résumé : fondations et
design system → authentification → Tableau de bord → Planning → Sujets de prière → Comptes
rendus (puis refonte « chaîne de prière ») → Membres → Notifications → Administration →
sprint d'intégration/qualité/finalisation (celui-ci), qui n'a ajouté aucun module mais a
audité, uniformisé et durci l'ensemble de ce qui précède.

## Documentation complète

- [`README.md`](./README.md) — démarrage, scripts, variables d'environnement, déploiement.
- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — organisation du code, design system, choix techniques.
- [`DATABASE.md`](./DATABASE.md) — schéma Postgres, migrations, Row Level Security.
- [`AUTHENTICATION.md`](./AUTHENTICATION.md) — flux d'authentification, rôles, middleware, mode démo.
- [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) — provisionner et configurer un projet Supabase.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — conventions de contribution.
- [`ROADMAP.md`](./ROADMAP.md) — historique des sprints, pistes futures.
- Documentation par module : [`PLANNING.md`](./PLANNING.md), [`PRAYER_TOPICS.md`](./PRAYER_TOPICS.md),
  [`REPORTS.md`](./REPORTS.md), [`MEMBERS.md`](./MEMBERS.md), [`NOTIFICATIONS.md`](./NOTIFICATIONS.md),
  [`ADMIN.md`](./ADMIN.md).
- [`DEPARTMENTS.md`](./DEPARTMENTS.md) — plan d'implémentation de l'architecture multi-département
  (HUB by ICC Reims), pas encore développé : schéma, RLS, ordre des migrations, impact module par
  module.
