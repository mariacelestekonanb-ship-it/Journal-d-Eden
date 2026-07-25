"use client";

import * as React from "react";

/**
 * Indique si la page a été défilée au-delà d'un seuil (par défaut 8px).
 * Utilisé par le Header pour activer le fond flouté et l'ombre au scroll.
 */
export function useScrolled(threshold = 8): boolean {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > threshold);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}
