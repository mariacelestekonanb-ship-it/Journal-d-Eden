# members

Le module Membres — demandes d'adhésion, validation admin, profils, rôles et suivi des
conducteurs de prière de l'EJP.

```
types/         # Member, MemberStatus, MemberRole (alias de Role), filtres, historiques
validation/    # Schémas Zod (adhésion, profil, e-mail)
data/          # Fixtures de démonstration (mode démo)
mappers/       # Lignes Supabase (profiles) → Member
queries/       # Requêtes Supabase — member.queries.ts (clé anon) et member-admin.queries.ts (server-only)
repositories/  # MemberRepository (interface + impl. mock/Supabase)
services/      # MemberService, MemberWorkflowService, MemberValidationService
actions/       # Façades d'écriture + les deux Server Actions nécessitant la clé de service
hooks/         # React Query + état local (filtres, statistiques)
utils/         # Statuts, permissions par rôle, libellés d'historique
components/    # Composants réutilisables (voir MEMBERS.md)
pages/         # MembersView, MemberRequestsView, MemberDetailView, MemberSelfProfileView, MemberJoinView
```

Voir [`MEMBERS.md`](../../../../MEMBERS.md) à la racine du projet pour l'architecture
complète, le workflow d'adhésion et les décisions de conception.

## Règle d'architecture

Les composants et hooks ne connaissent que `MemberService` — jamais Supabase, jamais
`member.queries.ts` ni `MemberRepository` directement. Les deux seules exceptions
(création de compte, changement d'e-mail) sont des Server Actions dédiées
(`actions/create-membership-request.action.ts`, `actions/update-member-email.action.ts`),
jamais appelées via `MemberService`.

## Import

```ts
import {
  MemberJoinView,
  MembersView,
  MemberRequestsView,
  MemberDetailView,
  MemberSelfProfileView,
} from "@/features/members";
```
