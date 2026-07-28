# shared/components

Composants applicatifs réutilisables, au-dessus des primitives shadcn/ui
(`shared/ui/`) :

- **Design system** (`app-*.tsx`) : `AppButton`, `AppCard`, `AppBadge`,
  `AppAvatar`, `AppEmptyState`, `AppPageHeader`, `AppSection`, `AppLoader`.
  Ce sont les composants à utiliser dans les pages/features — ils encapsulent
  les primitives `shared/ui/` avec les conventions de l'application (variantes,
  espacements, comportements par défaut).
- **`layout/`** : structure globale de l'application (sidebar, header, shell,
  menu utilisateur, bascule de thème).
- **`providers/`** : fournisseurs React globaux (React Query, thème, tooltips).

Règle simple : si un composant est un habillage direct d'une primitive shadcn
avec la convention de nommage de l'app, il va ici en `App*`. S'il s'agit de la
primitive brute générée par shadcn, elle reste dans `shared/ui/`.
