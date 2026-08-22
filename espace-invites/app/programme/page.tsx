import type { Metadata } from "next";
import { PageFooter } from "@/components/page-footer";
import { SectionHeader } from "@/components/section-header";
import { TopBar } from "@/components/top-bar";
import { programme } from "@/lib/site-config";

export const metadata: Metadata = { title: "Programme — Espace invités" };

export default function ProgrammePage() {
  return (
    <div>
      <TopBar />
      <SectionHeader
        title="Le programme"
        description="Le déroulé de notre journée, pour ne rien manquer."
      />

      <div className="relative px-6.5 pt-7 pb-2.5">
        <div className="absolute top-8.5 bottom-8.5 left-[65px] w-px bg-sage/30" />

        <ol className="flex flex-col gap-7.5">
          {programme.map((item) => (
            <li key={item.title} className="relative flex gap-4">
              <div className="w-9 flex-shrink-0 pt-2 text-right text-xs font-bold text-olive">
                {item.time}
              </div>
              <div className="flex w-4 flex-shrink-0 justify-center pt-2.5">
                <div className="h-2.5 w-2.5 rounded-full bg-olive ring-4 ring-white" />
              </div>
              <div className="flex-1 rounded-[18px] border border-ink/[0.07] bg-white p-4 shadow-[0_2px_4px_rgba(20,30,10,0.05),0_10px_20px_rgba(20,30,10,0.06)]">
                <div className="text-[12.5px] font-bold text-ink">
                  {item.title}
                </div>
                <div className="mt-0.5 text-[10.5px] text-ink-faint">
                  {item.detail}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <PageFooter signOff="Hâte de vous voir" />
    </div>
  );
}
