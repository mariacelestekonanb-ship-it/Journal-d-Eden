# features

Un dossier par module métier, en **architecture Feature First** : chaque
module est indépendant et regroupe tout ce qui le concerne.

```
features/<module>/
├── components/   # composants React (pages/vues, formulaires, listes)
├── hooks/        # hooks React Query (lecture/mutation)
├── services/     # appels Supabase
├── types/        # types spécifiques au module
├── validation/   # schémas Zod
└── actions/      # Server Actions (contexte serveur)
```

Modules actuels :

| Module | Rôle |
| --- | --- |
| `auth` | Connexion, mot de passe oublié, déconnexion, session |
| `dashboard` | Tableau de bord |
| `planning` | Planning des créneaux de prière |
| `prayer-topics` | Sujets de prière |
| `reports` | Comptes rendus |
| `testimonies` | Témoignages |
| `profile` | Mon profil |
| `admin` | Administration des comptes |

Le code partagé par plusieurs modules va dans `shared/`, jamais dupliqué
d'un module à l'autre.
