import { getInitials } from "@/shared/utils/get-initials";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";

export interface AppAvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

/** Avatar standard de l'application : image si disponible, sinon initiales du nom. */
export function AppAvatar({ name, src, className }: AppAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={src ?? undefined} alt={name} />
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}
