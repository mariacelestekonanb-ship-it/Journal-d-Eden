import type { Metadata } from "next";
import { PageFooter } from "@/components/page-footer";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";

export const metadata: Metadata = { title: "Album photo — Espace invités" };

const TILE_COLORS = [
  "from-sage to-olive",
  "from-olive to-sage",
] as const;

export default function AlbumPhotoPage() {
  return (
    <div>
      <TopBar />
      <SectionHeader
        title="Album photo"
        description="Vous avez immortalisé un moment de la journée ? Ajoutez-le à notre album partagé, on veut tout voir."
      />

      <div className="px-5 pt-6">
        <button
          type="button"
          className="w-full rounded-[22px] border-[1.5px] border-dashed border-sage bg-[#fbfbf6] py-7 text-center"
        >
          <div className="text-[12.5px] font-bold text-ink">
            Ajouter une photo
          </div>
          <div className="mt-1 text-[10.5px] text-ink-faint">
            ou glissez-la ici depuis votre téléphone
          </div>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2.5 px-5 pt-6 pb-2.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-[14px] bg-gradient-to-br ${TILE_COLORS[i % 2]}`}
          />
        ))}
      </div>

      <p className="px-6.5 pb-2 text-center text-[11px] text-ink-faint">
        L&apos;album complet sera dévoilé après le grand jour.
      </p>

      <PageFooter signOff="Merci pour vos souvenirs" />
    </div>
  );
}
