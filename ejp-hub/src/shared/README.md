# shared

Code transverse à toute l'application, utilisé par plusieurs modules de
`features/`.

| Dossier | Rôle |
| --- | --- |
| `components/` | Design system (`App*`) + layout global (sidebar, header, shell) |
| `ui/` | Primitives shadcn/ui brutes |
| `hooks/` | Hooks React transverses |
| `lib/` | Intégrations externes (Supabase) et utilitaires bas niveau (`cn`) |
| `services/` | Services transverses (aucun aujourd'hui) |
| `types/` | Types globaux, dont `database.ts` (schéma Supabase) |
| `utils/` | Fonctions pures (formatage de dates, initiales, …) |
| `constants/` | Constantes globales (nom de l'app, routes) |
| `providers/` | Fournisseurs React globaux (React Query, thème) |

Règle : si un bout de code n'est utilisé que par un seul module, il doit
vivre dans `features/<module>/`, pas ici.
