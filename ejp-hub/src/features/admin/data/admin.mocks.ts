import type { AdminCategory, AuditLogEntry, PlatformSettings } from "../types/admin.types";

/**
 * Fixtures de démonstration du module Administration. Utilisées par
 * `MockAdminRepository` tant que Supabase n'est pas configuré (voir
 * `repositories/mock-admin-repository.ts`).
 */
function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86_400_000).toISOString();
}

export const INITIAL_MOCK_SETTINGS: PlatformSettings = {
  platformName: "EJP Hub",
  logoUrl: null,
  description: "Plateforme de centralisation pour les conducteurs de prière de l'EJP.",
  timezone: "Europe/Paris",
  language: "fr",
  updatedAt: daysAgo(30),
  updatedBy: { id: "mock-user", fullName: "Utilisateur Démo" },
};

/** Reprend les mêmes valeurs que le seed SQL, pour rester cohérent entre mode démo et Supabase. */
export const INITIAL_MOCK_CATEGORIES: AdminCategory[] = [
  { id: "cat-church", scope: "PRAYER_TOPIC_CATEGORY", label: "Église", value: "CHURCH", sortOrder: 0, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-family", scope: "PRAYER_TOPIC_CATEGORY", label: "Famille", value: "FAMILY", sortOrder: 1, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-youth", scope: "PRAYER_TOPIC_CATEGORY", label: "Jeunesse", value: "YOUTH", sortOrder: 2, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-evangelism", scope: "PRAYER_TOPIC_CATEGORY", label: "Évangélisation", value: "EVANGELISM", sortOrder: 3, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-healing", scope: "PRAYER_TOPIC_CATEGORY", label: "Guérison", value: "HEALING", sortOrder: 4, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-nations", scope: "PRAYER_TOPIC_CATEGORY", label: "Nations", value: "NATIONS", sortOrder: 5, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-personal", scope: "PRAYER_TOPIC_CATEGORY", label: "Personnel", value: "PERSONAL", sortOrder: 6, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-weekly", scope: "MEETING_TYPE", label: "Prière hebdomadaire", value: "WEEKLY_PRAYER", sortOrder: 0, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-vigil", scope: "MEETING_TYPE", label: "Veillée de prière", value: "VIGIL", sortOrder: 1, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
  { id: "cat-intercession", scope: "MEETING_TYPE", label: "Intercession", value: "INTERCESSION", sortOrder: 2, createdAt: daysAgo(300), updatedAt: daysAgo(300) },
];

export const INITIAL_MOCK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: "audit-1",
    actor: { id: "mock-user", fullName: "Utilisateur Démo" },
    action: "a accepté une demande d'adhésion",
    module: "Membres",
    targetLabel: "Claire Rousseau",
    createdAt: daysAgo(1),
  },
  {
    id: "audit-2",
    actor: { id: "mock-user", fullName: "Utilisateur Démo" },
    action: "a validé un compte rendu",
    module: "Comptes rendus",
    targetLabel: "Prière du mercredi soir",
    createdAt: daysAgo(1),
  },
  {
    id: "audit-3",
    actor: { id: "mock-user", fullName: "Utilisateur Démo" },
    action: "a rejeté un compte rendu",
    module: "Comptes rendus",
    targetLabel: "Prière d'intercession",
    createdAt: daysAgo(3),
  },
  {
    id: "audit-4",
    actor: { id: "mock-user", fullName: "Utilisateur Démo" },
    action: "a suspendu un membre",
    module: "Membres",
    targetLabel: "Marie Petit",
    createdAt: daysAgo(4),
  },
  {
    id: "audit-5",
    actor: { id: "mock-user", fullName: "Utilisateur Démo" },
    action: "a confirmé un changement de rôle",
    module: "Membres",
    targetLabel: "Jean Martin — Conducteur de prière",
    createdAt: daysAgo(10),
  },
  {
    id: "audit-6",
    actor: { id: "member-sarah", fullName: "Sarah Nguyen" },
    action: "a archivé un sujet de prière",
    module: "Sujets de prière",
    targetLabel: "Missions à l'étranger",
    createdAt: daysAgo(15),
  },
  {
    id: "audit-7",
    actor: { id: "mock-user", fullName: "Utilisateur Démo" },
    action: "a supprimé un compte rendu",
    module: "Comptes rendus",
    targetLabel: "Prière du jeudi (doublon)",
    createdAt: daysAgo(20),
  },
];
