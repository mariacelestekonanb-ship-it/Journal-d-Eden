# Contribuer à LexWatch

Merci de l'intérêt porté à ce projet. Ce guide décrit comment proposer une
modification.

## Avant de commencer

- Consulter [ROADMAP.md](./ROADMAP.md) pour savoir si le sujet est déjà
  identifié (et pourquoi il est, ou non, hors périmètre actuel).
- Pour un changement important (nouvelle fonctionnalité, changement
  d'architecture), ouvrir une issue de discussion avant de coder — cela
  évite un travail jeté si l'approche ne convient pas.
- Pour une correction de bug ou une amélioration mineure, une pull request
  directe suffit.

## Mise en place locale

```bash
git clone <url-du-dépôt>
cd lexwatch
npm install
npm run dev
```

Voir le [README](./README.md#variables-denvironnement) pour les variables
d'environnement optionnelles.

## Avant d'ouvrir une pull request

Le projet n'a pas encore de suite de tests automatisés (voir
[ROADMAP.md](./ROADMAP.md)) : la vérification manuelle ci-dessous est donc
la seule garde-fou disponible et **doit** passer avant toute PR :

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Pour un changement visuel ou interactif, vérifier manuellement dans un
navigateur (desktop et mobile) : les vérifications ci-dessus ne couvrent ni
le rendu ni le comportement réel.

## Conventions de code

Voir la section [Conventions de code](./README.md#conventions-de-code) du
README — en résumé :

- TypeScript strict, aucun `any`.
- Toute couleur/rayon passe par un token du design system (`styles/globals.css`,
  `components/ui/`) — jamais de valeur arbitraire codée en dur.
- Réutiliser un composant existant avant d'en créer un nouveau ; ne
  dupliquer ni logique ni style.
- Commentaires : expliquer le _pourquoi_, jamais le _quoi_.
- Laisser ESLint/Prettier trancher le style — ne pas reformater à la main.

## Messages de commit

Un message clair et descriptif, au présent, expliquant le _pourquoi_ du
changement plutôt que sa liste mécanique. Le dépôt n'impose pas de format
strict (type Conventional Commits) à ce stade, mais la cohérence avec
l'historique existant (`git log`) est appréciée.

## Structure d'une pull request

- Une PR = un sujet. Éviter de mélanger un refactor et une nouvelle
  fonctionnalité dans le même changement.
- Décrire ce qui change et pourquoi, pas seulement le _quoi_ (le diff le
  montre déjà).
- Mentionner les vérifications manuelles effectuées (pages testées,
  navigateurs, tailles d'écran) puisqu'aucun test automatisé ne les
  couvre encore.

## Signaler un problème de sécurité

Ne **jamais** ouvrir une issue publique pour une vulnérabilité de
sécurité — suivre la procédure décrite dans [SECURITY.md](./SECURITY.md).

## Code de conduite

Toute contribution est soumise au [Code de conduite](./CODE_OF_CONDUCT.md)
du projet.
