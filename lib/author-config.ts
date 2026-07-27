/**
 * Informations sur l'auteure de LexWatch, affichées par la section « À
 * propos de l'auteure » (voir `components/about/author-card.tsx`).
 * Uniquement des placeholders — à remplacer par les informations réelles.
 * Ce fichier est le seul endroit à modifier pour mettre à jour la
 * présentation de l'auteure sur le site.
 */
export const authorConfig = {
  nom: "Prénom Nom",
  initiales: "PN",
  /** Chemin vers une vraie photo, une fois disponible — `null` affiche les initiales. */
  photoUrl: null as string | null,
  role: "Autrice de LexWatch",
  presentation:
    "Étudiante en droit, passionnée par les zones encore peu balisées du droit — l'espace et le numérique — et convaincue que la rigueur juridique n'exclut pas la clarté.",
  parcours: [
    "Étudiante en Master de droit — établissement à préciser",
    "Formation antérieure — à préciser",
  ],
  centresInteret: [
    "Droit spatial",
    "Droit du numérique",
    "Protection des données",
    "Vulgarisation juridique",
  ],
};
