# Changelog

Toutes les évolutions notables de LexWatch sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) ; ce
projet suit [SemVer](https://semver.org/lang/fr/) une fois une première
version stable publiée. Avant cela (`0.x`), toute version peut contenir des
changements non rétrocompatibles.

## [1.0.0-rc.1] — 2026-07-27

Première Release Candidate : le périmètre fonctionnel de la V1 est complet,
le projet a été audité (UI, UX, accessibilité, SEO, code, sécurité) et
préparé pour un déploiement.

### Ajouté

- Documentation complète : `README.md`, `CHANGELOG.md`, `ROADMAP.md`,
  `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`,
  `.env.example`.
- En-têtes de sécurité (CSP, `X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`) via `next.config.ts`.
- Pages d'erreur manquantes (`error.tsx`, `global-error.tsx` racine, pages
  de liste sans état de chargement/erreur) pour une couverture complète.
- Configuration de déploiement (`vercel.json`, `netlify.toml`).

### Modifié

- Nettoyage final : suppression de dépendances, exports et composants
  inutilisés restants ; vérification qu'aucun `TODO`/commentaire de
  développement ne subsiste.

### Sécurité

- `/admin` explicitement exclu de l'indexation (`robots.ts`) — voir
  `SECURITY.md` pour les limites connues (pas d'authentification réelle).

## [0.5.0] — 2026-07-27 — Audit pré-lancement

- Audit UI/UX/accessibilité/SEO/code complet ; corrections de contraste
  (WCAG AA), de focus clavier, d'association des libellés de formulaire,
  de hiérarchie de titres, de cohérence des tokens de design (rayons,
  ombres), et de duplication de code.
- Nettoyage : composant et exports inutilisés retirés, dépendances Radix UI
  inutilisées supprimées.
- SEO : sitemap ne référence plus de pages `noIndex`, `robots.ts` interdit
  `/admin`, JSON-LD `FAQPage`/`DefinedTermSet` bornés au contenu réellement
  visible sans interaction.

## [0.4.0] — 2026-07-27 — Espace de rédaction

- Éditeur de blocs enrichi (sous-titre, tableau, encadrés, référence
  juridique, image, séparateur, bouton) partagé par les quatre types de
  contenu (fiches, analyses, glossaire, ressources).
- Sélecteur de médiathèque, image de couverture, statistiques d'écriture
  (mots, temps de lecture), extrait généré automatiquement, sauvegarde
  automatique de structure, résumé de validation avant publication.
- Panneau SEO par contenu avec aperçu Google.
- Aperçu avant publication composé des mêmes briques que le rendu public
  (pas de rendu séparé).

## [0.3.1] — 2026-07-27 — Page Comprendre (finitions)

- Grille de cartes (`KnowledgeCard`) à la place d'une liste, filtre de
  durée, tri « les plus consultées », distinction entre bibliothèque vide
  et recherche sans résultat.

## [0.3.0] — 2026-07-27 — Espace d'administration

- Modèle de données et repository en mémoire, server actions, stub
  d'authentification.
- Back-office complet : tableau de bord, modules Fiches / Veille /
  Glossaire / Ressources / Catégories / Médiathèque, éditeur de blocs,
  historique de révisions.
- Page « À propos » (mission, équipe, processus éditorial, sources).

## [0.2.0] — 2026-07-27 — SEO et recherche

- Recherche globale (`Ctrl/Cmd+K`) accessible depuis tout le site.
- Générateur de métadonnées centralisé, JSON-LD par type de contenu, fil
  d'Ariane avec `BreadcrumbList`, sitemaps par catégorie et sitemap plat,
  `robots.txt` généré.

## [0.1.0] — 2026-07-25 → 2026-07-26 — Fondations et contenu public

- Socle technique : design system (tokens Tailwind v4, composants `ui/`),
  hooks partagés, configuration SEO de base.
- Page d'accueil (Hero, recherche, questions, thèmes, veille, CTA).
- Bibliothèque Comprendre + modèle de fiche pédagogique (`/comprendre/[slug]`).
- Veille juridique + modèle d'analyse (`/veille-juridique/[slug]`).
- Glossaire juridique.

## [0.0.1] — 2026-07-25 — Scaffold initial

- Initialisation du dépôt Next.js 15 / React 19 / TypeScript / Tailwind v4.

[1.0.0-rc.1]: #
[0.5.0]: #
[0.4.0]: #
[0.3.1]: #
[0.3.0]: #
[0.2.0]: #
[0.1.0]: #
[0.0.1]: #
