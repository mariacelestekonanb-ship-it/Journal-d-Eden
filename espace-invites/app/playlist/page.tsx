import type { Metadata } from "next";
import { PageFooter } from "@/components/page-footer";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";

export const metadata: Metadata = { title: "Playlist — Espace invités" };

const placeholderSongs = [1, 2, 3, 4];

export default function PlaylistPage() {
  return (
    <div>
      <TopBar />
      <SectionHeader
        title="Playlist collaborative"
        description="Proposez les titres qui vous feront danser toute la soirée !"
      />

      <div className="px-5 pt-6">
        <div className="flex items-center gap-2.5 rounded-full border border-ink/[0.07] bg-white py-2 pr-2 pl-5 shadow-[0_2px_4px_rgba(20,30,10,0.04),0_10px_20px_rgba(20,30,10,0.06)]">
          <span className="flex-1 text-xs text-ink-faint/80">
            Rechercher un titre ou un artiste…
          </span>
          <button
            type="button"
            aria-label="Proposer un titre"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-olive text-lg text-white"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-5 pt-6 pb-2.5">
        <div className="px-1 text-[10px] font-bold tracking-[0.16em] text-ink-faint uppercase">
          Déjà proposé
        </div>
        {placeholderSongs.map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-[18px] border border-ink/[0.07] bg-white p-3"
          >
            <div className="flex-1">
              <div className="text-xs font-bold text-ink">
                [Titre de la chanson]
              </div>
              <div className="text-[10.5px] text-ink-faint">[Artiste]</div>
            </div>
            <div className="text-[9.5px] text-ink-faint/80">
              par [Prénom]
            </div>
          </div>
        ))}
      </div>

      <PageFooter signOff="Que la fête commence" />
    </div>
  );
}
