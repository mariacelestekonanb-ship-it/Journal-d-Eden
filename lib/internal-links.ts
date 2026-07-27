import { glossaireTermes } from "@/data/glossaire";
import { ressources } from "@/data/ressources";
import { getThemeForCategorie } from "@/lib/content";
import { slugifyTerme } from "@/lib/format";
import type { Domaine } from "@/types";

export interface LienConnexe {
  type: "glossaire" | "ressource";
  titre: string;
  description: string;
  href: string;
  external?: boolean;
}

export interface LiensConnexesParams {
  /** `categorie` fine de la fiche ou de l'analyse d'origine (voir `QuestionItem.categorie` / `VeilleItem.categorie`). */
  categorie: string;
  domaine: Domaine;
  limite?: number;
}

/**
 * Maillage interne « inverse » : termes du glossaire et ressources en lien
 * avec une fiche pédagogique ou une analyse de veille. Les fiches↔fiches et
 * analyses↔analyses sont déjà couvertes ailleurs (`getRelatedQuestions`,
 * `getRelatedVeille`) ; cette fonction couvre les deux directions qui ne
 * l'étaient pas encore, sans dupliquer aucune donnée — seulement des
 * références croisées entre les corpus existants (thème pour le glossaire,
 * domaine pour les ressources).
 */
export function getLiensConnexes({
  categorie,
  domaine,
  limite = 4,
}: LiensConnexesParams): LienConnexe[] {
  const theme = getThemeForCategorie(categorie);

  const termesLies: LienConnexe[] = theme
    ? glossaireTermes
        .filter((terme) => terme.theme === theme.slug)
        .map((terme) => ({
          type: "glossaire",
          titre: terme.terme,
          description: terme.definition,
          href: `/glossaire#${slugifyTerme(terme.terme)}`,
        }))
    : [];

  const ressourcesLiees: LienConnexe[] = ressources
    .filter((ressource) => ressource.domaine === domaine)
    .map((ressource) => ({
      type: "ressource",
      titre: ressource.titre,
      description: ressource.description,
      href: ressource.url,
      external: true,
    }));

  // Alterne entre les deux types plutôt que de laisser l'un monopoliser le
  // quota d'affichage.
  const combined: LienConnexe[] = [];
  const maxLength = Math.max(termesLies.length, ressourcesLiees.length);
  for (let index = 0; index < maxLength && combined.length < limite; index++) {
    if (termesLies[index]) combined.push(termesLies[index]);
    if (combined.length < limite && ressourcesLiees[index]) {
      combined.push(ressourcesLiees[index]);
    }
  }

  return combined.slice(0, limite);
}
