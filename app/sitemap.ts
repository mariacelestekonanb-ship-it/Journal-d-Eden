import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/comprendre", priority: 0.8, changeFrequency: "weekly" as const },
  {
    path: "/veille-juridique",
    priority: 0.9,
    changeFrequency: "daily" as const,
  },
  { path: "/glossaire", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/ressources", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/a-propos", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/contact", priority: 0.4, changeFrequency: "yearly" as const },
  {
    path: "/mentions-legales",
    priority: 0.1,
    changeFrequency: "yearly" as const,
  },
  {
    path: "/confidentialite",
    priority: 0.1,
    changeFrequency: "yearly" as const,
  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
