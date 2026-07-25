import type { Theme } from "@/types";

/**
 * Les cinq grandes entrées thématiques de la bibliothèque Comprendre.
 * `categoriesAssociees` relie chaque thème aux `categorie` fines de
 * `data/questions.ts` : c'est ce qui permet de filtrer « Toutes les
 * fiches » par thème. Un thème sans catégorie associée (ex. Institutions)
 * affichera légitimement l'état « aucun résultat » tant qu'aucune fiche
 * ne lui est rattachée.
 */
export const themes: Theme[] = [
  {
    slug: "droit-spatial",
    titre: "Droit spatial",
    description:
      "Traités internationaux, exploitation des ressources et régulation des lancements.",
    icone: "Rocket",
    nombreFichesApprox: 42,
    categoriesAssociees: [
      "traites-spatiaux",
      "debris-spatiaux",
      "exploitation-ressources",
      "new-space",
    ],
  },
  {
    slug: "droit-numerique",
    titre: "Droit du numérique",
    description:
      "Protection des données, plateformes en ligne et cybersécurité.",
    icone: "Cpu",
    nombreFichesApprox: 38,
    categoriesAssociees: [
      "protection-donnees",
      "cybersecurite",
      "plateformes-numeriques",
    ],
  },
  {
    slug: "intelligence-artificielle",
    titre: "Intelligence artificielle",
    description:
      "Classification des risques, gouvernance algorithmique et responsabilité.",
    icone: "Bot",
    nombreFichesApprox: 19,
    categoriesAssociees: ["intelligence-artificielle"],
  },
  {
    slug: "telecommunications",
    titre: "Télécommunications",
    description:
      "Fréquences, satellites de communication et régulation des réseaux.",
    icone: "Radio",
    nombreFichesApprox: 8,
    categoriesAssociees: ["telecommunications"],
  },
  {
    slug: "institutions",
    titre: "Institutions",
    description:
      "ONU, agences spatiales et autorités de régulation qui font la norme.",
    icone: "Landmark",
    nombreFichesApprox: 12,
    categoriesAssociees: [],
  },
];
