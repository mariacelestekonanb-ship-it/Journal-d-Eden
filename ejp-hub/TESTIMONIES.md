# Témoignages

Le module Témoignages est le plus simple de l'application, volontairement : **publication libre**,
ouverte à tout membre connecté (`ADMIN` ou `PRAYER_LEADER`), sans aucune modération ni validation
admin. C'est une différence de conception assumée par rapport à tous les autres modules
(Planning, Comptes rendus, Sujets de prière), où une action de création ou de modification passe
presque toujours par une permission `ADMIN`. Ce document explique le modèle métier, le flux de
données et les décisions de conception.

## Modèle métier

```ts
interface Testimony {
  id: string;
  title: string;
  content: string;
  author: TestimonyAuthor;
  createdAt: string;
  updatedAt: string;
}

interface TestimonyAuthor {
  id: string;
  fullName: string;
  /** `false` si le membre a été supprimé (ou désactivé) depuis — le nom reste
   *  affiché, grisé. Absent = actif. */
  isActive?: boolean;
}
```

Pas de statut, pas de workflow, pas de champ de modération : un témoignage publié est
immédiatement visible par tout le monde.

## Permissions

`canDeleteTestimony(testimony, userId, role)` est la seule règle de permission du module :

| Droit | `ADMIN` | `PRAYER_LEADER` |
| --- | --- | --- |
| Consulter tous les témoignages | ✅ | ✅ |
| Publier un témoignage | ✅ | ✅ |
| Supprimer son propre témoignage | ✅ | ✅ |
| Supprimer le témoignage d'un autre membre | ✅ | ❌ |

```ts
export function canDeleteTestimony(testimony: Testimony, userId: string, role: Role): boolean {
  return role === "ADMIN" || testimony.author.id === userId;
}
```

Il n'existe volontairement pas de `canCreate` : tout utilisateur connecté peut publier, point —
le bouton « Nouveau témoignage » est donc toujours visible, sans garde de rôle.

## RLS — même règle des deux côtés

Comme pour les autres modules, la permission n'est pas qu'une question d'affichage : les policies
RLS de `testimonies` appliquent exactement la même règle côté base (voir
[`DATABASE.md#testimonies`](./DATABASE.md#testimonies)) —

- `testimonies_select` : ouverte à tout utilisateur authentifié.
- `testimonies_insert_own` : `auth.uid() = author_id` — un utilisateur ne peut publier qu'en son
  propre nom, mais sans aucune autre condition (pas de statut à valider, contrairement à
  `reports_insert_own` par exemple).
- `testimonies_delete_own_or_admin` : `auth.uid() = author_id or is_admin()` — ajoutée par
  `20260813090001_member_deletion_and_profile_visibility.sql` ; auparavant réservée à l'admin
  seul, ce qui empêchait un auteur de retirer son propre témoignage.

## Flux de données

```
TestimoniesView (page)
   │
   ├─ useTestimonies()       ──► TestimonyService.list()   ──► Repository (mock | Supabase)
   ├─ TestimonyCard (× n)        (auteur grisé si isActive === false)
   ├─ TestimonyFormDialog ──► useCreateTestimony() ──► TestimonyService.create()
   └─ ConfirmDialog       ──► useDeleteTestimony() ──► TestimonyService.remove()
          └─ TestimonyService ──► Repository ──► invalidation React Query
```

Aucun composant n'appelle Supabase (ni même `TestimonyRepository`) directement : tout passe par
`TestimonyService`, qui choisit l'implémentation au moment de l'appel, exactement comme les autres
modules :

```ts
function getRepository(): TestimonyRepository {
  return isSupabaseConfigured() ? SupabaseTestimonyRepository : MockTestimonyRepository;
}
```

## Nom grisé pour un auteur supprimé

Un témoignage garde le nom réel de son auteur même après suppression de son compte
(`profiles.deleted_at`, voir [`MEMBERS.md#suppression`](./MEMBERS.md#suppression)) — jamais
anonymisé ni masqué, seulement grisé/italique dans `TestimonyCard` dès que
`testimony.author.isActive === false`. Le témoignage lui-même n'est jamais supprimé du fait de la
suppression de son auteur : les deux actions sont indépendantes (un admin peut toujours supprimer
un témoignage précis via `canDeleteTestimony`, mais ce n'est pas automatique).

## Mode démo

Tant qu'aucun projet Supabase n'est configuré, `MockTestimonyRepository` tient un tableau mutable
en mémoire (`INITIAL_MOCK_TESTIMONIES`, 3 témoignages fictifs) : publier et supprimer un
témoignage fonctionnent réellement, sans écrire dans une base.

## Composants

| Composant | Rôle |
| --- | --- |
| `TestimonyCard` | Titre, contenu, auteur (grisé si supprimé) et date relative, avec suppression optionnelle |
| `TestimonyFormDialog` | Formulaire de publication (titre + contenu, Zod) |

## Services

| Service | Rôle |
| --- | --- |
| `TestimonyRepository` (interface) | Contrat `list`/`create`/`remove` |
| `MockTestimonyRepository` / `SupabaseTestimonyRepository` | Implémentations, choisies par `TestimonyService` |
| `TestimonyService` | API publique consommée par les hooks (seul point d'entrée) |

## Prochaine étape : connexion Supabase réelle

1. Lier le projet (`supabase link`) et appliquer les migrations (voir `SUPABASE_SETUP.md`).
2. Régénérer `src/shared/types/database.ts` (`supabase gen types typescript`).
3. Aucun changement dans `features/testimonies/components/` ni `hooks/` : `TestimonyService`
   bascule automatiquement sur `SupabaseTestimonyRepository` dès que `isSupabaseConfigured()`
   répond `true`.
4. Vérifier les policies RLS de `testimonies` (déjà posées, voir ci-dessus).
