# notifications

Le module Notifications — centre de notifications personnel, icône du Header, et API
prête pour que les autres modules émettent un événement.

```
types/         # Notification, NotificationType/Priority, filtres, stats, groupes
validation/    # Schéma Zod de création (garde-fou de NotificationService.notify)
data/          # Fixtures de démonstration (mode démo)
mappers/       # Lignes Supabase → Notification (isRead dérivé de read_at)
queries/       # Requêtes Supabase brutes
repositories/  # NotificationRepository (interface + impl. mock/Supabase)
services/      # NotificationService, NotificationValidationService
actions/       # Façades d'écriture (mark-read, mark-all-read, delete, create)
hooks/         # React Query + état local (filtres, statistiques, vue Liste/Tableau)
utils/         # Libellés/icônes type et priorité, permissions, regroupement chronologique
components/    # Composants réutilisables (voir NOTIFICATIONS.md)
pages/         # NotificationsView (centre de notifications)
```

Voir [`NOTIFICATIONS.md`](../../../../NOTIFICATIONS.md) à la racine du projet pour
l'architecture complète, le modèle métier et les décisions de conception.

## Règle d'architecture

Les composants et hooks ne connaissent que `NotificationService` — jamais Supabase,
jamais `notification.queries.ts` ni `NotificationRepository` directement. Contrairement
aux autres modules, une notification reste strictement personnelle même pour un
`ADMIN` — voir `utils/notification-permissions.ts`.

## Import

```ts
import { NotificationsView, NotificationBell } from "@/features/notifications";
```
