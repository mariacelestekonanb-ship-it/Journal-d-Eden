/**
 * Point d'entrée public du module Auth. Les autres modules (et les routes
 * de `src/app/`) ne doivent importer que depuis ce fichier — jamais un
 * chemin profond vers `providers/`, `hooks/`, `components/`, `services/`,
 * `actions/`, etc.
 */
export { AuthProvider } from "./providers/auth-provider";
export { RoleProvider } from "./providers/role-provider";
export { useAuth } from "./hooks/use-auth";
export { useRole, type UseRoleResult } from "./hooks/use-role";
export { useUser, type UseUserResult } from "./hooks/use-user";
export { signOutAction } from "./actions/sign-out.action";
export { LoginForm } from "./components/login-form";
export { ForgotPasswordForm } from "./components/forgot-password-form";
export { ResetPasswordForm } from "./components/reset-password-form";
export { ResetPasswordView } from "./components/reset-password-view";
