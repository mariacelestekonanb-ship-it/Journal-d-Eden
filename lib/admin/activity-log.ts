import type { ActivityLogEntry } from "@/lib/admin/types";

function seedActivity(): ActivityLogEntry[] {
  return [
    {
      id: "activity-seed-1",
      date: "2026-07-23T09:14:00.000Z",
      auteur: "Léa Moreau",
      action: "a publié",
      entityType: "analyse",
      titre:
        "L'EDPB adopte des lignes directrices sur les transferts internationaux de données",
      href: "/admin/veille/edpb-lignes-directrices-transferts-internationaux",
    },
    {
      id: "activity-seed-2",
      date: "2026-07-20T16:42:00.000Z",
      auteur: "Camille Dupuis",
      action: "a mis à jour",
      entityType: "fiche",
      titre: "Qu'est-ce qu'un système d'IA « à haut risque » selon l'AI Act ?",
      href: "/admin/fiches/ia-act-systemes-haut-risque",
    },
    {
      id: "activity-seed-3",
      date: "2026-07-18T11:05:00.000Z",
      auteur: "Younes Haddad",
      action: "a envoyé en relecture",
      entityType: "glossaire",
      titre: "Interopérabilité",
      href: "/admin/glossaire/interoperabilite",
    },
    {
      id: "activity-seed-4",
      date: "2026-07-14T08:30:00.000Z",
      auteur: "Camille Dupuis",
      action: "a archivé",
      entityType: "ressource",
      titre:
        "Publication : gouvernance des données spatiales et souveraineté numérique",
      href: "/admin/ressources/ressource-6",
    },
  ];
}

const GLOBAL_KEY = "__lexwatch_admin_activity_log__";

/**
 * Ancré sur `globalThis` pour la même raison que les dépôts (voir
 * `lib/admin/repository.ts`) : une variable de module `let entries` serait
 * dupliquée entre le chunk des Server Actions et celui des pages qui
 * affichent le journal, rendant les nouvelles entrées invisibles.
 */
function store(): { entries: ActivityLogEntry[] } {
  const g = globalThis as unknown as Record<
    string,
    { entries: ActivityLogEntry[] } | undefined
  >;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = { entries: seedActivity() };
  }
  return g[GLOBAL_KEY]!;
}

/**
 * Journal d'activité en mémoire — même limitation que les dépôts (voir
 * `lib/admin/repository.ts`) : réel pendant la durée de vie du processus,
 * pas persistant. Alimenté par les actions génériques (voir
 * `lib/admin/actions.ts`) pour que « Activité récente » du tableau de bord
 * reflète vraiment ce qui se passe dans la session, pas une donnée figée.
 */
export async function logActivity(
  entry: Omit<ActivityLogEntry, "id" | "date">,
) {
  const newEntry: ActivityLogEntry = {
    ...entry,
    id: `activity-${Date.now().toString(36)}-${Math.round(Math.random() * 1000)}`,
    date: new Date().toISOString(),
  };
  const s = store();
  s.entries = [newEntry, ...s.entries].slice(0, 50);
}

export async function getRecentActivity(
  limit = 8,
): Promise<ActivityLogEntry[]> {
  return store().entries.slice(0, limit);
}
