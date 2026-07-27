# Politique de sécurité

## Versions supportées

Ce projet n'a pas encore de version stable publiée : seule la branche
principale (Release Candidate en cours) reçoit des correctifs de sécurité.

| Version                           | Supportée |
| --------------------------------- | --------- |
| `1.0.0-rc.x` (branche principale) | ✅        |
| Versions antérieures (`0.x`)      | ❌        |

## Limites de sécurité connues (avant mise en production réelle)

Cette Release Candidate est un état fonctionnellement complet pour une
démonstration, **pas encore prête pour une exposition publique sensible**.
Les points suivants sont documentés en toute transparence :

- **Aucune authentification réelle sur `/admin`.** `lib/admin/auth.ts`
  retourne systématiquement un utilisateur fictif ; il n'existe aujourd'hui
  aucun contrôle d'accès applicatif. `/admin` est explicitement exclu de
  l'indexation (`robots.ts`, balise `robots: noindex` sur chaque page
  admin), ce qui réduit la découvrabilité mais **ne remplace pas** un
  contrôle d'accès. Ne jamais déployer cette RC sur un domaine public sans
  ajouter une authentification réelle en amont (middleware Next.js, proxy
  d'authentification, ou solution tierce).
- **Persistance en mémoire.** Le dépôt de contenu admin
  (`lib/admin/repository.ts`) vit en mémoire process ; il n'y a ni base de
  données ni chiffrement à auditer à ce stade, mais aussi aucune donnée
  réellement sensible n'est stockée (contenus de démonstration uniquement).
- **Aucun secret dans ce dépôt.** Toutes les variables d'environnement
  consommées (voir `.env.example`) sont préfixées `NEXT_PUBLIC_` : ce sont
  des identifiants publics par nature (analytics, vérification webmaster),
  jamais des clés privées ou des chaînes de connexion.
- **Formulaire de contact non fonctionnel.** Aucune donnée utilisateur
  n'est aujourd'hui transmise ou stockée via `app/contact`.

## En-têtes de sécurité

Le projet définit des en-têtes de sécurité HTTP par défaut dans
`next.config.ts` (Content-Security-Policy, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`). Avant
mise en production, vérifier que la CSP reste alignée avec les scripts
tiers réellement activés (Google Analytics, Microsoft Clarity, Plausible —
voir `.env.example`) : chaque script analytics ajouté doit être reflété
dans la directive `script-src`/`connect-src` de la CSP.

## Signaler une vulnérabilité

**Ne pas ouvrir d'issue publique pour une vulnérabilité de sécurité.**

Pour signaler un problème de sécurité, contacter les mainteneurs du projet
directement (voir les coordonnées du dépôt / `siteConfig.email` dans
`lib/site-config.ts`) avec :

- une description du problème et de son impact potentiel,
- les étapes pour le reproduire,
- toute preuve de concept, si disponible.

Un accusé de réception est visé sous 5 jours ouvrés. Merci de laisser un
délai raisonnable pour la correction avant toute divulgation publique
(divulgation responsable).

## Bonnes pratiques pour les contributeurs

- Ne jamais committer de fichier `.env*` réel (voir `.gitignore`, qui les
  exclut déjà) ni de secret en dur dans le code.
- Toute nouvelle dépendance doit être justifiée (voir `CONTRIBUTING.md`) :
  moins de dépendances signifie moins de surface d'attaque.
- Signaler immédiatement tout composant qui contournerait les en-têtes de
  sécurité définis dans `next.config.ts`.
