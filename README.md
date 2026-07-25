# LexWatch

Plateforme premium de vulgarisation et de veille juridique sur le droit spatial et le droit du numérique.

## Stack

- [Next.js 15](https://nextjs.org) (App Router, TypeScript strict)
- [Tailwind CSS v4](https://tailwindcss.com)
- Design system maison inspiré de shadcn/ui (Radix UI + `class-variance-authority`)
- Polices [Manrope](https://fonts.google.com/specimen/Manrope) (titres) et [Inter](https://fonts.google.com/specimen/Inter) (texte)

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Architecture

```
app/                  Pages (App Router)
  comprendre/         Fondamentaux du droit spatial et numérique
  veille-juridique/   Actualité juridique
  glossaire/          Glossaire des notions clés
  ressources/         Textes officiels, rapports, guides
  a-propos/           Mission et valeurs
  contact/            Formulaire de contact
components/
  ui/                 Primitives du design system (Button, Card, Input, Badge, Sheet…)
  layout/             Header, Footer
  sections/           Hero, SearchBar, PageHeader, explorateurs de contenu
  cards/              QuestionCard, VeilleCard, CategorieCard
lib/                  Utilitaires (cn, formatage, accès aux données, configuration du site)
data/                 Contenus (catégories, veille, questions, glossaire, ressources)
types/                Types TypeScript partagés
```

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run start` — serveur de production
- `npm run lint` — ESLint
