# LexWatch

Plateforme éditoriale de veille juridique et de vulgarisation sur le droit spatial et le droit du numérique.

**Statut : Release Candidate 1 (RC1)** — fonctionnellement complet pour une V1, prêt à être déployé sur un environnement de préproduction. Voir [ROADMAP.md](./ROADMAP.md) pour ce qui reste hors périmètre (authentification réelle, base de données) avant une mise en production commerciale.

---

## Sommaire

- [Présentation](#présentation)
- [Objectifs](#objectifs)
- [Architecture](#architecture)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Configuration](#configuration)
- [Variables d'environnement](#variables-denvironnement)
- [Lancement en développement](#lancement-en-développement)
- [Build de production](#build-de-production)
- [Structure du projet](#structure-du-projet)
- [Conventions de code](#conventions-de-code)
- [Contribuer](#contribuer)
- [Checklist avant publication](#checklist-avant-publication)

---

## Présentation

LexWatch est un site éditorial qui explique le droit spatial et le droit du numérique à un public de professionnels, chercheurs et curieux, à travers quatre familles de contenus :

- **Comprendre** — une bibliothèque de fiches pédagogiques (« En bref / Pourquoi cette question / Ce que dit le droit / Notre explication / À retenir / Références »).
- **Veille juridique** — des analyses d'actualité juridique structurées (chronologie des faits, contexte, analyse, portée).
- **Glossaire** — un dictionnaire de notions avec définitions, explications et contenus associés.
- **Ressources** — une sélection de textes officiels, rapports et guides.

Le site public est entièrement statique/pré-rendu à partir de contenus versionnés dans `data/`. Un espace d'administration (`/admin`) simule un back-office éditorial complet (édition riche, workflow de statuts, médiathèque, SEO par page) sur un **dépôt de données en mémoire**, pensé pour être remplacé par une vraie base de données sans changer l'interface (voir [Architecture](#architecture)). Une page `/admin/reglages` fait exception à cette séparation : identité visuelle (logo, palette de couleurs), héros de la page d'accueil, coordonnées de contact et contenu des pages légales sont bien lus par le site public (voir plus bas).

## Objectifs

- Offrir une expérience de lecture soignée et accessible sur des sujets juridiques réputés arides.
- Démontrer une architecture Next.js moderne, typée de bout en bout, avec un design system cohérent.
- Fournir à une rédaction un espace de création de contenu agréable (éditeur par blocs, aperçu fidèle, SEO intégré) sans dépendre d'un CMS tiers.
- Rester extensible : chaque brique (données, repository admin, design system) est conçue pour être substituée (CMS headless, base de données, authentification réelle) sans réécrire les pages.

## Architecture

```
┌─────────────────────┐        ┌──────────────────────────┐
│   Site public        │        │   Espace d'administration │
│   app/(pages)         │        │   app/admin/**             │
│   données statiques   │        │   lib/admin/repository.ts  │
│   data/*.ts           │        │   (en mémoire, globalThis) │
└──────────┬───────────┘        └──────────────┬─────────────┘
           │                                    │
           │        components/ui + shared      │
           └──────────────┬─────────────────────┘
                          │
                 styles/globals.css (design tokens)
```

Points clés :

- **App Router (Next.js 15)** : pages publiques majoritairement en Server Components, données lues directement depuis `data/*.ts` (pas d'appel réseau). Les pages avec filtres interactifs (Comprendre, Veille, Glossaire) pré-filtrent côté serveur via `searchParams`, puis délèguent l'interaction fine à un explorateur client (`*-explorer.tsx`).
- **Le back-office et le site public sont architecturalement séparés**, à une exception près. L'admin lit et écrit dans un dépôt en mémoire (`lib/admin/repository.ts`, adossé à `globalThis` pour survivre au rechargement à chaud en dev) ; les pages publiques lisent `data/*.ts`. C'est un choix assumé de cette phase : brancher une vraie base de données ne touche que `lib/admin/repository.ts` et les fonctions de `lib/content.ts`, jamais les composants. **Exception** : `/admin/reglages` édite un objet singleton (`SiteSettings`, `lib/admin/repository.ts` → `siteSettingsStore`) que le site public lit directement (`app/layout.tsx`, `app/page.tsx`, `app/contact/page.tsx`, pages légales, `Footer`) — logo, palette, héros, contact et pages légales sont donc réellement modifiables sans redéploiement, contrairement au reste du contenu éditorial.
- **Upload de médias (`/admin/reglages`)** : le logo et le média du héros sont envoyés via `app/api/upload/route.ts` et écrits sur le disque local (`public/uploads/`). Cela fonctionne en développement et sur un serveur Node traditionnel, mais **pas** sur un hébergeur serverless à système de fichiers éphémère/lecture seule (Vercel, Netlify) — voir [SECURITY.md](./SECURITY.md) et [ROADMAP.md](./ROADMAP.md) pour la bascule nécessaire vers un stockage objet (S3, Supabase Storage, Cloudinary…) avant une mise en ligne réelle.
- **Design system centralisé** (`components/ui`, tokens dans `styles/globals.css`) : toutes les couleurs, rayons et ombres passent par des tokens Tailwind v4 (`@theme inline`), aucune couleur ni taille codée en dur dans les composants.
- **SEO transversal** : un générateur de métadonnées unique (`lib/metadata.ts`), des builders JSON-LD par type de contenu (`lib/json-ld.ts`), un fil d'Ariane qui génère son propre `BreadcrumbList`, des sitemaps par catégorie et un sitemap plat, `robots.ts` interdisant `/admin`.

## Technologies utilisées

| Domaine             | Choix                                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework           | [Next.js 15](https://nextjs.org) (App Router, Server Components, Server Actions)                                                                 |
| UI                  | [React 19](https://react.dev)                                                                                                                    |
| Langage             | TypeScript strict (aucun `any`)                                                                                                                  |
| Styles              | [Tailwind CSS v4](https://tailwindcss.com) (configuration CSS-native, pas de `tailwind.config.js`)                                               |
| Composants headless | [Radix UI](https://www.radix-ui.com) (`Dialog`, `DropdownMenu`, `Slot`)                                                                          |
| Variants            | [class-variance-authority](https://cva.style)                                                                                                    |
| Animations          | [Framer Motion](https://motion.dev)                                                                                                              |
| Icônes              | [Lucide React](https://lucide.dev)                                                                                                               |
| Polices             | [Manrope](https://fonts.google.com/specimen/Manrope) (titres) / [Inter](https://fonts.google.com/specimen/Inter) (texte), via `next/font/google` |
| Qualité             | ESLint (`next/core-web-vitals`, `next/typescript`), Prettier + `prettier-plugin-tailwindcss`                                                     |

Aucune base de données, aucun ORM, aucun service d'authentification n'est branché à ce stade : voir [ROADMAP.md](./ROADMAP.md).

## Installation

Prérequis : **Node.js ≥ 18.18** (recommandé : 20 LTS ou plus récent) et npm.

```bash
git clone <url-du-dépôt>
cd lexwatch
npm install
```

## Configuration

La configuration du site (nom, description, URL canonique, réseaux sociaux, navigation) est centralisée dans [`lib/site-config.ts`](./lib/site-config.ts) — c'est le seul fichier à modifier pour adapter les métadonnées globales du site à un environnement réel. Avant toute mise en ligne, remplacer :

- `siteConfig.url` (actuellement un domaine d'exemple),
- `siteConfig.twitterHandle` (placeholder).

## Variables d'environnement

Toutes les variables sont **optionnelles** : le site fonctionne intégralement sans elles (aucun script tiers n'est chargé tant qu'une variable n'est pas définie). Copier `.env.example` vers `.env.local` et renseigner ce qui est utile :

```bash
cp .env.example .env.local
```

Voir [`.env.example`](./.env.example) pour le détail de chaque variable. Aucun secret réel n'est requis par l'architecture actuelle (pas de clé d'API privée, pas de chaîne de connexion) : toutes les variables consommées sont préfixées `NEXT_PUBLIC_` (identifiants analytics et jetons de vérification webmaster, publics par nature).

## Lancement en développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) pour le site public, [http://localhost:3000/admin](http://localhost:3000/admin) pour l'espace d'administration (aucune authentification n'est requise dans cette phase — voir [SECURITY.md](./SECURITY.md)).

## Build de production

```bash
npm run build
npm run start
```

`npm run build` échoue si TypeScript ou ESLint rapporte une erreur (vérification intégrée au build Next.js). Avant tout déploiement, faire tourner :

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

## Structure du projet

```
app/                       Routes (App Router)
  (site public)
    comprendre/             Bibliothèque de fiches + page de détail [slug]
    veille-juridique/       Liste d'analyses + page de détail [slug]
    glossaire/              Glossaire (une seule page, ancres par terme)
    ressources/             Sélection de ressources externes
    a-propos/, contact/,
    mentions-legales/,
    confidentialite/        Pages institutionnelles
    sitemap.ts, sitemap/    Sitemaps (plat + par catégorie) et sitemap-index.xml
    robots.ts               robots.txt généré (interdit /admin)
    manifest.ts             Web App Manifest
    icon.tsx, apple-icon.tsx, opengraph-image.tsx   Assets générés dynamiquement
    layout.tsx              Layout racine (polices, metadata, JSON-LD global)
    error.tsx, global-error.tsx, not-found.tsx, loading.tsx   Écrans d'erreur/chargement racine
  admin/                    Back-office (fiches, veille, glossaire, ressources,
                             catégories, médiathèque, réglages du site) — voir lib/admin/
  api/upload/               Upload de fichiers pour /admin/reglages (disque local,
                             voir la limitation ci-dessus)

components/
  ui/                       Design system (Button, Card, Badge, Tag, Input, Select,
                             Heading, Paragraph, Section, Container, Sheet, EmptyState…)
  layout/                   Header, Footer, habillage du site public
  shared/                   Composants transverses (Breadcrumb, PageHeader,
                             ContentBlocks, LegalReference, Timeline, SearchExperience…)
  admin/                    Composants propres au back-office (éditeur de blocs,
                             médiathèque, formulaires, panneau SEO…)
  home/, comprendre/, veille/, glossaire/, about/, search/, seo/, analytics/
                             Composants propres à chaque section du site public

lib/                        Logique applicative : accès aux données (content.ts),
                             SEO (metadata.ts, json-ld.ts, sitemap.ts), configuration
                             (site-config.ts, analytics-config.ts), utilitaires
  admin/                    Repository en mémoire, server actions, auth stub,
                             recherche admin, journal d'activité

hooks/                      Hooks partagés (useDisclosure, useScrolled, useMediaQuery,
                             useDebouncedValue, useRecentSearches, useAutosave)
data/                       Contenus éditoriaux du site public (TypeScript typé)
types/                      Types partagés entre data/, lib/ et components/
styles/globals.css          Design tokens (couleurs, rayons, animations) et thème Tailwind v4
public/                     Assets statiques (icônes/images réservées, voir PWA ci-dessous)
```

### Progressive Web App (préparation)

L'architecture est prête à accueillir une PWA complète sans réorganisation :

- `app/manifest.ts` génère déjà un Web App Manifest valide.
- `app/icon.tsx` / `app/apple-icon.tsx` génèrent dynamiquement les favicons.
- `public/icons/` et `public/images/` sont réservés aux assets statiques (icônes 192×192/512×512 maskables, splash screens iOS) qui restent à produire.

Ce dépôt **n'active pas** de service worker ni de mode hors-ligne : ce n'est pas fait ici volontairement (voir [ROADMAP.md](./ROADMAP.md)).

## Conventions de code

- TypeScript strict, aucun `any`.
- Un composant = un rôle ; au-delà d'environ 250 lignes, découper.
- Toute couleur ou rayon de bordure passe par un token Tailwind (`bg-navy-900`, `rounded-xl`…), jamais de valeur arbitraire type `bg-[#...]`.
- `Badge` porte du sens (domaine, statut) ; `Tag` est un libellé neutre (filtre, métadonnée) — ne pas les confondre.
- `Container` / `Section` centralisent la mise en page : ne pas dupliquer `mx-auto max-w-* px-*` dans une page.
- Les commentaires expliquent le **pourquoi** (une contrainte, un choix d'architecture), jamais le **quoi** — le code doit rester lisible sans eux.
- Formatage et imports : ESLint + Prettier font foi, pas de style manuel divergent (`npm run lint`, `npm run format`).

## Contribuer

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour le workflow de contribution, et [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) pour les règles de conduite. Les vulnérabilités de sécurité se signalent selon la procédure décrite dans [SECURITY.md](./SECURITY.md), pas via une issue publique.

## Checklist avant publication

À vérifier avant toute mise en ligne réelle (au-delà d'une démonstration) :

- [ ] `siteConfig.url` remplacé par le domaine réel de production (`lib/site-config.ts`).
- [ ] `siteConfig.twitterHandle` remplacé ou retiré s'il n'existe pas de compte réel.
- [ ] Variables d'environnement analytics/Search Console renseignées si ces outils sont utilisés (voir `.env.example`).
- [ ] **Authentification réelle mise en place sur `/admin`** — l'espace d'administration n'a aujourd'hui aucun contrôle d'accès (voir [SECURITY.md](./SECURITY.md)) : à ne jamais exposer publiquement en l'état.
- [ ] Persistance réelle branchée sur `lib/admin/repository.ts` — le dépôt actuel est en mémoire et perd toute modification au redémarrage du serveur.
- [ ] **Stockage objet réel branché sur `app/api/upload/route.ts`** (S3, Supabase Storage, Cloudinary…) avant toute mise en ligne sur un hébergeur serverless — l'upload sur disque local (`public/uploads/`) ne survit pas à un système de fichiers éphémère/lecture seule.
- [ ] `npm run typecheck`, `npm run lint`, `npm run format:check` et `npm run build` passent sans erreur.
- [ ] En-têtes de sécurité vérifiés en environnement réel (voir `next.config.ts` et [SECURITY.md](./SECURITY.md)).
- [ ] Icônes PWA statiques (192×192, 512×512) ajoutées si l'installation en PWA est souhaitée.

Voir aussi [CHANGELOG.md](./CHANGELOG.md) pour l'historique des versions et [ROADMAP.md](./ROADMAP.md) pour les évolutions prévues.
