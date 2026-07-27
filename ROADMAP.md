# Roadmap

Ce document distingue ce qui est **livré dans la RC1** de ce qui reste
**hors périmètre**, volontairement, pour une V2. Il ne s'agit pas d'un
engagement de délai, mais d'un état des lieux honnête pour quiconque reprend
ce projet.

## Livré (RC1)

- Site public complet : accueil, Comprendre, Veille juridique, Glossaire,
  Ressources (liste statique), À propos, Contact (formulaire non branché),
  pages légales.
- Recherche globale (`Ctrl/Cmd+K`).
- SEO transversal : métadonnées, JSON-LD, sitemaps, fil d'Ariane, robots.
- Espace d'administration : édition riche par blocs, SEO par contenu,
  médiathèque, workflow de statuts, historique de révisions (démonstration).
- Design system documenté, audité pour l'accessibilité (WCAG AA) et la
  cohérence visuelle.
- Documentation projet complète (ce dépôt).

## Hors périmètre de la RC1 (connu, assumé)

Ces points sont des **prérequis avant toute mise en production commerciale
réelle** — ils ne sont pas des oublis, mais des choix explicites pour garder
cette phase focalisée sur l'expérience éditoriale et publique :

1. **Authentification réelle sur `/admin`.** `lib/admin/auth.ts` retourne un
   utilisateur fixe ; n'importe qui atteignant l'URL a un accès complet.
   Priorité n°1 avant toute exposition publique de l'admin (NextAuth, Clerk,
   Supabase Auth… `getCurrentAdminUser()` est le point d'entrée unique à
   modifier).
2. **Persistance réelle.** `lib/admin/repository.ts` est un dépôt en mémoire
   (perdu au redémarrage). Le remplacer par une vraie base de données ne
   touche que ce fichier et les server actions de `lib/admin/*-actions.ts` —
   aucun composant à modifier.
3. **Connexion du back-office au site public.** Aujourd'hui, le contenu
   édité dans `/admin` n'est jamais lu par les pages publiques (qui lisent
   `data/*.ts`). Faire de l'admin la source de vérité réelle du site public
   est le chantier qui donne tout son sens à l'espace de rédaction.
4. **Page Ressources publique complète.** La page liste aujourd'hui un état
   "à venir" ; les données existent (`data/ressources.ts`) et le CRUD admin
   est fonctionnel — il ne manque qu'un explorateur public du même niveau
   que Comprendre/Veille/Glossaire.
5. **Formulaire de contact fonctionnel.** Le formulaire est visuellement
   complet mais son bouton d'envoi est désactivé (aucun traitement serveur
   ni service d'e-mail branché).
6. **Tests automatisés.** Aucun test unitaire, d'intégration ou end-to-end
   n'existe à ce jour. À prioriser dès qu'une vraie base de données est
   branchée (le risque de régression silencieuse augmente fortement).
7. **PWA activée.** Le manifeste et les favicons dynamiques existent ; il
   manque les icônes statiques 192×192/512×512 (maskables) et un service
   worker si le mode hors-ligne est souhaité.
8. **Analytics et Search Console réels.** L'intégration existe
   (`components/analytics/analytics-scripts.tsx`) mais n'est activée par
   aucun identifiant en l'état — à renseigner via les variables
   d'environnement documentées dans `.env.example`.
9. **Domaine et identité sociale réels.** `siteConfig.url` et
   `siteConfig.twitterHandle` sont des valeurs d'exemple.

## Pistes V2 (au-delà de la remise à niveau ci-dessus)

- Internationalisation (le site est actuellement 100 % français).
- Pages de détail dédiées pour les termes du glossaire et les ressources
  (aujourd'hui : ancres sur une page unique).
- Notifications/abonnement à la veille juridique (alerte par thème).
- Rôles et permissions réels dans l'admin (le type `AdminUser.role` existe
  déjà mais n'est pas exploité pour restreindre des actions).
- Historique de révisions avec un vrai diff de contenu (aujourd'hui : les
  métadonnées de version existent, pas le contenu historisé).
- Monitoring de performance réel (Core Web Vitals en production) une fois
  un domaine réel disponible.

## Non prévu

- Multi-tenant / marque blanche.
- Application mobile native (une PWA installable suffit à l'usage visé).
