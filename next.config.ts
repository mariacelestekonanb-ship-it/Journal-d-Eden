import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicite plutôt qu'implicite : la compression gzip/brotli est déjà le
  // comportement par défaut de Next.js en production, mais l'exprimer ici
  // documente l'intention plutôt que de compter sur une valeur par défaut
  // silencieuse.
  compress: true,
  // Retire l'en-tête `X-Powered-By: Next.js`, qui ne sert qu'à révéler la
  // stack technique sans apporter de valeur au visiteur ni au référencement.
  poweredByHeader: false,
};

export default nextConfig;
