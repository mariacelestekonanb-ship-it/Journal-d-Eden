import { questions } from "@/data/questions";
import { veilleItems } from "@/data/veille";
import { glossaireTermes } from "@/data/glossaire";
import { ressources } from "@/data/ressources";
import { categories } from "@/data/categories";
import { slugifyTerme } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import type {
  AdminStatus,
  AnalyseAdmin,
  CategorieAdmin,
  FicheAdmin,
  GlossaireTermeAdmin,
  Revision,
  RessourceAdmin,
  SiteSettings,
} from "@/lib/admin/types";

// LexWatch est un projet personnel, porté par une seule personne (voir
// components/about/project-section.tsx) — un seul nom ici, pas une
// équipe éditoriale fictive.
const AUTEURS = ["Bénédicte Konan"];

// Pondéré vers « publié » : le contenu public existant est par nature déjà
// publié. Quelques entrées sont marquées autrement pour donner un tableau
// de bord réaliste et pouvoir démontrer chaque état du workflow.
const CYCLE_STATUTS: AdminStatus[] = [
  "publie",
  "publie",
  "publie",
  "brouillon",
  "en-relecture",
  "publie",
  "a-corriger",
  "publie",
];

function decalerDate(iso: string, jours: number): string {
  const date = new Date(iso);
  date.setDate(date.getDate() + jours);
  return date.toISOString().slice(0, 10);
}

function auteurSuivant(auteur: string): string {
  const index = AUTEURS.indexOf(auteur);
  return AUTEURS[(index + 1) % AUTEURS.length];
}

function versionsFactices(
  id: string,
  updatedAt: string,
  auteur: string,
): Revision[] {
  return [
    {
      id: `${id}-v3`,
      date: updatedAt,
      auteur,
      resume: "Relecture éditoriale et mise à jour des références",
    },
    {
      id: `${id}-v2`,
      date: decalerDate(updatedAt, -21),
      auteur: auteurSuivant(auteur),
      resume: "Ajout de précisions dans le corps du contenu",
    },
    {
      id: `${id}-v1`,
      date: decalerDate(updatedAt, -60),
      auteur,
      resume: "Création initiale",
    },
  ];
}

export function seedFiches(): FicheAdmin[] {
  return questions.map((question, index) => {
    const auteur = AUTEURS[index % AUTEURS.length];
    return {
      ...question,
      id: question.slug,
      status: CYCLE_STATUTS[index % CYCLE_STATUTS.length],
      updatedAt: question.dateMiseAJour,
      updatedBy: auteur,
      versions: versionsFactices(question.slug, question.dateMiseAJour, auteur),
    };
  });
}

export function seedAnalyses(): AnalyseAdmin[] {
  return veilleItems.map((item, index) => {
    const auteur = AUTEURS[index % AUTEURS.length];
    return {
      ...item,
      id: item.slug,
      status: CYCLE_STATUTS[(index + 2) % CYCLE_STATUTS.length],
      updatedAt: item.dateMiseAJour,
      updatedBy: auteur,
      versions: versionsFactices(item.slug, item.dateMiseAJour, auteur),
    };
  });
}

export function seedGlossaire(): GlossaireTermeAdmin[] {
  const base = new Date();

  return glossaireTermes.map((terme, index) => {
    const auteur = AUTEURS[index % AUTEURS.length];
    const updatedAt = decalerDate(
      base.toISOString().slice(0, 10),
      -(index * 5),
    );
    const id = slugifyTerme(terme.terme);
    return {
      ...terme,
      id,
      status: CYCLE_STATUTS[(index + 1) % CYCLE_STATUTS.length],
      updatedAt,
      updatedBy: auteur,
      versions: versionsFactices(id, updatedAt, auteur),
    };
  });
}

export function seedRessources(): RessourceAdmin[] {
  const base = new Date();

  return ressources.map((ressource, index) => {
    const auteur = AUTEURS[index % AUTEURS.length];
    const updatedAt = decalerDate(
      base.toISOString().slice(0, 10),
      -(index * 9),
    );
    const id = `ressource-${index}`;
    return {
      ...ressource,
      id,
      status: CYCLE_STATUTS[(index + 3) % CYCLE_STATUTS.length],
      updatedAt,
      updatedBy: auteur,
      versions: versionsFactices(id, updatedAt, auteur),
    };
  });
}

export function seedCategories(): CategorieAdmin[] {
  const base = new Date();

  return categories.map((categorie, index) => {
    const auteur = AUTEURS[index % AUTEURS.length];
    const updatedAt = decalerDate(
      base.toISOString().slice(0, 10),
      -(index * 14),
    );
    return {
      ...categorie,
      id: categorie.slug,
      status: "publie",
      updatedAt,
      updatedBy: auteur,
      versions: versionsFactices(categorie.slug, updatedAt, auteur),
    };
  });
}

/**
 * Réglages de départ : reprend exactement les valeurs codées en dur
 * aujourd'hui dans les composants publics (voir `components/home/hero.tsx`,
 * `lib/site-config.ts`) — éditer ces réglages sans les modifier ne change
 * donc rien tant que la rédactrice n'a pas explicitement choisi une valeur
 * différente.
 */
export function seedSiteSettings(): SiteSettings {
  return {
    branding: {
      logoUrl: undefined,
      palette: "navy-or",
    },
    hero: {
      headline: "Le droit spatial et le droit du numérique accessibles à tous.",
      description:
        "Comprendre simplement les règles qui encadrent l'espace et les technologies numériques grâce à des fiches pédagogiques et une veille juridique.",
      ctaPrimaryLabel: "Explorer les fiches",
      ctaSecondaireLabel: "Découvrir la veille",
      backgroundImageUrl: undefined,
    },
    heroBackgrounds: {
      comprendre: undefined,
      veilleJuridique: undefined,
      glossaire: undefined,
      aPropos: undefined,
    },
    contact: {
      email: siteConfig.email,
      liensSociaux: [],
    },
    legal: {
      mentionsLegales: [
        { type: "heading", text: "Éditrice du site" },
        {
          type: "paragraph",
          text: "LexWatch est un site personnel à vocation pédagogique, sans objet commercial, édité par Bénédicte Konan, étudiante en Master 2 Droit public à l'Université Paris-Saclay.",
        },
        {
          type: "paragraph",
          text: "Directrice de la publication : Bénédicte Konan.",
        },
        {
          type: "paragraph",
          text: `Contact : ${siteConfig.email}`,
        },
        {
          type: "callout",
          tone: "info",
          text: "En qualité d'éditrice individuelle agissant à titre non professionnel, Bénédicte Konan use de la faculté ouverte par l'article 6-III-2 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique : ses coordonnées personnelles (adresse, téléphone) ne sont pas rendues publiques, mais restent communicables à l'hébergeur et, sur demande, à l'autorité judiciaire.",
        },
        { type: "heading", text: "Hébergement" },
        {
          type: "paragraph",
          text: "Le site est hébergé par Vercel Inc., société de droit américain. Les informations relatives à cet hébergeur (dénomination, siège social) sont disponibles sur vercel.com/legal.",
        },
        { type: "heading", text: "Propriété intellectuelle" },
        {
          type: "paragraph",
          text: "L'ensemble des contenus pédagogiques et éditoriaux publiés sur LexWatch (fiches, analyses, définitions du glossaire) constitue une œuvre de l'esprit protégée par le droit d'auteur, sauf mention contraire. Toute reproduction substantielle à des fins autres que strictement personnelles est soumise à autorisation préalable.",
        },
        {
          type: "paragraph",
          text: "Les textes de loi, décisions de justice, communiqués institutionnels et autres documents officiels cités ou liés depuis LexWatch demeurent la propriété de leurs auteurs ou éditeurs respectifs.",
        },
        { type: "heading", text: "Liens hypertextes" },
        {
          type: "paragraph",
          text: "LexWatch peut contenir des liens vers des sites tiers (institutions, presse, cabinets d'avocats, textes officiels). Ces liens sont fournis à titre informatif ; LexWatch n'exerce aucun contrôle sur le contenu de ces sites et décline toute responsabilité quant à leur contenu ou leur disponibilité.",
        },
        { type: "heading", text: "Avertissement" },
        {
          type: "paragraph",
          text: "Les contenus de LexWatch ont une vocation pédagogique et informative. Ils ne constituent en aucun cas une consultation juridique ni un avis personnalisé, et ne sauraient se substituer aux conseils d'un professionnel du droit habilité pour toute situation concrète.",
        },
        { type: "heading", text: "Droit applicable" },
        {
          type: "paragraph",
          text: "Les présentes mentions légales sont soumises au droit français. Tout litige relève, à défaut de résolution amiable, des juridictions françaises compétentes.",
        },
        {
          type: "paragraph",
          text: "Dernière mise à jour : 15 octobre 2026.",
        },
      ],
      confidentialite: [
        { type: "heading", text: "Responsable du traitement" },
        {
          type: "paragraph",
          text: `Le responsable du traitement des données à caractère personnel collectées sur LexWatch est Bénédicte Konan, éditrice individuelle du site, joignable à ${siteConfig.email}.`,
        },
        { type: "heading", text: "Données collectées à ce jour" },
        {
          type: "paragraph",
          text: "À la date de publication de cette politique, le formulaire de contact du site n'est pas encore activé : aucune donnée personnelle n'est donc collectée par ce biais.",
        },
        {
          type: "list",
          items: [
            "Données techniques d'hébergement (adresses IP, journaux de connexion) traitées par l'hébergeur Vercel Inc. dans le cadre normal de la fourniture du service",
            "Aucun outil de mesure d'audience (Google Analytics, Microsoft Clarity, Plausible) n'est activé à ce jour",
            "Aucun cookie de suivi ou de publicité n'est déposé par LexWatch lui-même",
          ],
        },
        {
          type: "callout",
          tone: "info",
          text: "Si le formulaire de contact était activé, ou si un outil de mesure d'audience était mis en place, cette politique serait mise à jour avant toute collecte, pour préciser les données concernées, leur finalité et leur durée de conservation.",
        },
        {
          type: "heading",
          text: "Finalité du traitement (formulaire de contact)",
        },
        {
          type: "paragraph",
          text: "Lorsqu'il sera activé, le formulaire de contact collectera uniquement les données nécessaires pour répondre à la demande (nom, adresse e-mail, objet et contenu du message). Ces données seront utilisées à la seule fin de traiter la demande et ne seront jamais cédées ni vendues à des tiers.",
        },
        { type: "heading", text: "Durée de conservation" },
        {
          type: "paragraph",
          text: "Les données transmises via le formulaire de contact, une fois celui-ci activé, seront conservées le temps nécessaire au traitement de la demande, puis supprimées.",
        },
        { type: "heading", text: "Transferts de données" },
        {
          type: "paragraph",
          text: "L'hébergeur du site, Vercel Inc., est une société américaine : l'hébergement peut impliquer un traitement de données techniques en dehors de l'Union européenne. Les garanties applicables à ce transfert sont décrites dans la politique de confidentialité de Vercel, disponible sur vercel.com/legal/privacy-policy.",
        },
        { type: "heading", text: "Vos droits" },
        {
          type: "paragraph",
          text: "Conformément au Règlement général sur la protection des données (RGPD) et à la loi Informatique et Libertés, vous disposez des droits suivants sur vos données à caractère personnel :",
        },
        {
          type: "list",
          items: [
            "Droit d'accès à vos données",
            "Droit de rectification",
            "Droit à l'effacement",
            "Droit à la limitation du traitement",
            "Droit d'opposition",
            "Droit à la portabilité des données",
          ],
        },
        {
          type: "paragraph",
          text: `Pour exercer l'un de ces droits, vous pouvez écrire à ${siteConfig.email}. Vous disposez également du droit d'introduire une réclamation auprès de la Commission nationale de l'informatique et des libertés (CNIL), www.cnil.fr.`,
        },
        { type: "heading", text: "Modifications de cette politique" },
        {
          type: "paragraph",
          text: "Cette politique de confidentialité peut être mise à jour pour refléter toute évolution du site (activation du formulaire de contact, ajout d'un outil de mesure d'audience, etc.). La date de dernière mise à jour figure ci-dessous.",
        },
        {
          type: "paragraph",
          text: "Dernière mise à jour : 15 octobre 2026.",
        },
      ],
    },
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: "Bénédicte Konan",
  };
}
