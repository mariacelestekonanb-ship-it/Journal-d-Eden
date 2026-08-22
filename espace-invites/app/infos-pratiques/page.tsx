import type { Metadata } from "next";
import { DarkPanel } from "@/components/dark-panel";
import { PageFooter } from "@/components/page-footer";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";
import { hotels, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = { title: "Infos pratiques — Espace invités" };

export default function InfosPratiquesPage() {
  return (
    <div>
      <TopBar />
      <SectionHeader
        title="Infos pratiques"
        description="De quoi organiser votre venue en toute tranquillité."
      />

      {/* Où dormir */}
      <div className="px-5 pt-7">
        <h2 className="mb-3.5 text-[16px] font-bold text-ink">Où dormir</h2>
        <div className="flex flex-col gap-2.5">
          {hotels.map((hotel) => (
            <div
              key={hotel.name}
              className="flex items-center justify-between gap-3 rounded-[18px] border border-ink/[0.07] bg-white p-4 shadow-[0_2px_4px_rgba(20,30,10,0.04),0_10px_20px_rgba(20,30,10,0.06)]"
            >
              <div>
                <div className="text-[12.5px] font-bold text-ink">
                  {hotel.name}
                </div>
                <div className="mt-1 text-[11px] text-ink-faint">
                  {hotel.distance}
                </div>
              </div>
              <span className="flex-shrink-0 rounded-full bg-olive px-3.5 py-2 text-[11px] font-bold text-white">
                Réserver
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-5 mt-8 h-px bg-ink/[0.08]" />

      {/* Comment venir */}
      <div className="px-5 pt-7">
        <h2 className="mb-3.5 text-[16px] font-bold text-ink">
          Comment venir
        </h2>
        <div className="overflow-hidden rounded-[20px] border border-ink/[0.07] bg-white shadow-[0_2px_4px_rgba(20,30,10,0.04),0_10px_20px_rgba(20,30,10,0.06)]">
          <div className="relative h-[130px] bg-gradient-to-br from-sage via-olive to-olive-deep">
            <span className="absolute right-2.5 bottom-2 rounded-full bg-white/20 px-2.5 py-1 text-[9px] text-white backdrop-blur-md">
              Emplacement carte
            </span>
          </div>
          <div className="p-4">
            <div className="text-[12.5px] font-bold text-ink">
              {siteConfig.venueAddress}
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-ink-faint">
              Parking sur place · [Info navette / covoiturage si besoin]
            </p>
          </div>
        </div>
      </div>

      <div className="mx-5 mt-8 h-px bg-ink/[0.08]" />

      {/* Météo */}
      <div className="px-5 pt-7 pb-10">
        <h2 className="mb-3.5 text-[16px] font-bold text-ink">
          La météo du jour J
        </h2>
        <DarkPanel className="flex items-center justify-between p-5.5">
          <div>
            <div className="text-[11px] text-[#c7cf9e]">
              {new Date(siteConfig.weddingDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
              })}
            </div>
            <div className="mt-1 text-[32px] font-extrabold text-white">
              [__]°C
            </div>
            <div className="mt-0.5 text-[11px] text-[#c7cf9e]">
              [Prévisions à venir]
            </div>
          </div>
        </DarkPanel>
        <p className="mt-2.5 text-center text-[10.5px] text-ink-faint/80">
          Mise à jour automatique à l&apos;approche du mariage
        </p>
      </div>

      <PageFooter signOff="À bientôt" />
    </div>
  );
}
