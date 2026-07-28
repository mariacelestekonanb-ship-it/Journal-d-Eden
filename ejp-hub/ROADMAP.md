# Roadmap

## Sprint 1 — Fondations ✅

- Architecture Feature First (`app/`, `features/`, `shared/`, `styles/`, `docs/`).
- Design system maison (`AppButton`, `AppCard`, `AppBadge`, `AppAvatar`, `AppEmptyState`,
  `AppPageHeader`, `AppSection`, `AppLoader`) au-dessus des primitives shadcn/ui.
- Layout global responsive (sidebar fixe desktop / coulissante mobile, header avec logo,
  recherche placeholder, notifications placeholder, avatar, menu utilisateur).
- Mode clair / sombre via `next-themes`, palette entièrement pilotée par variables CSS.
- 7 pages vides (Tableau de bord, Planning, Sujets de prière, Comptes rendus, Témoignages,
  Mon profil, Administration), chacune avec titre, description et état vide élégant.
- Qualité : TypeScript strict, ESLint, Prettier, alias `@/*`, build de production vérifié.

## Sprint 2 — Authentification et sécurité ✅ (ce livrable)

- Middleware réel : redirection vers `/connexion` si non authentifié, blocage de
  `/administration` pour les `PRAYER_LEADER` — voir `AUTHENTICATION.md`.
- Rôles `ADMIN` / `PRAYER_LEADER`, architecture extensible (`ROLES`, `ROUTE_PERMISSIONS`)
  pour ajouter un rôle ou une route protégée sans toucher au middleware.
- `AuthProvider` / `RoleProvider` + hooks `useAuth()`, `useUser()`, `useRole()` +
  `<RoleGuard>`.
- Page de réinitialisation de mot de passe (`/reinitialiser-mot-de-passe`), flux complet
  mot de passe oublié → e-mail → nouveau mot de passe.
- Layout connecté affichant nom, avatar, rôle et bouton de déconnexion réels.
- Migrations Supabase CLI complètes (`supabase/migrations/`) : `profiles`, `prayer_topics`,
  `planning`, `reports`, `testimonies`, `notifications`, RLS, storage `avatars`.
- Script de seed (`npm run db:seed`) : 1 administrateur + 2 conducteurs de prière.
- `SUPABASE_SETUP.md`, `AUTHENTICATION.md`, `DATABASE.md`.
- Mode démo conservé : le shell reste consultable sans configurer Supabase.

## Sprint 3 — Premier module de données

- [ ] Provisionner un vrai projet Supabase partagé par l'équipe, exécuter les migrations,
      lancer le seed.
- [ ] Développer le module **Sujets de prière** (CRUD, priorité, archivage automatique) —
      candidat naturel pour valider le pattern `hooks/services/validation/actions` de bout
      en bout avant de le répliquer sur les autres modules.
- [ ] Brancher le Tableau de bord sur de vraies données une fois 1 à 2 modules disponibles.
- [ ] Module **Administration** : lister/inviter des utilisateurs (l'inscription publique
      étant désactivée, c'est le seul moyen de créer un compte hors seed).

## Sprint 4 et suivants

- [ ] Planning (vues semaine/mois, import Excel, export PDF/Excel, impression).
- [ ] Comptes rendus (liés à un créneau, un conducteur ne remplit que le sien, export
      PDF/Word).
- [ ] Témoignages (publication, suppression réservée admin).
- [ ] Notifications (prochain temps de prière, CR en attente, nouveaux sujets) — la
      structure existe déjà (table `notifications`), reste la génération et l'UI.
- [ ] Import / Export transverse.

## Améliorations proposées avant le Sprint 3

Voir le rapport de livraison pour le détail — résumé :

1. Décider de l'organisation finale du dépôt (EJP Hub à côté de LexWatch, ou dépôt dédié).
2. Provisionner un projet Supabase de développement partagé par l'équipe (actuellement
   personne n'a testé l'authentification contre un vrai projet).
3. Activer la confirmation d'e-mail (`enable_confirmations`) avant tout déploiement public —
   désactivée dans `supabase/config.toml` uniquement pour accélérer le développement local.
4. Écrire quelques tests (Vitest + Testing Library) sur les guards de rôle et le design
   system avant qu'ils ne soient utilisés par de nombreux modules.
5. Ajouter un pipeline CI (lint + typecheck + build) sur chaque pull request.
6. Définir la politique de complexité de mot de passe côté Supabase Auth (dashboard →
   Authentication → Policies) — non configurée à ce stade.
