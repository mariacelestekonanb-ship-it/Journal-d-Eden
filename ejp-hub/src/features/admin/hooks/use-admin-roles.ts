"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUser } from "@/features/auth/hooks/use-user";
import { MemberService, type Member, type MemberRole } from "@/features/members";

export const ADMIN_ROLE_MEMBERS_KEY = ["admin", "roles", "members"] as const;

/**
 * Liste des membres pour la gestion des rôles — passe toujours `role: "ADMIN"`
 * au `MemberService.list` public (cette page n'est accessible qu'aux ADMIN,
 * voir `ROUTE_PERMISSIONS`), pour obtenir la vue complète plutôt qu'une vue
 * limitée au seul profil courant.
 */
export function useAdminRoleMembers() {
  const { profile } = useUser();

  return useQuery({
    queryKey: [...ADMIN_ROLE_MEMBERS_KEY, profile?.id],
    queryFn: () => MemberService.list({ userId: profile!.id, role: "ADMIN" }),
    enabled: !!profile,
  });
}

export function useChangeAdminMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role, adminId }: { id: string; role: MemberRole; adminId: string }) =>
      MemberService.changeRole(id, role, adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_ROLE_MEMBERS_KEY });
      toast.success("Rôle mis à jour.");
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export type { Member };
