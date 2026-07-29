export interface AdminBackupResult {
  supported: boolean;
  message: string;
}

/**
 * Sauvegarde des données de la plateforme — architecture prête, logique non
 * implémentée (demande explicite du brief : « créer les services sans
 * implémenter encore la logique complète »). Même posture que
 * `ReportExportService` pour l'export PDF/Word en son temps : une interface
 * stable dès maintenant, pour qu'un futur sprint n'ait qu'à remplacer le
 * corps de ces méthodes.
 */
export const AdminBackupService = {
  async exportSnapshot(): Promise<AdminBackupResult> {
    return { supported: false, message: "Export de sauvegarde à venir — architecture prête, voir ADMIN.md." };
  },

  async scheduleRecurringBackup(): Promise<AdminBackupResult> {
    return { supported: false, message: "Sauvegardes planifiées à venir — architecture prête, voir ADMIN.md." };
  },

  async restoreFromSnapshot(): Promise<AdminBackupResult> {
    return { supported: false, message: "Restauration à venir — architecture prête, voir ADMIN.md." };
  },
};
