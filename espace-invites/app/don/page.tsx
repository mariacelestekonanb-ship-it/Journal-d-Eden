import type { Metadata } from "next";
import { DarkPanel } from "@/components/dark-panel";
import { PageFooter } from "@/components/page-footer";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Faire un don — Espace invités" };

export default function DonPage() {
  return (
    <div>
      <TopBar />
      <SectionHeader
        title="Faire un don"
        description="Votre présence à nos côtés est déjà le plus beau des cadeaux. Si vous souhaitez tout de même nous gâter, voici comment nous aider à démarrer cette nouvelle vie ensemble."
      />

      <div className="px-5 pt-6">
        <DarkPanel className="px-5.5 py-7 text-center">
          <div className="text-[10px] font-bold tracking-[0.16em] text-[#c7cf9e] uppercase">
            Cagnotte
          </div>
          <div className="font-display mt-2.5 text-2xl text-white italic">
            Notre voyage de noces
          </div>
          <p className="mx-auto mt-2.5 max-w-[280px] text-xs leading-relaxed text-[#d9dfb8]">
            Nous rêvons de partir à {siteConfig.honeymoonDestination}. Chaque
            contribution nous en rapproche un peu plus.
          </p>
          <a
            href={siteConfig.donationLink}
            className="mt-5.5 block rounded-full bg-white py-3.5 text-center text-[12.5px] font-bold text-[#3d4321]"
          >
            Participer à la cagnotte
          </a>
        </DarkPanel>
      </div>

      <div className="px-5 pt-3.5">
        <div className="flex items-center justify-between gap-3 rounded-[20px] border border-ink/[0.07] bg-white p-5 shadow-[0_2px_4px_rgba(20,30,10,0.04),0_10px_20px_rgba(20,30,10,0.06)]">
          <div>
            <div className="text-[12.5px] font-bold text-ink">
              Une autre idée de cadeau ?
            </div>
            <p className="mt-1.5 text-[11.5px] text-ink-faint">
              Nous avons aussi préparé une petite liste.
            </p>
          </div>
          <a
            href={siteConfig.giftListLink}
            className="flex-shrink-0 rounded-full bg-olive px-3.5 py-2 text-[11px] font-bold text-white"
          >
            Voir
          </a>
        </div>
      </div>

      <PageFooter signOff="Merci du fond du cœur" />
    </div>
  );
}
