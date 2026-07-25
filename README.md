# LexWatch

Plateforme premium de vulgarisation et de veille juridique sur le droit spatial et le droit du numérique.

Ce dépôt contient les **fondations techniques** du projet : architecture, design
system et squelettes de pages. Les pages ne portent pas encore de contenu
métier — chacune n'utilise que les composants du design system, prête à
recevoir son contenu réel dans une phase ultérieure.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + [React 19](https://react.dev)
- TypeScript strict (aucun `any`)
- [Tailwind CSS v4](https://tailwindcss.com)
- Design system maison façon shadcn/ui (Radix UI + `class-variance-authority`)
- [Lucide React](https://lucide.dev) pour les icônes
- [Framer Motion](https://motion.dev) pour les animations (menu mobile, Hero)
- Polices [Manrope](https://fonts.google.com/specimen/Manrope) (titres) et [Inter](https://fonts.google.com/specimen/Inter) (texte), via `next/font/google`
- ESLint + Prettier (avec `prettier-plugin-tailwindcss`)

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Architecture

```
app/                    Pages (App Router) — structure uniquement
  comprendre/
  veille-juridique/
  glossaire/
  ressources/
  a-propos/
  contact/
  mentions-legales/     Page légale squelette (lien de pied de page)
  confidentialite/      Page légale squelette (lien de pied de page)
  layout.tsx            Layout racine, polices, metadata SEO
  sitemap.ts            Sitemap généré
  robots.ts             robots.txt généré
  manifest.ts           Manifest PWA généré
  icon.tsx              Favicon généré (image navy/or)
  apple-icon.tsx         Icône iOS générée
  opengraph-image.tsx   Image Open Graph / Twitter par défaut

components/
  ui/                   Design system : Container, Section, Button, Input,
                        Badge, Card, Heading, Paragraph, Tag, Divider,
                        EmptyState, SearchInput, Sheet
  layout/               Header (nav + recherche + drawer), Footer
  shared/               Composants transverses : PageHeader, Logo,
                        SearchDialog, ContentPageShell
  home/                 Composants propres à l'accueil (Hero)
  cards/                QuestionCard, VeilleCard, CategorieCard
                        (prêtes pour la prochaine phase, pas encore utilisées)

hooks/                  useDisclosure, useScrolled, useMediaQuery /
                        usePrefersReducedMotion
lib/                    cn(), formatage, configuration du site (nav, SEO),
                        accès aux données
data/                   Contenus d'exemple (catégories, veille, questions,
                        glossaire, ressources) — pas encore branchés aux pages
types/                  Types TypeScript partagés
styles/globals.css      Thème (couleurs, typographie, animations)
public/images, public/icons   Emplacements réservés aux assets statiques
```

## Design system

Chaque composant de `components/ui` est documenté par un commentaire décrivant
son rôle et ses cas d'usage. Règles générales :

- moins de 250 lignes par composant
- TypeScript strict, aucun `any`
- `Badge` porte du sens (domaine, statut) ; `Tag` est un libellé neutre
- `Container`/`Section` centralisent la mise en page : ne pas dupliquer les
  classes `mx-auto max-w-* px-*` dans les pages

## Accessibilité

- Lien d'évitement (« Aller au contenu principal ») dans le layout racine
- Navigation clavier complète (focus visibles, `aria-current`, Échap ferme les
  panneaux via Radix)
- Menu mobile et recherche globale respectent `prefers-reduced-motion`
- Palette vérifiée pour un contraste AA sur fond clair

## Scripts

- `npm run dev` — serveur de développement
- `npm run build` — build de production
- `npm run start` — serveur de production
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier
- `npm run typecheck` — vérification TypeScript
