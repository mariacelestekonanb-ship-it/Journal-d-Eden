import type { PlanningLeaderOption, PlanningPrayerTopicRef, PlanningProgramRef, PrayerSlot } from "../types/planning.types";
import { MOCK_PROGRAM_REFS } from "./program.mocks";

/**
 * Fixtures de démonstration du module Planning. Utilisées par
 * `MockPlanningRepository` tant que Supabase n'est pas configuré (voir
 * `services/planning-repository.ts`).
 */
export const MOCK_LEADERS: PlanningLeaderOption[] = [
  { id: "leader-alice", fullName: "Alice Administrateur" },
  { id: "leader-marc", fullName: "Marc Dupont" },
  { id: "leader-sarah", fullName: "Sarah Nguyen" },
  { id: "leader-jean", fullName: "Jean Martin" },
  { id: "leader-marie", fullName: "Marie Petit" },
];

export const MOCK_PRAYER_TOPICS: PlanningPrayerTopicRef[] = [
  { id: "topic-unite", title: "Unité de l'Église" },
  { id: "topic-reveil", title: "Réveil spirituel de la jeunesse" },
  { id: "topic-guerison", title: "Guérison des malades" },
  { id: "topic-perseverance", title: "Persévérance des familles" },
  { id: "topic-missions", title: "Missions à l'étranger" },
];

export const MOCK_LOCATIONS = ["Salle de prière", "En ligne", "Chapelle", "Salle polyvalente"];

export const MOCK_THEMES = ["Louange", "Intercession", "Action de grâce", "Repentance", "Guérison"];

function isoDate(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function leader(id: string): PlanningLeaderOption {
  const found = MOCK_LEADERS.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Conducteur fictif inconnu : ${id}`);
  return found;
}

function topic(id: string): PlanningPrayerTopicRef {
  const found = MOCK_PRAYER_TOPICS.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Sujet de prière fictif inconnu : ${id}`);
  return found;
}

function program(id: string): PlanningProgramRef {
  const found = MOCK_PROGRAM_REFS.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Programme fictif inconnu : ${id}`);
  return found;
}

function nextTimestamp(offsetMinutes: number): string {
  return new Date(Date.now() - offsetMinutes * 60_000).toISOString();
}

type BaseMockSlot = Omit<
  PrayerSlot,
  | "prayerLeaderResponse"
  | "prayerLeaderResponseComment"
  | "prayerLeaderResponseAt"
  | "secondaryLeaderResponse"
  | "secondaryLeaderResponseComment"
  | "secondaryLeaderResponseAt"
>;

/** Jeu de créneaux initial : passés (COMPLETED), en cours de semaine et à venir, statuts variés. */
const BASE_MOCK_SLOTS: BaseMockSlot[] = [
  {
    id: "slot-1",
    title: "Prière du mercredi soir",
    description: "Temps de prière hebdomadaire ouvert à tous.",
    date: isoDate(-7),
    startTime: "18:00",
    endTime: "19:00",
    location: MOCK_LOCATIONS[0]!,
    primaryLeader: leader("leader-marc"),
    secondaryLeader: null,
    status: "COMPLETED",
    theme: MOCK_THEMES[0]!,
    prayerTopic: topic("topic-unite"),
    program: null,
    notes: null,
    createdAt: nextTimestamp(60_000),
    updatedAt: nextTimestamp(60_000),
  },
  {
    id: "slot-2",
    title: "Prière du matin",
    description: null,
    date: isoDate(-2),
    startTime: "06:30",
    endTime: "07:15",
    location: MOCK_LOCATIONS[1]!,
    primaryLeader: leader("leader-sarah"),
    secondaryLeader: leader("leader-marie"),
    status: "COMPLETED",
    theme: MOCK_THEMES[1]!,
    prayerTopic: topic("topic-reveil"),
    program: null,
    notes: "Bonne participation malgré l'horaire matinal.",
    createdAt: nextTimestamp(50_000),
    updatedAt: nextTimestamp(48_000),
  },
  {
    id: "slot-3",
    title: "Veillée de prière",
    description: "Veillée mensuelle pour les malades.",
    date: isoDate(0),
    startTime: "20:00",
    endTime: "21:30",
    location: MOCK_LOCATIONS[0]!,
    primaryLeader: leader("leader-alice"),
    secondaryLeader: leader("leader-jean"),
    status: "CONFIRMED",
    theme: MOCK_THEMES[4]!,
    prayerTopic: topic("topic-guerison"),
    program: program("program-guerison"),
    notes: null,
    createdAt: nextTimestamp(40_000),
    updatedAt: nextTimestamp(40_000),
  },
  {
    id: "slot-4",
    title: "Prière d'intercession",
    description: null,
    date: isoDate(1),
    startTime: "18:00",
    endTime: "19:00",
    location: MOCK_LOCATIONS[0]!,
    primaryLeader: leader("leader-marc"),
    secondaryLeader: null,
    status: "CONFIRMED",
    theme: MOCK_THEMES[1]!,
    prayerTopic: null,
    program: null,
    notes: null,
    createdAt: nextTimestamp(35_000),
    updatedAt: nextTimestamp(35_000),
  },
  {
    id: "slot-5",
    title: "Prière en ligne",
    description: "Session ouverte à toute la communauté, connexion à distance.",
    date: isoDate(3),
    startTime: "06:30",
    endTime: "07:15",
    location: MOCK_LOCATIONS[1]!,
    primaryLeader: leader("leader-sarah"),
    secondaryLeader: null,
    status: "DRAFT",
    theme: MOCK_THEMES[0]!,
    prayerTopic: topic("topic-reveil"),
    program: null,
    notes: null,
    createdAt: nextTimestamp(20_000),
    updatedAt: nextTimestamp(20_000),
  },
  {
    id: "slot-6",
    title: "Prière pour les familles",
    description: null,
    date: isoDate(5),
    startTime: "19:30",
    endTime: "20:30",
    location: MOCK_LOCATIONS[2]!,
    primaryLeader: leader("leader-marie"),
    secondaryLeader: leader("leader-jean"),
    status: "DRAFT",
    theme: MOCK_THEMES[2]!,
    prayerTopic: topic("topic-perseverance"),
    program: program("program-jeunesse"),
    notes: null,
    createdAt: nextTimestamp(15_000),
    updatedAt: nextTimestamp(15_000),
  },
  {
    id: "slot-7",
    title: "Prière pour les missions",
    description: "Report exceptionnel — indisponibilité du lieu habituel.",
    date: isoDate(6),
    startTime: "20:00",
    endTime: "21:00",
    location: MOCK_LOCATIONS[3]!,
    primaryLeader: leader("leader-alice"),
    secondaryLeader: null,
    status: "CANCELLED",
    theme: MOCK_THEMES[3]!,
    prayerTopic: topic("topic-missions"),
    program: null,
    notes: "À reprogrammer la semaine suivante.",
    createdAt: nextTimestamp(10_000),
    updatedAt: nextTimestamp(1_000),
  },
  {
    id: "slot-8",
    title: "Prière du dimanche",
    description: null,
    date: isoDate(10),
    startTime: "09:00",
    endTime: "10:00",
    location: MOCK_LOCATIONS[0]!,
    primaryLeader: leader("leader-marc"),
    secondaryLeader: leader("leader-sarah"),
    status: "CONFIRMED",
    theme: MOCK_THEMES[0]!,
    prayerTopic: topic("topic-unite"),
    program: null,
    notes: null,
    createdAt: nextTimestamp(5_000),
    updatedAt: nextTimestamp(5_000),
  },
];

function withResponseDefaults(slot: BaseMockSlot): PrayerSlot {
  return {
    ...slot,
    prayerLeaderResponse: "PENDING",
    prayerLeaderResponseComment: null,
    prayerLeaderResponseAt: null,
    secondaryLeaderResponse: "PENDING",
    secondaryLeaderResponseComment: null,
    secondaryLeaderResponseAt: null,
  };
}

/** Réponses par défaut d'un créneau fictif — surchargées ci-dessous pour quelques créneaux, pour illustrer chaque état à l'écran. */
export const INITIAL_MOCK_SLOTS: PrayerSlot[] = BASE_MOCK_SLOTS.map(withResponseDefaults).map((slot) => {
  if (slot.id === "slot-2") {
    return {
      ...slot,
      prayerLeaderResponse: "ACCEPTED",
      prayerLeaderResponseAt: nextTimestamp(49_000),
      secondaryLeaderResponse: "ACCEPTED",
      secondaryLeaderResponseAt: nextTimestamp(49_000),
    } satisfies PrayerSlot;
  }
  if (slot.id === "slot-4") {
    return {
      ...slot,
      prayerLeaderResponse: "DECLINED",
      prayerLeaderResponseComment: "En déplacement ce jour-là, désolé.",
      prayerLeaderResponseAt: nextTimestamp(30_000),
    } satisfies PrayerSlot;
  }
  return slot;
});
