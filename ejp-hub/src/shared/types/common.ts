/** Types utilitaires génériques partagés par toute l'application. */

export type Nullable<T> = T | null;

export type WithId<T> = T & { id: string };

/** Résultat uniforme des Server Actions, sans avoir à lever d'exception côté client. */
export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };
