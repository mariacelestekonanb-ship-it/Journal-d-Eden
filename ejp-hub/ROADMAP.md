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
- `AuthProvider` / `RoleProvider` + hooks `useAuth()`, `useUser()`, `useRole()`.
- Page de réinitialisation de mot de passe (`/reinitialiser-mot-de-passe`), flux complet
  mot de passe oublié → e-mail → nouveau mot de passe.
- Layout connecté affichant nom, avatar, rôle et bouton de déconnexion réels.
- Migrations Supabase CLI complètes (`supabase/migrations/`) : `profiles`, `prayer_topics`,
  `planning`, `reports`, `testimonies`, `notifications`, RLS, storage `avatars`.
- Script de seed (`npm run db:seed`) : 1 administrateur + 2 conducteurs de prière.
- `SUPABASE_SETUP.md`, `AUTHENTICATION.md`, `DATABASE.md`.
- Mode démo conservé : le shell reste consultable sans configurer Supabase.

## Sprint 3 — Sujets de prière ✅

CRUD complet, catégorie/priorité/statut, archivage automatique, vues liste/cartes — premier
module de données de bout en bout (`hooks/services/validation/actions`), répliqué ensuite
par tous les modules suivants. Voir [`PRAYER_TOPICS.md`](./PRAYER_TOPICS.md).

## Sprint 4 — Planning ✅

Créneaux de prière, conducteurs assignés, vues Calendrier/Semaine/Mois/Liste (FullCalendar,
chargé en `next/dynamic`), export CSV, gestion des conflits. Voir [`PLANNING.md`](./PLANNING.md).

## Sprint 5 — Comptes rendus ✅ (puis refonte « chaîne de prière »)

Compte rendu lié à un créneau, workflow de validation, export. Refondu en cours de route pour
suivre fidèlement la structure d'une chaîne de prière (versets, points de prière réordonnables,
présences) plutôt qu'un simple texte libre. Voir [`REPORTS.md`](./REPORTS.md).

## Sprint 6 — Membres ✅

Demandes d'adhésion publiques (`/rejoindre`), validation admin, gestion des rôles, auto-profil.
Remplace le seed comme unique moyen de créer un compte en production. Voir [`MEMBERS.md`](./MEMBERS.md).

## Sprint 7 — Notifications ✅

Centre de notifications personnel, strictement isolé par utilisateur (y compris pour un
`ADMIN`), icône du Header. Voir [`NOTIFICATIONS.md`](./NOTIFICATIONS.md).

## Sprint 8 — Administration ✅

Tableau de bord admin agrégé, gestion des rôles, paramètres généraux, catégories
configurables, journal d'administration, recherche globale. Voir [`ADMIN.md`](./ADMIN.md).

## Sprint 9 — Intégration, Qualité et Finalisation (V1) ✅

Aucun nouveau module : audit global (imports/fichiers/composants dupliqués), uniformisation
des composants (Cards, boutons, formulaires), vérification navigation/permissions/responsive/
dark mode/performance/accessibilité, mise en place d'Error Boundaries et de pages d'erreur,
correction d'une élévation de privilèges possible via l'inscription (voir
`DATABASE.md#profiles`), documentation complète (dont ce fichier et `PROJECT.md`, créé à cette
occasion). Voir le rapport de livraison de ce sprint pour le détail complet.

## Reste à faire

- [ ] **Témoignages** : seul module encore à l'état de page vide — partage de témoignages par
      la communauté, publication et suppression réservée admin.
- [ ] Import / Export transverse (au-delà des exports CSV déjà présents par module).
- [ ] Câbler `AdminAuditService.record(...)` depuis les mutations notables de Membres, Comptes
      rendus et Sujets de prière (architecture prête, voir `ADMIN.md`).
- [ ] Câbler `NotificationService.notify(...)` (ou un trigger Postgres) depuis Planning,
      Comptes rendus, Membres et Sujets de prière pour les événements réels (architecture
      prête, voir `NOTIFICATIONS.md`).
- [ ] Implémenter réellement `AdminBackupService` (export, planification, restauration).

## Recommandations avant la mise en production

1. Provisionner un projet Supabase de production dédié (jamais le même que le développement
   partagé de l'équipe) et y appliquer toutes les migrations dans l'ordre.
2. Activer la confirmation d'e-mail (`enable_confirmations`) côté projet de production —
   désactivée dans `supabase/config.toml` uniquement pour accélérer le développement local.
3. Vérifier que l'inscription publique par e-mail (`enable_signup`) reste désactivée sur le
   projet de production (`supabase/config.toml` le fait déjà pour l'environnement local/CLI,
   mais ce réglage n'est pas garanti se propager automatiquement à un projet hébergé
   provisionné autrement — à vérifier manuellement dans Authentication → Providers → Email).
   Le trigger `handle_new_user` ne dépend plus de ce réglage pour sa sécurité (voir
   `DATABASE.md#profiles`), mais le désactiver ajoute une couche de défense supplémentaire.
4. Définir la politique de complexité de mot de passe côté Supabase Auth (dashboard →
   Authentication → Policies) — non configurée à ce stade.
5. Écrire des tests (Vitest + Testing Library) sur les guards de rôle, le trigger
   `prevent_privilege_escalation` et le design system — aucune suite de tests automatisés
   n'existe encore.
6. Ajouter un pipeline CI (typecheck + lint + build) sur chaque pull request — ces trois
   vérifications sont pour l'instant seulement exécutées manuellement avant chaque livraison.
7. Décider de l'organisation finale du dépôt (EJP Hub à côté de LexWatch, ou dépôt dédié).
