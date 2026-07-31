import { NotificationService } from "@/features/notifications";

/**
 * Relance manuelle, déclenchée par un admin, d'un conducteur dont un
 * créneau passé attend toujours son compte rendu — même message que la
 * relance quotidienne automatique (`send_report_reminders`, voir
 * NOTIFICATIONS.md), mais immédiate plutôt que d'attendre le prochain
 * passage planifié. Import cross-module volontaire : `NotificationService`
 * est l'API publique prévue pour ça (voir NOTIFICATIONS.md), même précédent
 * que `NotificationBell` déjà importé dans `shared/components/layout/header.tsx`.
 */
export async function sendReportReminderAction(input: {
  leaderId: string;
  slotTitle: string;
  slotDate: string;
}): Promise<void> {
  await NotificationService.notify({
    userId: input.leaderId,
    type: "REPORT",
    priority: "HIGH",
    title: "Compte rendu à remplir",
    message: `Le créneau « ${input.slotTitle} » du ${input.slotDate} attend toujours son compte rendu.`,
    actionUrl: "/comptes-rendus/nouveau",
  });
}
