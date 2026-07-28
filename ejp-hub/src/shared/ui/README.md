# shared/ui

Primitives shadcn/ui (Button, Card, Dialog, DropdownMenu, Input, Select,
Sheet, Tabs, Tooltip, etc.), écrites à la main faute d'accès réseau au
registre shadcn dans cet environnement, mais alignées sur les conventions et
l'API officielles du CLI (mêmes noms, mêmes props, style « new-york »).

**Ne pas modifier ces fichiers pour du style propre à une page ou un module** —
préférez composer ou envelopper une primitive dans `shared/components/` (ex.
`AppButton`). Ce dossier reste la source neutre, réutilisable par toute
l'application.

Pour ajouter une nouvelle primitive shadcn plus tard (avec accès au registre),
utilisez `npx shadcn@latest add <composant>` en pointant vers ce dossier via
`components.json` (`aliases.ui`).
