"use client";

import { cn } from "@/lib/utils";

export interface SectionTab<T extends string> {
  id: T;
  label: string;
}

export interface SectionTabsProps<T extends string> {
  tabs: SectionTab<T>[];
  active: T;
  onChange: (id: T) => void;
}

/** Bascule d'onglets simple (Contenu / Historique…) pour les pages d'édition — un seul composant réutilisé par les modules fiches et veille. */
export function SectionTabs<T extends string>({
  tabs,
  active,
  onChange,
}: SectionTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label="Sections du contenu"
      className="border-border flex gap-1 overflow-x-auto border-b"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "focus-visible:ring-ring focus-visible:ring-offset-background -mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            active === tab.id
              ? "border-navy-900 text-foreground"
              : "text-muted-foreground hover:text-foreground border-transparent",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
