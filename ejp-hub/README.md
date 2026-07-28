# EJP Hub

Application SaaS de centralisation de l'organisation des conducteurs de prière de l'EJP.

> Ce projet vit dans `ejp-hub/`, à côté de LexWatch (à la racine du dépôt), en attendant que
> l'organisation définitive du dépôt soit décidée. Les deux projets sont totalement indépendants
> (dépendances, build, déploiement).

## Stack

Next.js (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui (composants réécrits à la main,
sans accès réseau au registre) · Supabase (Auth, Database, Storage) · React Hook Form + Zod ·
TanStack Table · React Query · Recharts · Sonner · date-fns.

## Démarrage

```bash
cd ejp-hub
npm install
cp .env.example .env.local   # renseigner les clés Supabase
npm run dev
```

## Base de données

Le schéma complet (tables, triggers, RLS, storage) est dans `src/docs/database.sql`. Exécutez-le
dans l'éditeur SQL de votre projet Supabase avant le premier lancement. Une fois le projet lié,
régénérez `src/types/database.ts` avec `supabase gen types typescript`.

## Architecture

Feature First : `src/features/<domaine>/{components,hooks,services,types,validation,actions}`.
Voir `AGENTS.md` / le prompt produit d'origine pour le détail des modules V1 (Planning, Sujets de
prière, Comptes rendus, Témoignages, Notifications, Administration, Import/Export).

## Rôles

Deux rôles : `admin` (accès complet) et `conducteur` (accès limité — plannings et sujets en
lecture seule, comptes rendus limités à ses propres créneaux).
