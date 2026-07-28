# dashboard

Page d'accueil de l'application : message de bienvenue, statistiques
adaptées au rôle, prochaines conduites, derniers sujets de prière,
notifications, activité récente et actions rapides.

```
components/         # Composants atomiques réutilisables (StatsCard, PrayerTopicCard, …)
components/sections/# Sections composées (assemblent les composants atomiques + un hook)
hooks/               # Hooks React Query (un par section) + use-greeting (horloge)
services/            # DashboardService (API publique), DashboardQueries (Supabase),
                     # DashboardMapper (lignes → types), DashboardStatsConfig (libellés/icônes)
types/               # DashboardTypes — le seul contrat connu des composants
data/                # DashboardMocks — données de démonstration
pages/               # DashboardView — assemble toutes les sections
```

## Règle d'architecture

Les composants et hooks ne connaissent que `services/dashboard.service.ts`
(`DashboardService`) — jamais Supabase, jamais `dashboard.queries.ts`. Le
service bascule automatiquement entre données réelles et données fictives
selon `isSupabaseConfigured()` (voir `shared/lib/supabase/config.ts`), sans
qu'aucun composant n'ait à le savoir.

## Import

Toujours depuis la racine du module :

```ts
import { DashboardView } from "@/features/dashboard";
```

Jamais un chemin profond (`@/features/dashboard/pages/dashboard-view`, etc.)
depuis l'extérieur du module.
