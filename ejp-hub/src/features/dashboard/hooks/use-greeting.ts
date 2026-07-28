"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import * as React from "react";

export interface Greeting {
  /** « Bonjour », « Bon après-midi » ou « Bonsoir », selon l'heure courante. */
  salutation: string;
  time: string;
  date: string;
}

function computeGreeting(now: Date): Greeting {
  const hours = now.getHours();
  const salutation = hours < 12 ? "Bonjour" : hours < 18 ? "Bon après-midi" : "Bonsoir";

  return {
    salutation,
    time: format(now, "HH:mm"),
    date: format(now, "EEEE d MMMM yyyy", { locale: fr }),
  };
}

/** Salutation, heure et date courantes, rafraîchies chaque minute. */
export function useGreeting(): Greeting {
  const [greeting, setGreeting] = React.useState<Greeting>(() => computeGreeting(new Date()));

  React.useEffect(() => {
    const interval = setInterval(() => setGreeting(computeGreeting(new Date())), 60_000);
    return () => clearInterval(interval);
  }, []);

  return greeting;
}
