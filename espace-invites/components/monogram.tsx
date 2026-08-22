import { siteConfig } from "@/lib/site-config";

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-sage to-olive ${className}`}
    >
      <span className="font-display text-[11px] text-white">
        {siteConfig.couple.monogram}
      </span>
    </div>
  );
}
