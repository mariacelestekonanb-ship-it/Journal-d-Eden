import type { BibleReference, PrayerPoint, Report, ReportComment, ReportParticipant, ReportSlotOption } from "../types/report.types";

/**
 * Fixtures de démonstration du module Comptes rendus. Utilisées par
 * `MockReportRepository` tant que Supabase n'est pas configuré (voir
 * `repositories/mock-report-repository.ts`).
 *
 * L'identifiant `mock-user` correspond à `MOCK_PROFILE` (voir
 * `shared/constants/mock-profile.ts`) — plusieurs CR lui sont attribués
 * comme auteur pour que le mode démo reste utilisable en testant le rôle
 * PRAYER_LEADER (isolation stricte : un conducteur ne doit voir que ses
 * propres comptes rendus).
 */
const CURRENT_DEMO_USER: ReportParticipant = { id: "mock-user", fullName: "Utilisateur Démo" };

const LEADERS = {
  demo: CURRENT_DEMO_USER,
  marc: { id: "author-marc", fullName: "Marc Dupont" },
  sarah: { id: "author-sarah", fullName: "Sarah Nguyen" },
  jean: { id: "author-jean", fullName: "Jean Martin" },
  marie: { id: "author-marie", fullName: "Marie Petit" },
} satisfies Record<string, ReportParticipant>;

interface MockSlot {
  id: string;
  title: string;
  offsetDays: number;
  startTime: string;
  endTime: string;
  location: string;
  leader: ReportParticipant;
}

function isoDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function timestamp(offsetDays: number): string {
  return new Date(Date.now() - offsetDays * 86_400_000).toISOString();
}

function refs(reportId: string, section: string, references: string[]): BibleReference[] {
  return references.map((reference, index) => ({ id: `${reportId}-${section}-${index}`, reference }));
}

function point(reportId: string, index: number, title: string, references: string[]): PrayerPoint {
  return { id: `${reportId}-point-${index}`, title, references: refs(reportId, `point-${index}`, references) };
}

const MOCK_SLOTS: MockSlot[] = [
  { id: "slot-1", title: "Prière du mercredi soir", offsetDays: -150, startTime: "18:00", endTime: "19:00", location: "Salle de prière", leader: LEADERS.marc },
  { id: "slot-2", title: "Prière du matin", offsetDays: -100, startTime: "06:30", endTime: "07:15", location: "En ligne", leader: LEADERS.sarah },
  { id: "slot-3", title: "Veillée de prière", offsetDays: -10, startTime: "20:00", endTime: "21:30", location: "Salle de prière", leader: LEADERS.demo },
  { id: "slot-4", title: "Prière d'intercession", offsetDays: -40, startTime: "18:00", endTime: "19:00", location: "Salle de prière", leader: LEADERS.jean },
  { id: "slot-5", title: "Prière en ligne", offsetDays: -2, startTime: "06:30", endTime: "07:15", location: "En ligne", leader: LEADERS.marie },
  { id: "slot-6", title: "Prière pour les familles", offsetDays: -1, startTime: "19:30", endTime: "20:30", location: "Chapelle", leader: LEADERS.demo },
  { id: "slot-7", title: "Prière pour les missions", offsetDays: -20, startTime: "20:00", endTime: "21:00", location: "Salle polyvalente", leader: LEADERS.marc },
  { id: "slot-8", title: "Prière du dimanche", offsetDays: -60, startTime: "09:00", endTime: "10:00", location: "Salle de prière", leader: LEADERS.sarah },
  { id: "slot-9", title: "Prière du jeudi", offsetDays: -1, startTime: "18:00", endTime: "19:00", location: "Salle de prière", leader: LEADERS.jean },
  { id: "slot-10", title: "Prière du dimanche à venir", offsetDays: 2, startTime: "09:00", endTime: "10:00", location: "Salle de prière", leader: LEADERS.sarah },
];

function slotRef(id: string) {
  const slot = MOCK_SLOTS.find((candidate) => candidate.id === id);
  if (!slot) throw new Error(`Créneau fictif inconnu : ${id}`);
  return {
    id: slot.id,
    title: slot.title,
    date: isoDate(slot.offsetDays),
    startTime: slot.startTime,
    endTime: slot.endTime,
    location: slot.location,
  };
}

function leaderOf(slotId: string): ReportParticipant {
  const slot = MOCK_SLOTS.find((candidate) => candidate.id === slotId);
  if (!slot) throw new Error(`Créneau fictif inconnu : ${slotId}`);
  return slot.leader;
}

export const INITIAL_MOCK_REPORTS: Report[] = [
  {
    id: "report-1",
    planningSlot: slotRef("slot-1"),
    leader: leaderOf("slot-1"),
    authorId: CURRENT_DEMO_USER.id,
    authorName: CURRENT_DEMO_USER.fullName,
    generalInfo: { date: isoDate(-150), startTime: "18:00", endTime: "19:05", connectedCount: 24, hasInstrumental: true },
    thanksgiving: refs("report-1", "thanksgiving", ["Psaume 100:4", "Psaume 65:4"]),
    holySpiritInvitation: refs("report-1", "holy-spirit", ["Jean 14:26", "Actes 1:8"]),
    prayerPoints: [
      point("report-1", 1, "Prions pour que l'EJP soit une église de foi.", ["Hébreux 11:6", "Jérémie 29:11", "Romains 10:17"]),
      point("report-1", 2, "Prions pour les nouveaux visiteurs présents ce soir.", ["Luc 15:10"]),
    ],
    closingThanksgiving: refs("report-1", "closing", ["Psaume 107:1"]),
    announcements: "Reconduire ce créneau hebdomadaire jusqu'à la fin du trimestre. Prévoir un temps d'accueil dédié aux nouveaux visiteurs.",
    status: "VALIDATED",
    createdAt: timestamp(150),
    updatedAt: timestamp(145),
    submittedAt: timestamp(149),
    validatedAt: timestamp(145),
  },
  {
    id: "report-2",
    planningSlot: slotRef("slot-2"),
    leader: leaderOf("slot-2"),
    authorId: LEADERS.sarah.id,
    authorName: LEADERS.sarah.fullName,
    generalInfo: { date: isoDate(-100), startTime: "06:30", endTime: "07:15", connectedCount: 15, hasInstrumental: false },
    thanksgiving: refs("report-2", "thanksgiving", ["Psaume 95:2"]),
    holySpiritInvitation: refs("report-2", "holy-spirit", ["Romains 8:26"]),
    prayerPoints: [point("report-2", 1, "Prions pour la stabilité de la connexion des participants en ligne.", ["Philippiens 4:6-7"])],
    closingThanksgiving: refs("report-2", "closing", ["1 Thessaloniciens 5:18"]),
    announcements: "Tester une plateforme de visioconférence alternative la semaine prochaine.",
    status: "VALIDATED",
    createdAt: timestamp(100),
    updatedAt: timestamp(95),
    submittedAt: timestamp(99),
    validatedAt: timestamp(95),
  },
  {
    id: "report-3",
    planningSlot: slotRef("slot-3"),
    leader: leaderOf("slot-3"),
    authorId: CURRENT_DEMO_USER.id,
    authorName: CURRENT_DEMO_USER.fullName,
    generalInfo: { date: isoDate(-10), startTime: "20:00", endTime: "21:45", connectedCount: 38, hasInstrumental: true },
    thanksgiving: refs("report-3", "thanksgiving", ["Psaume 100:4", "Psaume 84:10"]),
    holySpiritInvitation: refs("report-3", "holy-spirit", ["Jean 14:26"]),
    prayerPoints: [
      point("report-3", 1, "Prions pour les malades de notre communauté.", ["Jacques 5:14-15"]),
      point("report-3", 2, "Prions pour les familles en difficulté.", ["Psaume 34:19", "Matthieu 11:28"]),
      point("report-3", 3, "Prions pour l'unité de l'église.", ["Éphésiens 4:3"]),
    ],
    closingThanksgiving: refs("report-3", "closing", ["Psaume 107:1", "Psaume 118:1"]),
    announcements: "Renouveler la veillée le mois prochain à la même date. Prévoir davantage de chaises et une salle de débordement.",
    status: "SUBMITTED",
    createdAt: timestamp(10),
    updatedAt: timestamp(9),
    submittedAt: timestamp(9),
    validatedAt: null,
  },
  {
    id: "report-4",
    planningSlot: slotRef("slot-4"),
    leader: leaderOf("slot-4"),
    authorId: LEADERS.jean.id,
    authorName: LEADERS.jean.fullName,
    generalInfo: { date: isoDate(-40), startTime: "18:00", endTime: "19:00", connectedCount: 12, hasInstrumental: false },
    thanksgiving: refs("report-4", "thanksgiving", ["Psaume 136:1"]),
    holySpiritInvitation: refs("report-4", "holy-spirit", ["Actes 1:8"]),
    prayerPoints: [point("report-4", 1, "Prions pour les familles en difficulté financière.", ["Philippiens 4:19"])],
    closingThanksgiving: refs("report-4", "closing", ["Psaume 107:1"]),
    announcements: "Créneau mal annoncé, faible participation. Mieux communiquer sur ce créneau la semaine prochaine.",
    status: "REJECTED",
    createdAt: timestamp(40),
    updatedAt: timestamp(38),
    submittedAt: timestamp(39),
    validatedAt: null,
  },
  {
    id: "report-5",
    planningSlot: slotRef("slot-5"),
    leader: leaderOf("slot-5"),
    authorId: LEADERS.marie.id,
    authorName: LEADERS.marie.fullName,
    generalInfo: { date: isoDate(-2), startTime: "06:30", endTime: "07:15", connectedCount: null, hasInstrumental: false },
    thanksgiving: [],
    holySpiritInvitation: [],
    prayerPoints: [],
    closingThanksgiving: [],
    announcements: "",
    status: "DRAFT",
    createdAt: timestamp(2),
    updatedAt: timestamp(2),
    submittedAt: null,
    validatedAt: null,
  },
  {
    id: "report-6",
    planningSlot: slotRef("slot-6"),
    leader: leaderOf("slot-6"),
    authorId: CURRENT_DEMO_USER.id,
    authorName: CURRENT_DEMO_USER.fullName,
    generalInfo: { date: isoDate(-1), startTime: "19:30", endTime: "20:30", connectedCount: 20, hasInstrumental: true },
    thanksgiving: refs("report-6", "thanksgiving", ["Psaume 100:4"]),
    holySpiritInvitation: [],
    prayerPoints: [point("report-6", 1, "Prions pour les familles de l'église.", ["Josué 24:15"])],
    closingThanksgiving: [],
    announcements: "Brouillon en cours de rédaction, à reprendre plus tard.",
    status: "DRAFT",
    createdAt: timestamp(1),
    updatedAt: timestamp(1),
    submittedAt: null,
    validatedAt: null,
  },
  {
    id: "report-7",
    planningSlot: slotRef("slot-7"),
    leader: leaderOf("slot-7"),
    authorId: LEADERS.marc.id,
    authorName: LEADERS.marc.fullName,
    generalInfo: { date: isoDate(-20), startTime: "20:00", endTime: "21:00", connectedCount: 18, hasInstrumental: false },
    thanksgiving: refs("report-7", "thanksgiving", ["Psaume 96:1-3"]),
    holySpiritInvitation: refs("report-7", "holy-spirit", ["Romains 8:26"]),
    prayerPoints: [
      point("report-7", 1, "Prions pour les équipes envoyées en mission.", ["Matthieu 28:19-20", "Ésaïe 6:8"]),
      point("report-7", 2, "Prions pour leur protection et leur santé.", ["Psaume 91:11"]),
    ],
    closingThanksgiving: refs("report-7", "closing", ["Psaume 107:1"]),
    announcements: "Envoyer un mot d'encouragement collectif aux équipes. Planifier un point mensuel de suivi des missions.",
    status: "SUBMITTED",
    createdAt: timestamp(20),
    updatedAt: timestamp(19),
    submittedAt: timestamp(19),
    validatedAt: null,
  },
  {
    id: "report-8",
    planningSlot: slotRef("slot-8"),
    leader: leaderOf("slot-8"),
    authorId: LEADERS.sarah.id,
    authorName: LEADERS.sarah.fullName,
    generalInfo: { date: isoDate(-60), startTime: "09:00", endTime: "10:15", connectedCount: 45, hasInstrumental: true },
    thanksgiving: refs("report-8", "thanksgiving", ["Psaume 100:4", "Psaume 150:6"]),
    holySpiritInvitation: refs("report-8", "holy-spirit", ["Jean 14:26", "Joël 2:28"]),
    prayerPoints: [
      point("report-8", 1, "Prions pour les nouveaux visiteurs du dimanche.", ["Luc 15:10"]),
      point("report-8", 2, "Prions pour la générosité de l'église.", ["2 Corinthiens 9:7"]),
    ],
    closingThanksgiving: refs("report-8", "closing", ["Psaume 118:24"]),
    announcements: "Poursuivre ce format de louange prolongée en ouverture. Recontacter les nouveaux visiteurs dans la semaine.",
    status: "VALIDATED",
    createdAt: timestamp(60),
    updatedAt: timestamp(56),
    submittedAt: timestamp(59),
    validatedAt: timestamp(56),
  },
];

export const INITIAL_MOCK_COMMENTS: ReportComment[] = [
  {
    id: "comment-1",
    reportId: "report-4",
    authorId: "mock-user",
    authorName: "Utilisateur Démo",
    message:
      "Merci pour ce compte rendu. Peux-tu préciser les raisons de la faible participation et proposer une nouvelle date de communication avant resoumission ?",
    createdAt: timestamp(38),
  },
];

/**
 * Tous les créneaux fictifs du Planning, sous la forme `ReportSlotOption`.
 * `MockReportRepository` en dérive dynamiquement la liste des créneaux
 * encore disponibles (ceux qui n'ont pas déjà un compte rendu dans l'état
 * mutable du dépôt) — voir `repositories/mock-report-repository.ts`.
 */
export const MOCK_SLOT_OPTIONS: ReportSlotOption[] = MOCK_SLOTS.map((slot) => ({
  id: slot.id,
  title: slot.title,
  date: isoDate(slot.offsetDays),
  startTime: slot.startTime,
  endTime: slot.endTime,
  location: slot.location,
  leaderId: slot.leader.id,
  leaderName: slot.leader.fullName,
}));
