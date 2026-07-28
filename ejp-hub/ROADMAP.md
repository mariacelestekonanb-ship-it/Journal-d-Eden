# Roadmap

## Sprint 1 — Fondations ✅ (ce livrable)

- Architecture Feature First (`app/`, `features/`, `shared/`, `styles/`, `docs/`).
- Design system maison (`AppButton`, `AppCard`, `AppBadge`, `AppAvatar`, `AppEmptyState`,
  `AppPageHeader`, `AppSection`, `AppLoader`) au-dessus des primitives shadcn/ui.
- Layout global responsive (sidebar fixe desktop / coulissante mobile, header avec logo,
  recherche placeholder, notifications placeholder, avatar, menu utilisateur).
- Mode clair / sombre via `next-themes`, palette entièrement pilotée par variables CSS.
- 7 pages vides (Tableau de bord, Planning, Sujets de prière, Comptes rendus, Témoignages,
  Mon profil, Administration), chacune avec titre, description et état vide élégant.
- Authentification Supabase fonctionnelle (connexion, mot de passe oublié, déconnexion,
  rafraîchissement de session) — non encore gatée strictement sur le shell (voir
  `ARCHITECTURE.md`).
- Schéma de base de données complet et RLS (`src/docs/database.sql`), prêt à être exécuté.
- Qualité : TypeScript strict, ESLint, Prettier, alias `@/*`, build de production vérifié.

## Sprint 2 — Authentification réelle + premier module de données

- [ ] Activer le gate d'authentification strict sur `(app)/layout.tsx` et `middleware.ts`
      (retirer le repli sur `PLACEHOLDER_PROFILE`).
- [ ] Provisionner un vrai projet Supabase (exécuter `src/docs/database.sql`, régénérer
      `shared/types/database.ts`).
- [ ] Développer le module **Sujets de prière** (CRUD, priorité, archivage automatique) —
      candidat naturel pour valider le pattern `hooks/services/validation/actions` de bout
      en bout avant de le répliquer sur les autres modules.
- [ ] Brancher le Tableau de bord sur de vraies données une fois 1 à 2 modules disponibles.

## Sprint 3 et suivants

- [ ] Planning (vues semaine/mois, import Excel, export PDF/Excel, impression).
- [ ] Comptes rendus (liés à un créneau, un conducteur ne remplit que le sien, export
      PDF/Word).
- [ ] Témoignages (publication, suppression réservée admin).
- [ ] Administration (gestion des comptes, rôles, activation/désactivation).
- [ ] Notifications (prochain temps de prière, CR en attente, nouveaux sujets).
- [ ] Import / Export transverse.

## Améliorations proposées avant le Sprint 2

Voir le rapport de livraison pour le détail — résumé :

1. Décider de l'organisation finale du dépôt (EJP Hub à côté de LexWatch, ou dépôt dédié).
2. Provisionner un projet Supabase de développement partagé par l'équipe.
3. Écrire quelques tests (Vitest + Testing Library) sur le design system avant qu'il ne
   grossisse, pour éviter les régressions visuelles silencieuses.
4. Ajouter un pipeline CI (lint + typecheck + build) sur chaque pull request.
5. Choisir maintenant la bibliothèque d'icônes/emoji de statut pour les badges (priorité,
   rôle) afin de garder une cohérence visuelle dès le premier module métier.
