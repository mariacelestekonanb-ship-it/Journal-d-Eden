import type { Member, MemberAssignmentSummary, MemberReportSummary } from "../types/member.types";

/**
 * Fixtures de démonstration du module Membres. Utilisées par
 * `MockMemberRepository` tant que Supabase n'est pas configuré (voir
 * `repositories/mock-member-repository.ts`).
 *
 * L'identifiant `mock-user` correspond à `MOCK_PROFILE` (voir
 * `shared/constants/mock-profile.ts`) — c'est le membre dont « Mon profil »
 * affiche les informations en mode démo.
 */
function timestamp(offsetDays: number): string {
  return new Date(Date.now() - offsetDays * 86_400_000).toISOString();
}

export const INITIAL_MOCK_MEMBERS: Member[] = [
  {
    id: "mock-user",
    firstName: "Utilisateur",
    lastName: "Démo",
    fullName: "Utilisateur Démo",
    email: "demo@ejp-hub.org",
    phone: null,
    photoUrl: null,
    role: "ADMIN",
    status: "ACTIVE",
    registeredAt: timestamp(400),
    validatedAt: timestamp(400),
    validatedBy: null,
    createdAt: timestamp(400),
    updatedAt: timestamp(400),
  },
  {
    id: "member-marc",
    firstName: "Marc",
    lastName: "Dupont",
    fullName: "Marc Dupont",
    email: "marc.dupont@ejp-hub.org",
    phone: "+33600000002",
    photoUrl: null,
    role: "PRAYER_LEADER",
    status: "ACTIVE",
    registeredAt: timestamp(210),
    validatedAt: timestamp(209),
    validatedBy: { id: "mock-user", fullName: "Utilisateur Démo" },
    createdAt: timestamp(210),
    updatedAt: timestamp(209),
  },
  {
    id: "member-sarah",
    firstName: "Sarah",
    lastName: "Nguyen",
    fullName: "Sarah Nguyen",
    email: "sarah.nguyen@ejp-hub.org",
    phone: "+33600000003",
    photoUrl: null,
    role: "PRAYER_LEADER",
    status: "ACTIVE",
    registeredAt: timestamp(180),
    validatedAt: timestamp(179),
    validatedBy: { id: "mock-user", fullName: "Utilisateur Démo" },
    createdAt: timestamp(180),
    updatedAt: timestamp(179),
  },
  {
    id: "member-jean",
    firstName: "Jean",
    lastName: "Martin",
    fullName: "Jean Martin",
    email: "jean.martin@ejp-hub.org",
    phone: "+33600000004",
    photoUrl: null,
    role: "PRAYER_LEADER",
    status: "ACTIVE",
    registeredAt: timestamp(120),
    validatedAt: timestamp(119),
    validatedBy: { id: "mock-user", fullName: "Utilisateur Démo" },
    createdAt: timestamp(120),
    updatedAt: timestamp(119),
  },
  {
    id: "member-marie",
    firstName: "Marie",
    lastName: "Petit",
    fullName: "Marie Petit",
    email: "marie.petit@ejp-hub.org",
    phone: "+33600000005",
    photoUrl: null,
    role: "PRAYER_LEADER",
    status: "SUSPENDED",
    registeredAt: timestamp(300),
    validatedAt: timestamp(299),
    validatedBy: { id: "mock-user", fullName: "Utilisateur Démo" },
    createdAt: timestamp(300),
    updatedAt: timestamp(15),
  },
  {
    id: "member-paul",
    firstName: "Paul",
    lastName: "Lefèvre",
    fullName: "Paul Lefèvre",
    email: "paul.lefevre@ejp-hub.org",
    phone: "+33600000006",
    photoUrl: null,
    role: "PRAYER_LEADER",
    status: "REFUSED",
    registeredAt: timestamp(60),
    validatedAt: timestamp(58),
    validatedBy: { id: "mock-user", fullName: "Utilisateur Démo" },
    createdAt: timestamp(60),
    updatedAt: timestamp(58),
  },
  {
    id: "member-claire",
    firstName: "Claire",
    lastName: "Rousseau",
    fullName: "Claire Rousseau",
    email: "claire.rousseau@ejp-hub.org",
    phone: "+33600000007",
    photoUrl: null,
    role: "PRAYER_LEADER",
    status: "PENDING",
    registeredAt: timestamp(3),
    validatedAt: null,
    validatedBy: null,
    createdAt: timestamp(3),
    updatedAt: timestamp(3),
  },
  {
    id: "member-thomas",
    firstName: "Thomas",
    lastName: "Girard",
    fullName: "Thomas Girard",
    email: "thomas.girard@ejp-hub.org",
    phone: "+33600000008",
    photoUrl: null,
    role: "PRAYER_LEADER",
    status: "PENDING",
    registeredAt: timestamp(1),
    validatedAt: null,
    validatedBy: null,
    createdAt: timestamp(1),
    updatedAt: timestamp(1),
  },
];

/** Historique Planning fictif — seuls les membres actifs de longue date en ont un. */
export const MOCK_MEMBER_ASSIGNMENTS: Record<string, MemberAssignmentSummary[]> = {
  "member-marc": [
    { id: "slot-1", title: "Prière du mercredi soir", date: timestamp(150).slice(0, 10), startTime: "18:00", endTime: "19:00", status: "COMPLETED" },
    { id: "slot-7", title: "Prière pour les missions", date: timestamp(20).slice(0, 10), startTime: "20:00", endTime: "21:00", status: "COMPLETED" },
  ],
  "member-sarah": [
    { id: "slot-2", title: "Prière du matin", date: timestamp(100).slice(0, 10), startTime: "06:30", endTime: "07:15", status: "COMPLETED" },
    { id: "slot-8", title: "Prière du dimanche", date: timestamp(60).slice(0, 10), startTime: "09:00", endTime: "10:00", status: "COMPLETED" },
    { id: "slot-10", title: "Prière du dimanche à venir", date: timestamp(-2).slice(0, 10), startTime: "09:00", endTime: "10:00", status: "CONFIRMED" },
  ],
  "member-jean": [
    { id: "slot-4", title: "Prière d'intercession", date: timestamp(40).slice(0, 10), startTime: "18:00", endTime: "19:00", status: "COMPLETED" },
    { id: "slot-9", title: "Prière du jeudi", date: timestamp(1).slice(0, 10), startTime: "18:00", endTime: "19:00", status: "COMPLETED" },
  ],
  "member-marie": [
    { id: "slot-6", title: "Prière pour les familles", date: timestamp(1).slice(0, 10), startTime: "19:30", endTime: "20:30", status: "COMPLETED" },
  ],
};

/** Historique Comptes rendus fictif. */
export const MOCK_MEMBER_REPORTS: Record<string, MemberReportSummary[]> = {
  "member-marc": [
    { id: "report-1", planningSlotTitle: "Prière du mercredi soir", date: timestamp(150).slice(0, 10), status: "VALIDATED" },
    { id: "report-7", planningSlotTitle: "Prière pour les missions", date: timestamp(20).slice(0, 10), status: "SUBMITTED" },
  ],
  "member-sarah": [
    { id: "report-2", planningSlotTitle: "Prière du matin", date: timestamp(100).slice(0, 10), status: "VALIDATED" },
    { id: "report-8", planningSlotTitle: "Prière du dimanche", date: timestamp(60).slice(0, 10), status: "VALIDATED" },
  ],
  "member-jean": [{ id: "report-4", planningSlotTitle: "Prière d'intercession", date: timestamp(40).slice(0, 10), status: "REJECTED" }],
  "member-marie": [],
};
