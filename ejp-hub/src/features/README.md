# features

Un dossier par module métier, en **architecture Feature First** : chaque
module est indépendant et regroupe tout ce qui le concerne.

```
features/<module>/
├── types/          # types spécifiques au module
├── validation/     # schémas Zod
├── data/           # fixtures de démonstration (mode démo)
├── mappers/        # lignes Supabase → types applicatifs
├── queries/        # requêtes Supabase brutes
├── repositories/   # contrat + implémentations mock/Supabase
├── services/       # logique métier, choisit l'implémentation du repository
├── actions/        # Server Actions (contexte serveur)
├── hooks/          # hooks React Query (lecture/mutation) + état local
├── utils/          # permissions, libellés, helpers purs
├── components/     # composants React réutilisables
├── pages/          # vues assemblées, câblées aux routes de `src/app/`
└── index.ts        # seul point d'entrée public — les autres modules et `src/app/`
                     # n'importent jamais un chemin profond
```

Modules actuels :

| Module | Rôle |
| --- | --- |
| `auth` | Connexion, mot de passe oublié, déconnexion, session, contexte de rôle (transverse, voir `ARCHITECTURE.md`) |
| `dashboard` | Tableau de bord |
| `planning` | Planning des créneaux de prière |
| `prayer-topics` | Sujets de prière |
| `reports` | Comptes rendus (chaîne de prière) |
| `members` | Adhésions, validation, rôles, auto-profil (« Mon profil ») |
| `notifications` | Centre de notifications personnel |
| `admin` | Administration de la plateforme |
| `testimonies` | Témoignages — état vide uniquement, non développé |

Le code partagé par plusieurs modules va dans `shared/`, jamais dupliqué
d'un module à l'autre.
