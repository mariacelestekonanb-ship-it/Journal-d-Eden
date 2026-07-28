# auth

Authentification Supabase : connexion, mot de passe oublié, déconnexion.

- `components/` : `LoginForm`, `ForgotPasswordForm`.
- `services/` : `auth.service.ts` (appels `supabase.auth.*` côté client).
- `validation/` : schémas Zod des formulaires de connexion.
- `actions/` : `sign-out.action.ts` (Server Action).

Le profil applicatif (rôle, infos personnelles) est géré séparément par
`shared/lib/auth/get-current-profile.ts` et le module `profile`.
