import type { Metadata } from "next";
import { DarkPanel } from "@/components/dark-panel";
import { PageFooter } from "@/components/page-footer";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";

export const metadata: Metadata = {
  title: "Capsule temporelle — Espace invités",
};

export default function CapsuleTemporellePage() {
  return (
    <div>
      <TopBar />
      <SectionHeader
        title="Capsule temporelle"
        description="Écrivez-nous un mot, un souvenir ou un vœu pour notre couple. Nous le découvrirons ensemble, scellé jusqu'à cette date."
      />

      <div className="pt-5 text-center">
        <span className="inline-block rounded-full bg-olive px-4.5 py-2.5 text-[10.5px] font-bold tracking-[0.08em] text-white shadow-[0_8px_16px_rgba(82,87,44,0.3)]">
          À ouvrir le [date d&apos;ouverture]
        </span>
      </div>

      <div className="px-5 pt-5">
        <DarkPanel className="p-6">
          <div className="mb-3 text-xs text-[#e4e7c8]">Votre message</div>
          <textarea
            rows={4}
            placeholder="Écrivez ici…"
            className="w-full resize-none border-none bg-transparent text-xs leading-relaxed text-white placeholder:text-[#d6de9e] focus:outline-none"
          />
        </DarkPanel>
      </div>

      <div className="px-5 pt-5">
        <button
          type="button"
          className="w-full rounded-full bg-olive py-3.5 text-[12.5px] font-bold text-white shadow-[0_10px_20px_rgba(82,87,44,0.3)]"
        >
          Sceller mon message
        </button>
      </div>

      <PageFooter signOff="À dans quelques années" />
    </div>
  );
}
