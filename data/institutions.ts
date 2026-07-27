import type { Institution } from "@/types";

/**
 * Institutions de référence citées comme sources par LexWatch — affichées
 * en cartes de présentation sur la page « À propos », sans lien direct
 * avec les références précises citées par chaque fiche ou analyse (voir
 * `ReferenceJuridique`).
 */
export const institutions: Institution[] = [
  {
    nom: "Organisation des Nations unies",
    sigle: "ONU",
    description:
      "Cadre des grands traités internationaux de l'espace, dont le Traité de l'espace de 1967.",
    url: "https://www.un.org",
  },
  {
    nom: "Bureau des affaires spatiales des Nations unies",
    sigle: "UNOOSA",
    description:
      "Registre des objets spatiaux et suivi de l'application du droit spatial international.",
    url: "https://www.unoosa.org",
  },
  {
    nom: "Agence spatiale européenne",
    sigle: "ESA",
    description:
      "Programmes spatiaux européens et réglementation technique associée aux missions.",
    url: "https://www.esa.int",
  },
  {
    nom: "Centre national d'études spatiales",
    sigle: "CNES",
    description:
      "Agence spatiale française, référence sur la loi relative aux opérations spatiales.",
    url: "https://cnes.fr",
  },
  {
    nom: "EUR-Lex",
    sigle: "EUR-Lex",
    description:
      "Portail officiel du droit de l'Union européenne : traités, règlements et directives.",
    url: "https://eur-lex.europa.eu",
  },
  {
    nom: "Commission européenne",
    sigle: "CE",
    description:
      "Initiatives législatives de l'UE en matière numérique (DSA, DMA, IA Act…).",
    url: "https://commission.europa.eu",
  },
  {
    nom: "Conseil de l'Europe",
    sigle: "CdE",
    description:
      "Conventions internationales sur les droits fondamentaux et la protection des données.",
    url: "https://www.coe.int",
  },
  {
    nom: "Commission nationale de l'informatique et des libertés",
    sigle: "CNIL",
    description:
      "Autorité française de protection des données personnelles et de ses doctrines.",
    url: "https://www.cnil.fr",
  },
  {
    nom: "Comité européen de la protection des données",
    sigle: "CEPD",
    description:
      "Cohérence de l'application du RGPD entre les autorités de protection des données de l'UE.",
    url: "https://edpb.europa.eu",
  },
];
