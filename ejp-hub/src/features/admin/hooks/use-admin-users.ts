"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type { UserRole } from "@/types/database";

import { inviteUserAction } from "../actions/invite-user.action";
import { listProfiles, toggleUserActive, updateUserRole } from "../services/admin.service";
import type { InviteUserFormValues } from "../validation/invite-user.schema";

const USERS_KEY = ["admin-users"] as const;

export function useAdminUsers() {
  return useQuery({
    queryKey: USERS_KEY,
    queryFn: listProfiles,
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values: InviteUserFormValues) => {
      const result = await inviteUserAction(values);
      if (!result.success) throw new Error(result.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("Invitation envoyée par e-mail.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
      toast.success("Rôle mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleUserActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_KEY });
    },
    onError: (error) => toast.error(error.message),
  });
}
