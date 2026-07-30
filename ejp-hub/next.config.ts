import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Couvre la photo de profil (5 Mo max côté validation, voir
      // member-join.schema.ts) + la marge d'encodage du transport RPC des
      // Server Actions — le défaut de Next (1 Mo) la rejetait systématiquement.
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
