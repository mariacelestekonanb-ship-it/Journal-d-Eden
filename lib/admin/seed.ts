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

const AUTEURS = ["Camille Dupuis", "Younes Haddad", "Léa Moreau"];

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
      media: { type: "illustration" },
    },
    contact: {
      email: siteConfig.email,
      liensSociaux: [],
    },
    legal: {
      mentionsLegales: [],
      confidentialite: [],
    },
    updatedAt: new Date().toISOString().slice(0, 10),
    updatedBy: "Bénédicte Konan",
  };
}
