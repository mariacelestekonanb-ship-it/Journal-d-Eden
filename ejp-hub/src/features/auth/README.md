# auth

Authentification Supabase et session applicative : connexion, mot de passe oublié,
réinitialisation, déconnexion, contexte de rôle.

```
services/      # auth.service.ts (appels supabase.auth.* côté client)
validation/    # Schémas Zod (connexion, mot de passe oublié, réinitialisation)
actions/       # sign-out.action.ts (Server Action)
providers/     # AuthProvider (session Supabase), RoleProvider (profil applicatif)
hooks/         # useAuth, useRole, useUser
components/    # LoginForm, ForgotPasswordForm, ResetPasswordForm, ResetPasswordView
```

Le profil applicatif (rôle, infos personnelles) est résolu côté serveur par
`shared/lib/auth/get-current-profile.ts` et exposé côté client via `RoleProvider`/`useUser`.

## Import

```ts
import { useUser, LoginForm, signOutAction } from "@/features/auth";
```
