import type { ReactNode } from "react";

/** Carte pleine largeur en dégradé olive, avec blob décoratif — pour les
 * moments d'action principaux (cagnotte, capsule, souvenirs, météo). */
export function DarkPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[24px] bg-gradient-to-br from-sage via-olive to-olive-deep shadow-[0_14px_28px_rgba(40,45,20,0.26)] ${className}`}
    >
      <div className="pointer-events-none absolute -top-8 -right-6 h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0)_70%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
