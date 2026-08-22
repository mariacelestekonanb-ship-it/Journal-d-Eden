import type { Metadata } from "next";
import { PageFooter } from "@/components/page-footer";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";

export const metadata: Metadata = { title: "Mini-jeux — Espace invités" };

const games = [
  { title: "Quiz du couple", desc: "Nous connaissez-vous si bien que ça ?" },
  {
    title: "Bingo de mariage",
    desc: "Cochez les moments classiques au fil de la soirée.",
  },
  {
    title: "Qui suis-je ?",
    desc: "Devinez qui se cache derrière ces photos d'enfance.",
  },
  {
    title: "Mots croisés",
    desc: "Une petite grille sur le thème de notre amour.",
  },
] as const;

export default function MiniJeuxPage() {
  return (
    <div>
      <TopBar />
      <SectionHeader
        title="Mini-jeux"
        description="Un peu de jeu pour patienter et (re)découvrir notre histoire."
      />

      <div className="grid grid-cols-2 gap-3 px-5 pt-6 pb-2.5">
        {games.map((game) => (
          <div
            key={game.title}
            className="flex flex-col gap-3 rounded-[22px] border border-ink/[0.07] bg-white p-4.5 shadow-[0_2px_4px_rgba(20,30,10,0.05),0_10px_20px_rgba(20,30,10,0.06)]"
          >
            <div>
              <div className="text-[13px] font-bold text-ink">
                {game.title}
              </div>
              <div className="mt-1 text-[10.5px] leading-relaxed text-ink-faint">
                {game.desc}
              </div>
            </div>
            <span className="self-start rounded-full bg-olive px-3 py-2 text-[11px] font-bold text-white">
              Jouer
            </span>
          </div>
        ))}
      </div>

      <PageFooter signOff="Que le meilleur gagne" />
    </div>
  );
}
