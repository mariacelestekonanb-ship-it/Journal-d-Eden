export interface AdminUser {
  id: string;
  nom: string;
  role: "Rédacteur" | "Éditeur" | "Administrateur";
  initiales: string;
}

/**
 * Point d'entrée unique pour connaître l'utilisateur courant de l'admin.
 * Retourne aujourd'hui un utilisateur fictif fixe — aucune authentification
 * n'est implémentée dans cette phase. Le jour où une vraie session existe
 * (NextAuth, Clerk, Supabase Auth…), cette fonction est le seul endroit à
 * modifier : elle deviendrait `async` (elle l'est déjà, par anticipation) et
 * lirait la session réelle au lieu de retourner cette constante. Aucun
 * composant qui l'appelle n'aurait à changer.
 */
export async function getCurrentAdminUser(): Promise<AdminUser> {
  return {
    id: "user-demo",
    nom: "Bénédicte Konan",
    role: "Éditeur",
    initiales: "BK",
  };
}
