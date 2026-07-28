import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface SectionTitleProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

/** En-tête de section réutilisable : icône + titre + description + action optionnelle. */
export function SectionTitle({ title, description, icon: Icon, action }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent" aria-hidden="true">
            <Icon className="size-4 text-accent-foreground" />
          </span>
        )}
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
