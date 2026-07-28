import { Loader2 } from "lucide-react";
import * as React from "react";

import { Button, type ButtonProps } from "@/shared/ui/button";

export interface AppButtonProps extends ButtonProps {
  isLoading?: boolean;
}

/**
 * Wrapper de `Button` avec un état de chargement intégré, utilisé partout
 * dans l'application pour garantir un retour visuel cohérent sur les actions.
 */
export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ isLoading, disabled, children, ...props }, ref) => (
    <Button ref={ref} disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </Button>
  ),
);
AppButton.displayName = "AppButton";
