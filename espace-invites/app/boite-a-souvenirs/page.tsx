import type { Metadata } from "next";
import { DarkPanel } from "@/components/dark-panel";
import { PageFooter } from "@/components/page-footer";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";

export const metadata: Metadata = {
  title: "Boîte à souvenirs — Espace invités",
};

const placeholderMemories = [1, 2, 3];

export default function BoiteASouvenirsPage() {
  return (
    <div>
      <TopBar />
      <SectionHeader
        title="Boîte à souvenirs"
        description="Laissez-nous un mot, une anecdote, un souvenir partagé… on gardera tout précieusement."
      />

      <div className="px-5 pt-6">
        <DarkPanel className="p-5.5">
          <div className="mb-3 text-xs text-[#e4e7c8]">
            Écrire un souvenir
          </div>
          <input
            type="text"
            placeholder="Votre nom"
            className="mb-2.5 w-full border-b border-white/20 bg-transparent pb-2 text-xs text-white placeholder:text-[#d6de9e] focus:outline-none"
          />
          <textarea
            rows={3}
            placeholder="Votre message…"
            className="mb-4 w-full resize-none border-b border-white/20 bg-transparent pb-2 text-xs leading-relaxed text-white placeholder:text-[#d6de9e] focus:outline-none"
          />
          <button
            type="button"
            className="w-full rounded-full bg-white py-3 text-xs font-bold text-[#3d4321]"
          >
            Déposer mon souvenir
          </button>
        </DarkPanel>
      </div>

      <div className="px-5 pt-7 pb-2.5">
        <div className="mb-3.5 text-[10px] font-bold tracking-[0.16em] text-ink-faint uppercase">
          Ils ont déjà partagé un mot
        </div>
        <div className="flex flex-col gap-2.5">
          {placeholderMemories.map((i) => (
            <div
              key={i}
              className="rounded-[20px] border border-ink/[0.07] bg-white p-4 shadow-[0_2px_4px_rgba(20,30,10,0.05),0_10px_20px_rgba(20,30,10,0.06)]"
            >
              <div className="text-[11.5px] font-bold text-ink">
                [Prénom]
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-muted">
                [Un souvenir ou un petit mot pour les mariés apparaîtra ici.]
              </p>
            </div>
          ))}
        </div>
      </div>

      <PageFooter signOff="Merci d'en faire partie" />
    </div>
  );
}
