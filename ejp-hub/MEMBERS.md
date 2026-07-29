# Membres

Le module Membres gère les conducteurs de prière et administrateurs de l'EJP : demandes
d'adhésion publiques, validation par un administrateur, profils, rôles et suivi
(historique Planning et Comptes rendus). Il est construit directement sur `profiles` —
la table qui existait déjà pour l'authentification — et non sur une table séparée : un
membre *est* un profil applicatif, pas une entité distincte. Ce document explique
l'architecture, le workflow d'adhésion, les permissions et les décisions de conception —
le [`README.md`](./src/features/members/README.md) du module renvoie ici pour le détail.

## Modèle métier

```ts
interface Member {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  photoUrl: string | null;
  role: MemberRole;          // alias de Role — voir plus bas
  status: MemberStatus;      // PENDING | ACTIVE | REFUSED | SUSPENDED
  registeredAt: string;      // = createdAt, exposé séparément pour son sens métier
  validatedAt: string | null;
  validatedBy: MemberValidator | null;
  createdAt: string;
  updatedAt: string;
}
```

`MemberRole` est un **alias** de `Role` (`shared/constants/roles.ts`), pas un enum
dupliqué : les rôles sont un concept transverse à toute l'application (Planning,
Comptes rendus, permissions de route…), déjà pensé pour accueillir un futur rôle sans
rien toucher d'autre que `ROLES`/`ROLE_LABELS` et l'enum Postgres `user_role` — voir
[`AUTHENTICATION.md#ajouter-un-rôle-plus-tard`](./AUTHENTICATION.md). Dupliquer un
`MemberRole` indépendant aurait cassé cette promesse pour le seul module Membres.

`MemberStatus` (`PENDING`/`ACTIVE`/`REFUSED`/`SUSPENDED`) est en revanche propre au
workflow d'adhésion — nouveau champ `profiles.status`, voir
[`DATABASE.md#profiles`](./DATABASE.md#profiles).

## Workflow d'adhésion

```
Demande d'adhésion (formulaire public /rejoindre)
        │
        ▼
     PENDING ──accept──► ACTIVE ──suspend──► SUSPENDED
        │                                        │
        └──refuse──► REFUSED                     └──reactivate──┘
```

1. Un visiteur sans compte clique « Rejoindre les Conducteurs de prière » depuis
   `/connexion`, arrive sur `/rejoindre` (formulaire public, RHF + Zod : nom, prénom,
   e-mail, téléphone, mot de passe + confirmation, photo optionnelle).
2. La soumission crée **immédiatement** un compte Supabase Auth réel (mot de passe
   haché par Supabase, jamais stocké par l'application) via l'API Admin, avec
   `status: PENDING` et `is_active: false` passés en métadonnées — lues par le
   trigger `handle_new_user` (voir `DATABASE.md`). Le compte existe donc déjà, mais
   reste bloqué.
3. Un administrateur consulte `/administration/demandes` (page dédiée, uniquement les
   membres `PENDING`) et accepte ou refuse, avec confirmation obligatoire.
4. **Acceptation** : `status → ACTIVE`, `is_active → true`, `role` réaffirmé à
   `PRAYER_LEADER`, `validatedAt`/`validatedBy` renseignés. Le membre peut alors se
   connecter et utiliser l'application normalement.
5. **Refus** : `status → REFUSED`, `validatedAt`/`validatedBy` renseignés. Le compte
   existe toujours côté Supabase Auth mais reste bloqué (voir gate ci-dessous).

Un administrateur peut aussi `suspend` un membre `ACTIVE` (incident, départ temporaire)
et le `reactivate` — ce sont les 5 actions exactes listées par le brief (valider,
refuser, suspendre, réactiver, changer le rôle), portées par `MemberWorkflowService`
(machine à états pure, ne connaît que le statut) combiné à `getMemberPermissions(role)`
au niveau des composants — jamais de test `role === "ADMIN"` en dur.

### Le gate qui rend PENDING réellement bloquant

Avoir un statut `PENDING` en base ne bloque rien par lui-même : Supabase Auth ignore
totalement ce champ applicatif, un compte fraîchement créé peut se connecter avec son
mot de passe comme n'importe quel autre. C'est `middleware.ts` qui ferme la boucle :
pour **toute** route protégée (pas seulement celles réservées à un rôle), il
récupère désormais `role` **et** `status`, et redirige vers `/compte-en-attente` tant
que `status !== 'ACTIVE'` — page qui explique la situation (en attente / refusée /
suspendue) et propose de se déconnecter. Sans ce bloc, le workflow d'adhésion ne serait
qu'un badge visuel côté admin, pas une vraie porte d'entrée.

## Modèle de données — pourquoi pas une table séparée

`profiles` existait déjà pour l'authentification (`firstname`, `lastname`, `email`,
`role`, `avatar_url`, `phone`, `is_active`). Un « membre », au sens du brief, est
exactement la même personne vue sous l'angle de l'adhésion — créer une table `members`
distincte aurait dupliqué l'identité et exigé de garder deux tables synchronisées à
chaque connexion. La migration `20260801090001_members_details.sql` étend donc
`profiles` (`status`, `validated_at`, `validated_by`) plutôt que de créer une nouvelle
table — voir [`DATABASE.md#profiles`](./DATABASE.md#profiles) pour le détail complet,
y compris l'invariant `is_active ⇔ status === 'ACTIVE'` tenu applicativement pour ne
rien casser des requêtes déjà existantes (Planning, Sujets de prière) qui filtrent sur
`is_active`.

## Séparation client / serveur — les deux seules opérations nécessitant la clé de service

Le reste du module suit le pattern déjà établi (Reports, Planning, Sujets de prière) :
`MemberService` → `MemberRepository` (Mock ou Supabase, clé `anon`, soumis à la RLS),
appelé depuis des hooks React Query, jamais Supabase ni `member.queries.ts` directement
depuis un composant.

Deux opérations font exception, parce qu'elles ne peuvent tout simplement pas
s'exécuter avec la clé `anon` :

| Opération | Pourquoi la clé de service est nécessaire | Où elle vit |
| --- | --- | --- |
| Créer le compte d'une demande d'adhésion | `supabase.auth.admin.createUser(...)` — l'inscription publique (`auth.signUp`) reste désactivée (voir `AUTHENTICATION.md`) | `actions/create-membership-request.action.ts` (`"use server"`) |
| Changer l'e-mail d'un membre (admin) | Doit rester synchronisé avec `auth.users.email`, via `auth.admin.updateUserById(...)` | `actions/update-member-email.action.ts` (`"use server"`) |

Ces deux Server Actions sont les **seuls** fichiers du module à importer
`queries/member-admin.queries.ts` (`import "server-only"`). `MemberService` et
`MemberRepository` n'en dépendent jamais, précisément pour rester importables depuis des
hooks client sans faire échouer le build (`server-only` lève une erreur si son module
finit dans le bundle navigateur). Toutes les autres transitions de statut
(`accept`/`refuse`/`suspend`/`reactivate`/`changeRole`) passent par la clé `anon` : un
administrateur authentifié les traverse déjà sans problème via la RLS
(`profiles_update_self_or_admin`) et la garde anti-élévation de privilèges (qui
autorise explicitement un acteur `ADMIN`) — voir `DATABASE.md`.

## Mode démo — une limitation assumée

`create-membership-request.action.ts` est une vraie Server Action : elle s'exécute
toujours côté serveur, même en mode démo (Supabase non configuré). Contrairement au
reste du module (dont l'état mock vit en mémoire du **navigateur**), elle ne peut pas
alimenter `MockMemberRepository` (mémoire du navigateur, inaccessible depuis le
serveur). En mode démo, la demande est donc simulée (retour d'un membre fictif pour que
le formulaire reste testable) mais n'apparaît pas dans la liste admin. C'est une
limitation honnête du mode démo, pas un bug : sans backend réel, il n'existe
littéralement aucun compte à créer.

## Garde métier — `MemberValidationService`

Au-delà de la validation de formulaire (Zod), `MemberValidationService.assertNotSelf`
empêche un administrateur de suspendre ou de changer son propre rôle via ce module —
évite un auto-verrouillage accidentel. `MemberDetailView` désactive aussi visuellement
ces contrôles sur son propre profil plutôt que de laisser l'utilisateur déclencher une
erreur systématique.

## Permissions

`getMemberPermissions(role)` centralise les droits :

| Droit | `ADMIN` | `PRAYER_LEADER` |
| --- | --- | --- |
| Voir tous les membres | ✅ | ❌ (son propre profil uniquement) |
| Valider / refuser une demande | ✅ | ❌ |
| Suspendre / réactiver un membre | ✅ (jamais soi-même) | ❌ |
| Changer un rôle | ✅ (jamais le sien) | ❌ |
| Changer l'e-mail d'un membre | ✅ | ❌ |
| Modifier sa photo / son téléphone / son mot de passe | ✅ (les siens) | ✅ (les siens) |
| Consulter son propre historique (Planning, Comptes rendus) | ✅ | ✅ |

Comme pour les autres modules, l'isolation n'est pas qu'une question d'affichage :
`MockMemberRepository`/RLS appliquent la même règle « admin ou soi-même » à la couche
données (`list`/`getById`).

## Fiche membre et auto-profil — un contenu partagé, deux points d'entrée

`/administration/[id]` (admin, n'importe quel membre) et `/mon-profil` (chaque membre,
lui-même) affichent le même type de contenu — informations personnelles, statut, rôle,
historique Planning, historique Comptes rendus — mais avec des capacités différentes
(l'admin gère statut/rôle/e-mail, chacun gère sa propre photo/téléphone/mot de passe).
Le changement de mot de passe **réutilise tel quel** `ResetPasswordForm`
(`features/auth/components/reset-password-form.tsx`) plutôt que de dupliquer un
formulaire équivalent — même schéma, même appel `supabase.auth.updateUser`.

L'historique Planning/Comptes rendus est affiché via `MemberHistoryList`, un composant
générique de ce module : les modules Planning et Comptes rendus n'exportent pas leurs
badges de statut via leur `index.ts` public, donc Membres n'en dépend pas — seuls deux
petits tableaux de libellés (`utils/member-history-labels.ts`) sont dupliqués
localement, un compromis largement moins coûteux qu'élargir la surface publique de deux
autres modules pour un simple texte dans une liste.

## Notifications — événements préparés

Comme pour les Comptes rendus, aucun événement n'est encore émis (le module
Notifications n'existe pas), mais chaque mutation correspond exactement à un futur
événement, sans changement de forme à prévoir :

- demande envoyée (`create-membership-request.action.ts`)
- demande acceptée / refusée (`accept`/`refuse`)
- compte suspendu (`suspend`)
- changement de rôle (`changeRole`)

## Composants

| Composant | Rôle |
| --- | --- |
| `MemberHeader` | En-tête de la page liste, lien « Demandes en attente » (avec compteur) |
| `MemberStatistics` | Indicateurs — total, actifs, en attente, suspendus |
| `MemberFilters` | Recherche + filtres combinables (statut, rôle) |
| `MemberTable` | TanStack Table — tri, pagination, colonnes masquables, sélection multiple |
| `MemberCard` | Résumé compact d'un membre, zone d'actions optionnelle (demandes) |
| `MemberJoinForm` | Formulaire public d'adhésion (RHF + Zod) |
| `MemberEmailDialog` | Changement d'e-mail (admin) |
| `MemberHistoryList` | Historique Planning / Comptes rendus, réutilisé fiche membre et auto-profil |
| `MemberStatusBadge`, `MemberRoleBadge`, `MemberEmptyState` | Briques de présentation réutilisables |

## Services

| Service | Rôle |
| --- | --- |
| `MemberRepository` (interface) | Contrat CRUD + workflow + historique (hors création de compte et changement d'e-mail) |
| `MockMemberRepository` / `SupabaseMemberRepository` | Implémentations, choisies par `MemberService` |
| `MemberService` | API publique consommée par les hooks (seul point d'entrée) |
| `MemberWorkflowService` | Machine à états pure (statut → actions permises) |
| `MemberValidationService` | Format du téléphone, garde anti-auto-verrouillage |

## Prochaine étape : connexion Supabase réelle

1. Lier le projet (`supabase link`) et appliquer les migrations (voir `SUPABASE_SETUP.md`).
2. Régénérer `src/shared/types/database.ts` (`supabase gen types typescript`).
3. Définir `SUPABASE_SERVICE_ROLE_KEY` dans les variables d'environnement serveur
   (déjà utilisée par `scripts/seed.ts` — nécessaire aussi aux deux Server Actions de ce
   module).
4. Aucun changement dans `features/members/components/` ni `hooks/` : `MemberService`
   bascule automatiquement sur `SupabaseMemberRepository` dès que
   `isSupabaseConfigured()` répond `true`.
5. Activer la confirmation d'e-mail réelle avant tout déploiement public
   (`email_confirm: true` est actuellement forcé côté Admin API pour que le flux de
   démonstration reste immédiat — à revoir une fois `enable_confirmations` activé, voir
   `ROADMAP.md`).
