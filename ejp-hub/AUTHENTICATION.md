# Authentification

## Vue d'ensemble

EJP Hub utilise **Supabase Auth** (email + mot de passe). L'inscription publique par l'API
`supabase.auth.signUp` reste désactivée : un compte se crée soit via le formulaire public
« Rejoindre » (`/rejoindre`, module Membres — crée une demande `PENDING` via l'API Admin,
validée ensuite par un administrateur dans `/administration/membres/demandes`), soit par
`npm run db:seed` en développement — voir [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) et
[`MEMBERS.md`](./MEMBERS.md).

Flux couverts :

- Connexion (email + mot de passe)
- Déconnexion
- Mot de passe oublié → e-mail de réinitialisation → nouveau mot de passe
- Protection des routes (middleware)
- Gestion de session et rafraîchissement automatique du token

## Trois couches de défense

Aucune de ces couches ne remplace les autres — chacune protège contre une classe de bug différente.

| Couche | Où | Protège contre |
| --- | --- | --- |
| **Middleware** | `src/middleware.ts` | Un visiteur qui atteint une page qu'il ne devrait pas voir |
| **Guards serveur** | `src/shared/lib/auth/guards.ts` | Une Server Action appelée directement sans passer par l'UI |
| **Row Level Security** | `supabase/migrations/*_row_level_security.sql` | Une requête Postgres qui contournerait l'application elle-même |

Les hooks client (`useAuth`, `useRole`, `useUser`, et les `get*Permissions()` de chaque module) ne
sont **jamais** une frontière de sécurité : ils servent uniquement à adapter l'interface (masquer
un bouton, afficher un nom). Un utilisateur malveillant peut toujours modifier le JavaScript côté
client — c'est pour ça que le middleware et la RLS existent.

## Clients Supabase

| Fichier | Contexte | Rôle |
| --- | --- | --- |
| `shared/lib/supabase/client.ts` | Navigateur (composants `"use client"`) | Utilise la clé `anon`, soumis à la RLS |
| `shared/lib/supabase/server.ts` | Server Components / Server Actions | Lit/écrit les cookies de session via `@supabase/ssr` |
| `shared/lib/supabase/admin.ts` | Server Actions uniquement (`import "server-only"`) | Utilise la clé `service_role`, **contourne la RLS** — réservé aux opérations d'administration (ex. création de comptes) |
| `shared/lib/supabase/config.ts` | Partout | `isSupabaseConfigured()` — voir « Mode démo » ci-dessous |

## Middleware (`src/middleware.ts`)

À chaque requête (hors assets statiques) :

1. Rafraîchit la session Supabase (cookies).
2. Si l'utilisateur n'est pas connecté et que la route n'est pas publique
   (`/connexion`, `/mot-de-passe-oublie`, `/reinitialiser-mot-de-passe`, `/auth/callback`) →
   redirection vers `/connexion?redirectedFrom=<route>`.
3. Si l'utilisateur est connecté et visite `/connexion` → redirection vers `/`.
4. Si la route est protégée par rôle (voir `shared/constants/route-permissions.ts`) et que le rôle de
   l'utilisateur n'y figure pas → redirection vers `/`.

### Ajouter une route réservée à un rôle

Une seule ligne à ajouter, dans `src/shared/constants/route-permissions.ts` :

```ts
export const ROUTE_PERMISSIONS: RoutePermission[] = [
  { prefix: "/administration", roles: ["ADMIN"] },
  { prefix: "/ma-nouvelle-route", roles: ["ADMIN"] }, // ← nouvelle règle
];
```

La sidebar (`shared/components/layout/nav-items.ts`) lit la même source, donc le lien correspondant
se masque automatiquement pour les rôles non autorisés — pas de duplication à maintenir.

## Rôles

Définis dans `src/shared/constants/roles.ts` :

```ts
export const ROLES = ["ADMIN", "PRAYER_LEADER"] as const;
export type Role = (typeof ROLES)[number];
```

- **ADMIN** : accès complet, y compris `/administration`.
- **PRAYER_LEADER** (conducteur de prière) : accès aux modules courants, pas à l'administration.

### Ajouter un rôle plus tard

1. Ajouter la valeur à l'enum Postgres `user_role` (nouvelle migration —
   `alter type public.user_role add value 'NOUVEAU_ROLE';`).
2. Ajouter la valeur à `ROLES` dans `shared/constants/roles.ts` et son libellé dans `ROLE_LABELS`.
3. Ajuster `ROUTE_PERMISSIONS` si le nouveau rôle a des routes dédiées.

Rien d'autre à modifier : guards, middleware, `useRole()` et la sidebar sont tous génériques
(ils itèrent sur `Role[]`, jamais sur des rôles codés en dur un par un).

## Providers et hooks

| Export | Fichier | Rôle |
| --- | --- | --- |
| `AuthProvider` | `features/auth/providers/auth-provider.tsx` | Session Supabase (état, écoute des changements, déconnexion) |
| `RoleProvider` | `features/auth/providers/role-provider.tsx` | Profil applicatif (`profiles`) dérivé de la session |
| `useAuth()` | `features/auth/hooks/use-auth.ts` | `{ user, session, isLoading, signOut }` |
| `useUser()` | `features/auth/hooks/use-user.ts` | `{ profile, isLoading }` — la ligne `profiles` (nom, avatar, téléphone, rôle) |
| `useRole()` | `features/auth/hooks/use-role.ts` | `{ role, isAdmin, isPrayerLeader, hasRole, hasAnyRole }` |

Les deux providers sont montés une seule fois, dans `shared/providers/app-providers.tsx`
(`QueryProvider > AuthProvider > RoleProvider`), donc disponibles partout dans l'arbre React.

`AuthProvider` écoute `onAuthStateChange` (connexion, déconnexion, **rafraîchissement automatique du
token**) et appelle `router.refresh()` à chaque changement pour resynchroniser les Server Components
(ex. le profil affiché dans le header).

## Mode démo

Tant que `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` ne sont pas renseignées
(`isSupabaseConfigured()` renvoie `false`) :

- Le middleware laisse passer toutes les routes.
- `(app)/layout.tsx` affiche un profil simulé (`shared/constants/mock-profile.ts`, rôle `ADMIN`) au
  lieu de rediriger vers `/connexion`.
- `AuthProvider` reste inerte (aucun appel réseau), `useAuth().user` vaut `null`.

Ce mode sert uniquement à prévisualiser le shell de l'application sans provisionner de projet
Supabase. Dès que les variables sont renseignées, l'authentification réelle s'applique intégralement
— il n'y a pas de bascule manuelle à faire.

## Pages

| Route | Fichier | Rôle |
| --- | --- | --- |
| `/connexion` | `app/(auth)/connexion/page.tsx` | Connexion email + mot de passe |
| `/mot-de-passe-oublie` | `app/(auth)/mot-de-passe-oublie/page.tsx` | Demande d'e-mail de réinitialisation |
| `/reinitialiser-mot-de-passe` | `app/(auth)/reinitialiser-mot-de-passe/page.tsx` | Saisie du nouveau mot de passe (après clic sur le lien reçu par e-mail) |
| `/auth/callback` | `app/auth/callback/route.ts` | Échange le `code` Supabase contre une session, puis redirige vers `next` |

### Flux de réinitialisation, en détail

1. L'utilisateur saisit son e-mail sur `/mot-de-passe-oublie` →
   `supabase.auth.resetPasswordForEmail(email, { redirectTo: ".../auth/callback?next=/reinitialiser-mot-de-passe" })`.
2. Supabase envoie un e-mail contenant un lien vers `/auth/callback?code=...`.
3. La route `callback` échange le code contre une session (l'utilisateur est alors « connecté »,
   temporairement, via ce jeton de récupération), puis redirige vers `/reinitialiser-mot-de-passe`.
4. La page vérifie qu'une session existe (`useAuth()`) ; sinon elle affiche « lien invalide ou expiré ».
5. Le formulaire appelle `supabase.auth.updateUser({ password })`, puis déconnecte l'utilisateur pour
   qu'il se reconnecte avec son nouveau mot de passe (évite de laisser vivre une session de
   récupération après coup).
