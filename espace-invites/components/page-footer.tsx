import { siteConfig } from "@/lib/site-config";

export function PageFooter({ signOff }: { signOff: string }) {
  return (
    <div className="relative mt-7 overflow-hidden bg-gradient-to-br from-[#7a8440] to-olive-deep px-6 py-9 text-center">
      <div className="pointer-events-none absolute -top-8 -right-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(196,207,130,0.22)_0%,rgba(196,207,130,0)_70%)]" />
      <p className="relative font-display text-2xl text-white italic">
        {signOff}
      </p>
      <p className="relative mt-2.5 text-[10px] tracking-[0.16em] text-sage-light uppercase">
        {siteConfig.couple.names}
      </p>
    </div>
  );
}
