import type { Categorie } from "@/types";

export const categories: Categorie[] = [
  {
    slug: "traites-spatiaux",
    titre: "Traités spatiaux internationaux",
    description:
      "Traité de l'espace de 1967, accords de sauvetage, de responsabilité et d'immatriculation des objets spatiaux.",
    domaine: "droit-spatial",
    icone: "Globe2",
    nombreArticles: 14,
  },
  {
    slug: "exploitation-ressources",
    titre: "Exploitation des ressources spatiales",
    description:
      "Cadre juridique de l'extraction minière lunaire et astéroïdale, propriété des ressources in situ.",
    domaine: "droit-spatial",
    icone: "Orbit",
    nombreArticles: 9,
  },
  {
    slug: "debris-spatiaux",
    titre: "Débris et durabilité spatiale",
    description:
      "Responsabilité liée aux débris orbitaux, obligations de désorbitation et lignes directrices IADC/ONU.",
    domaine: "droit-spatial",
    icone: "OrbitIcon",
    nombreArticles: 11,
  },
  {
    slug: "new-space",
    titre: "New Space et acteurs privés",
    description:
      "Licences de lancement, autorisation d'exploitation de satellites et responsabilité des opérateurs privés.",
    domaine: "droit-spatial",
    icone: "Rocket",
    nombreArticles: 16,
  },
  {
    slug: "protection-donnees",
    titre: "Protection des données personnelles",
    description:
      "RGPD, transferts internationaux de données, droits des personnes concernées et conformité.",
    domaine: "droit-numerique",
    icone: "ShieldCheck",
    nombreArticles: 22,
  },
  {
    slug: "intelligence-artificielle",
    titre: "Intelligence artificielle",
    description:
      "AI Act européen, classification des systèmes à risque, gouvernance algorithmique et responsabilité.",
    domaine: "droit-numerique",
    icone: "Cpu",
    nombreArticles: 19,
  },
  {
    slug: "cybersecurite",
    titre: "Cybersécurité et résilience numérique",
    description:
      "Directive NIS 2, obligations de notification d'incidents et sécurité des systèmes d'information critiques.",
    domaine: "droit-numerique",
    icone: "Lock",
    nombreArticles: 13,
  },
  {
    slug: "plateformes-numeriques",
    titre: "Régulation des plateformes",
    description:
      "Digital Services Act, Digital Markets Act, modération de contenu et obligations des grandes plateformes.",
    domaine: "droit-numerique",
    icone: "Layers",
    nombreArticles: 17,
  },
];
