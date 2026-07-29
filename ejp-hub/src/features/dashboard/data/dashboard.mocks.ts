import { CalendarDays, FileText, HeartHandshake, Sparkles, Users } from "lucide-react";

import { ADMIN_STATS_CONFIG, PRAYER_LEADER_STATS_CONFIG } from "../services/dashboard.stats-config";
import type {
  ActivityLogEntry,
  DashboardNotification,
  DashboardStat,
  QuickAction,
  RecentPrayerTopicSummary,
  UpcomingSlotSummary,
} from "../types/dashboard.types";

function zipStatsWithValues(config: typeof ADMIN_STATS_CONFIG, values: number[]): DashboardStat[] {
  return config.map((stat, index) => ({ ...stat, value: values[index] ?? 0 }));
}

/**
 * État mutable en mémoire pour le panneau Notifications en mode démo : sans
 * cela, « marquer comme lu » n'aurait aucun effet visible après un refetch.
 * Réinitialisé à chaque rechargement complet de l'application (mémoire du
 * module, pas de persistance) — suffisant pour une prévisualisation.
 */
let mockNotifications: DashboardNotification[] = [
  {
    id: "mock-notification-1",
    type: "UPCOMING_SLOT",
    title: "Créneau demain",
    message: "Vous conduisez le temps de prière demain à 18h00.",
    createdAt: new Date(Date.now() - 2 * 3_600_000).toISOString(),
    readAt: null,
  },
  {
    id: "mock-notification-2",
    type: "PENDING_REPORT",
    title: "Compte rendu en attente",
    message: "Le compte rendu du créneau de mardi n'a pas encore été rempli.",
    createdAt: new Date(Date.now() - 26 * 3_600_000).toISOString(),
    readAt: null,
  },
  {
    id: "mock-notification-3",
    type: "NEW_TOPIC",
    title: "Nouveau sujet de prière",
    message: "« Unité de l'Église » vient d'être publié par Alice Administrateur.",
    createdAt: new Date(Date.now() - 30 * 3_600_000).toISOString(),
    readAt: new Date(Date.now() - 20 * 3_600_000).toISOString(),
  },
  {
    id: "mock-notification-4",
    type: "NEW_TOPIC",
    title: "Nouveau sujet de prière",
    message: "« Réveil spirituel de la jeunesse » vient d'être publié par Marc Dupont.",
    createdAt: new Date(Date.now() - 48 * 3_600_000).toISOString(),
    readAt: new Date(Date.now() - 40 * 3_600_000).toISOString(),
  },
];

/**
 * Données fictives utilisées tant que Supabase n'est pas configuré
 * (`isSupabaseConfigured()` renvoie `false`) ou que l'organisation n'a pas
 * encore de données réelles. Voir `services/dashboard.service.ts` pour la
 * bascule vers de vraies requêtes.
 */
export const DashboardMocks = {
  statsForAdmin: (): DashboardStat[] => zipStatsWithValues(ADMIN_STATS_CONFIG, [12, 5, 3, 8, 2]),

  statsForPrayerLeader: (): DashboardStat[] => zipStatsWithValues(PRAYER_LEADER_STATS_CONFIG, [2, 1, 4, 3]),

  upcomingSlots: (): UpcomingSlotSummary[] => [
    {
      id: "mock-slot-1",
      date: new Date(Date.now() + 1 * 86_400_000).toISOString().slice(0, 10),
      startTime: "18:00",
      endTime: "19:00",
      location: "Salle de prière",
      topicTitle: "Unité de l'Église",
      leaderName: "Marc Dupont",
    },
    {
      id: "mock-slot-2",
      date: new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10),
      startTime: "06:30",
      endTime: "07:15",
      location: "En ligne",
      topicTitle: "Réveil spirituel",
      leaderName: "Sarah Nguyen",
    },
    {
      id: "mock-slot-3",
      date: new Date(Date.now() + 6 * 86_400_000).toISOString().slice(0, 10),
      startTime: "20:00",
      endTime: "21:00",
      location: "Salle de prière",
      topicTitle: null,
      leaderName: "Alice Administrateur",
    },
  ],

  recentPrayerTopics: (): RecentPrayerTopicSummary[] => [
    {
      id: "mock-topic-1",
      title: "Unité de l'Église",
      priority: "HIGH",
      date: new Date(Date.now() - 1 * 86_400_000).toISOString().slice(0, 10),
      authorName: "Alice Administrateur",
    },
    {
      id: "mock-topic-2",
      title: "Réveil spirituel de la jeunesse",
      priority: "HIGH",
      date: new Date(Date.now() - 2 * 86_400_000).toISOString().slice(0, 10),
      authorName: "Marc Dupont",
    },
    {
      id: "mock-topic-3",
      title: "Guérison des malades",
      priority: "NORMAL",
      date: new Date(Date.now() - 4 * 86_400_000).toISOString().slice(0, 10),
      authorName: "Sarah Nguyen",
    },
    {
      id: "mock-topic-4",
      title: "Persévérance des familles",
      priority: "NORMAL",
      date: new Date(Date.now() - 5 * 86_400_000).toISOString().slice(0, 10),
      authorName: "Alice Administrateur",
    },
    {
      id: "mock-topic-5",
      title: "Missions à l'étranger",
      priority: "LOW",
      date: new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10),
      authorName: "Marc Dupont",
    },
  ],

  notifications: (): DashboardNotification[] => mockNotifications.map((notification) => ({ ...notification })),

  markNotificationAsRead: (id: string): void => {
    mockNotifications = mockNotifications.map((notification) =>
      notification.id === id ? { ...notification, readAt: new Date().toISOString() } : notification,
    );
  },

  markAllNotificationsAsRead: (): void => {
    mockNotifications = mockNotifications.map((notification) =>
      notification.readAt ? notification : { ...notification, readAt: new Date().toISOString() },
    );
  },

  recentActivity: (): ActivityLogEntry[] => [
    {
      id: "mock-activity-1",
      actorName: "Jean Martin",
      action: "a rempli un compte rendu",
      timestamp: new Date(Date.now() - 3 * 3_600_000).toISOString(),
      icon: FileText,
    },
    {
      id: "mock-activity-2",
      actorName: "Marie Petit",
      action: "a ajouté un témoignage",
      timestamp: new Date(Date.now() - 8 * 3_600_000).toISOString(),
      icon: Sparkles,
    },
    {
      id: "mock-activity-3",
      actorName: "Paul Lefèvre",
      action: "a créé un sujet de prière",
      timestamp: new Date(Date.now() - 27 * 3_600_000).toISOString(),
      icon: HeartHandshake,
    },
    {
      id: "mock-activity-4",
      actorName: "Sarah Nguyen",
      action: "a rempli un compte rendu",
      timestamp: new Date(Date.now() - 51 * 3_600_000).toISOString(),
      icon: FileText,
    },
  ],

  quickActionsForAdmin: (): QuickAction[] => [
    { id: "create-topic", label: "Créer un sujet", icon: HeartHandshake },
    { id: "create-slot", label: "Créer une conduite", icon: CalendarDays },
    { id: "add-user", label: "Ajouter un utilisateur", icon: Users },
    { id: "view-reports", label: "Voir les rapports", icon: FileText },
  ],

  quickActionsForPrayerLeader: (): QuickAction[] => [
    { id: "view-planning", label: "Voir mon planning", icon: CalendarDays },
    { id: "create-report", label: "Créer mon compte rendu", icon: FileText },
    { id: "view-topics", label: "Voir les sujets", icon: HeartHandshake },
    { id: "view-testimonies", label: "Consulter les témoignages", icon: Sparkles },
  ],
};
