/** L'auteur d'un témoignage — n'importe quel membre (admin ou conducteur), pas seulement un conducteur. */
export interface TestimonyAuthor {
  id: string;
  fullName: string;
  /** `false` si le membre a été supprimé (ou désactivé) depuis — le nom reste affiché, grisé. Absent = actif. */
  isActive?: boolean;
}

/**
 * Un témoignage — librement publié par n'importe quel membre connecté
 * (aucune modération, voir TESTIMONIES.md). Chacun ne peut supprimer que le
 * sien ; un admin peut supprimer n'importe lequel.
 */
export interface Testimony {
  id: string;
  title: string;
  content: string;
  author: TestimonyAuthor;
  createdAt: string;
  updatedAt: string;
}
