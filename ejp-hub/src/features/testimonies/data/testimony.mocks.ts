import type { Testimony } from "../types/testimony.types";

/**
 * Fixtures de démonstration du module Témoignages. Utilisées par
 * `MockTestimonyRepository` tant que Supabase n'est pas configuré (voir
 * `repositories/mock-testimony-repository.ts`).
 */
function timestamp(offsetDays: number): string {
  return new Date(Date.now() - offsetDays * 86_400_000).toISOString();
}

export const INITIAL_MOCK_TESTIMONIES: Testimony[] = [
  {
    id: "testimony-1",
    title: "Une guérison inattendue",
    content:
      "Après plusieurs semaines de prière pour ma mère, elle a reçu des nouvelles résultats médicaux bien meilleurs que prévu. Merci à toute la chaîne de prière pour son soutien constant !",
    author: { id: "member-marc", fullName: "Marc Dupont" },
    createdAt: timestamp(5),
    updatedAt: timestamp(5),
  },
  {
    id: "testimony-2",
    title: "Une paix retrouvée",
    content:
      "Je traversais une période très anxieuse à cause de mon travail. Après le temps de prière de mercredi, j'ai ressenti une paix que je n'arrivais plus à expliquer. Gloire à Dieu.",
    author: { id: "mock-user", fullName: "Utilisateur Démo" },
    createdAt: timestamp(2),
    updatedAt: timestamp(2),
  },
  {
    id: "testimony-3",
    title: "Réconciliation familiale",
    content:
      "Cela faisait trois ans que je ne parlais plus à mon frère. Suite à la prière collective du mois dernier, il m'a rappelé de lui-même. Nous nous sommes réconciliés hier soir.",
    author: { id: "member-sarah", fullName: "Sarah Nguyen" },
    createdAt: timestamp(20),
    updatedAt: timestamp(20),
  },
];
