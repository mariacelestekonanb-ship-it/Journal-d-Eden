# Configuration Supabase

Ce document explique comment provisionner un projet Supabase pour EJP Hub, où
trouver les clés nécessaires, et comment lancer la connexion en local.

## 1. Créer un projet Supabase

1. Rendez-vous sur [supabase.com/dashboard](https://supabase.com/dashboard) et créez un compte / connectez-vous.
2. Cliquez sur **New project**.
3. Choisissez une organisation, un nom (ex. `ejp-hub-dev`), un mot de passe de base de données (à conserver
   en lieu sûr — il ne sert qu'aux connexions Postgres directes, pas à l'application) et une région proche
   de vos utilisateurs.
4. Attendez la fin du provisionnement (~2 minutes).

## 2. Récupérer les clés

Dans le dashboard du projet : **Project Settings → API**.

| Clé | Où la trouver | Utilisation |
| --- | --- | --- |
| **Project URL** | Section « Project URL » | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon / public key** | Section « Project API keys » → `anon` `public` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role key** | Section « Project API keys » → `service_role` | `SUPABASE_SERVICE_ROLE_KEY` |

⚠️ **La clé `service_role` contourne la Row Level Security.** Elle ne doit jamais être exposée au
navigateur ni préfixée par `NEXT_PUBLIC_`. Dans ce projet, elle n'est utilisée que dans
`src/shared/lib/supabase/admin.ts` (marqué `import "server-only"`) et dans `scripts/seed.ts`.

## 3. Configurer le projet local

```bash
cd ejp-hub
cp .env.example .env.local
```

Renseignez dans `.env.local` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Sans ces variables, l'application démarre quand même, mais en **mode démo** : le shell (sidebar,
header) reste consultable avec un profil simulé, et l'authentification réelle est inactive. Voir
[`AUTHENTICATION.md`](./AUTHENTICATION.md#mode-démo) pour le détail.

## 4. Appliquer le schéma (migrations)

Le schéma complet (tables, index, RLS, storage) vit dans `supabase/migrations/`, au format standard
de la Supabase CLI.

### Option A — Supabase CLI (recommandé)

```bash
npx supabase login
npx supabase link --project-ref <votre-project-ref>   # trouvable dans l'URL du dashboard
npx supabase db push
```

### Option B — Éditeur SQL du dashboard

Si vous ne souhaitez pas installer la CLI : ouvrez **SQL Editor** dans le dashboard Supabase et
collez le contenu de chaque fichier de `supabase/migrations/`, **dans l'ordre du nom de fichier**
(l'ordre chronologique des migrations est important : chaque fichier peut dépendre du précédent).

## 5. Configurer les URLs de redirection (Auth)

Dans **Authentication → URL Configuration** :

- **Site URL** : `http://localhost:3000` (ou l'URL de production)
- **Redirect URLs** : ajoutez `http://localhost:3000/auth/callback` (et l'équivalent en production)

Ces URLs sont utilisées par le flux de réinitialisation de mot de passe (voir `AUTHENTICATION.md`).

Dans **Authentication → Providers → Email**, désactivez l'auto-confirmation si vous voulez tester le
vrai parcours d'e-mail, ou laissez « Confirm email » désactivé pour un développement plus rapide.

## 6. Créer des comptes de démonstration

```bash
npm run db:seed
```

Crée 1 administrateur et 2 conducteurs de prière avec des données fictives (voir
[`DATABASE.md`](./DATABASE.md#seed) pour le détail et les identifiants générés).

## 7. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000/connexion](http://localhost:3000/connexion) et connectez-vous avec un
des comptes générés par le seed.

## Résumé des variables d'environnement

| Variable | Requise | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Oui (pour l'auth réelle) | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui (pour l'auth réelle) | Clé publique, utilisée côté navigateur |
| `SUPABASE_SERVICE_ROLE_KEY` | Oui (pour `npm run db:seed` et l'administration) | Clé serveur, contourne la RLS |
| `NEXT_PUBLIC_APP_URL` | Non (défaut `http://localhost:3000`) | Base des liens générés dans les e-mails |
