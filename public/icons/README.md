# Icônes PWA

Ce dossier est réservé aux icônes statiques nécessaires pour rendre
LexWatch installable en Progressive Web App (aujourd'hui non activé — voir
`app/manifest.ts` et `ROADMAP.md`).

Fichiers attendus lors de l'activation de la PWA :

| Fichier                 | Taille                                    | Usage                                            |
| ----------------------- | ----------------------------------------- | ------------------------------------------------ |
| `icon-192.png`          | 192×192                                   | Icône Android/Chrome standard                    |
| `icon-512.png`          | 512×512                                   | Icône Android/Chrome haute résolution            |
| `icon-maskable-512.png` | 512×512 (zone de sécurité centrale ~80 %) | Icône adaptative Android (`purpose: "maskable"`) |
| `splash-*.png`          | selon appareil                            | Écrans de démarrage iOS (optionnel)              |

Une fois ces fichiers ajoutés, les déclarer dans `icons` de
`app/manifest.ts` (avec `purpose: "maskable"` pour la variante adaptative).
Le favicon (`/icon`) et l'icône iOS (`/apple-icon`) sont déjà générés
dynamiquement par `app/icon.tsx` et `app/apple-icon.tsx` — inutile d'en
déposer une copie statique ici.
