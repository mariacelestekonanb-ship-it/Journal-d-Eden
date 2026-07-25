"use client";

import * as React from "react";

export interface ReadingProgressProps {
  /** Id du conteneur dont on mesure la progression de lecture (l'article, pas toute la page). */
  targetId: string;
}

/** Barre de progression de lecture, mesurée sur le conteneur de l'article. */
export function ReadingProgress({ targetId }: ReadingProgressProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    function handleScroll() {
      const element = document.getElementById(targetId);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const ratio = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
      setProgress(Math.round(ratio * 100));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [targetId]);

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium tracking-wide uppercase">
          Progression
        </span>
        <span className="text-foreground font-medium">{progress}%</span>
      </div>
      <div
        role="progressbar"
        aria-label="Progression de lecture"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="bg-secondary mt-2 h-1.5 w-full overflow-hidden rounded-full"
      >
        <div
          className="bg-accent h-full rounded-full transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
