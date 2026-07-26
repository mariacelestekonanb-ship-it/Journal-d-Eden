import { Badge, type BadgeProps } from "@/components/ui/badge";
import { getThemeBySlug } from "@/lib/content";

const THEME_VARIANTS: Record<string, BadgeProps["variant"]> = {
  "droit-spatial": "navy",
  "droit-numerique": "accent",
  "intelligence-artificielle": "outline",
  telecommunications: "default",
  institutions: "default",
};

export interface TermBadgeProps {
  theme: string;
}

/** Étiquette de catégorie d'un terme du glossaire — une par thème (voir `data/themes.ts`). */
export function TermBadge({ theme }: TermBadgeProps) {
  const themeData = getThemeBySlug(theme);

  return (
    <Badge variant={THEME_VARIANTS[theme] ?? "default"}>
      {themeData?.titre ?? theme}
    </Badge>
  );
}
