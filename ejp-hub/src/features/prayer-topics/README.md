# prayer-topics

Le module Sujets de prière — création, organisation, recherche et archivage des sujets
portés par la communauté.

```
types/        # PrayerTopic, catégories/priorités/statuts, filtres — le modèle métier
validation/   # Schéma Zod du formulaire
data/         # Fixtures de démonstration (mode démo)
mappers/      # Lignes Supabase → PrayerTopic
queries/      # Requêtes Supabase brutes (préparées, pas encore appelées en prod)
services/     # PrayerTopicRepository (interface + impl. mock/Supabase), PrayerTopicService,
              # PrayerTopicArchiveService, PrayerTopicSearchService
actions/      # Façades d'écriture appelées par les hooks (create/update/delete/duplicate/archive/restore)
hooks/        # React Query + état local (filtres, vue persistée, statistiques)
utils/        # Libellés/couleurs/icônes (catégorie, priorité, statut), permissions, export CSV
components/   # Composants réutilisables (voir PRAYER_TOPICS.md)
pages/        # PrayerTopicsView (liste/cartes) et PrayerTopicsArchiveView
```

Voir [`PRAYER_TOPICS.md`](../../../../PRAYER_TOPICS.md) à la racine du projet pour
l'architecture complète, le flux de données et les décisions de conception.

## Règle d'architecture

Les composants et hooks ne connaissent que `PrayerTopicService` — jamais Supabase,
jamais `prayer-topic.queries.ts` ni `PrayerTopicRepository` directement.

## Import

```ts
import { PrayerTopicsView, PrayerTopicsArchiveView } from "@/features/prayer-topics";
```
