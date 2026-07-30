"use client";

import * as React from "react";

/** Enregistre `/sw.js` une seule fois — condition préalable aux notifications Web Push. Ne rend rien. */
export function ServiceWorkerRegistration() {
  React.useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Échec de l'enregistrement du service worker :", error);
    });
  }, []);

  return null;
}
