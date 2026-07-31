"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { acceptMemberAction } from "../actions/accept-member.action";
import { changeMemberRoleAction } from "../actions/change-member-role.action";
import { deleteMemberAction } from "../actions/delete-member.action";
import { reactivateMemberAction } from "../actions/reactivate-member.action";
import { refuseMemberAction } from "../actions/refuse-member.action";
import { restoreMemberAction } from "../actions/restore-member.action";
import { suspendMemberAction } from "../actions/suspend-member.action";
import { updateOwnProfileAction } from "../actions/update-own-profile.action";
import type { MemberRole } from "../types/member.types";
import { MEMBERS_KEY } from "./use-members";

function useInvalidateMembers() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: MEMBERS_KEY });
}

export function useAcceptMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, adminId }: { id: string; adminId: string }) => acceptMemberAction(id, adminId),
    onSuccess: () => {
      invalidate();
      toast.success("Demande acceptée — le compte est actif.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useRefuseMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, adminId }: { id: string; adminId: string }) => refuseMemberAction(id, adminId),
    onSuccess: () => {
      invalidate();
      toast.success("Demande refusée.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useSuspendMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, adminId }: { id: string; adminId: string }) => suspendMemberAction(id, adminId),
    onSuccess: () => {
      invalidate();
      toast.success("Membre suspendu.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useReactivateMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: (id: string) => reactivateMemberAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Membre réactivé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useDeleteMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, adminId }: { id: string; adminId: string }) => deleteMemberAction(id, adminId),
    onSuccess: () => {
      invalidate();
      toast.success("Membre supprimé.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useRestoreMember() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: (id: string) => restoreMemberAction(id),
    onSuccess: () => {
      invalidate();
      toast.success("Membre restauré.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useChangeMemberRole() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, role, adminId }: { id: string; role: MemberRole; adminId: string }) =>
      changeMemberRoleAction(id, role, adminId),
    onSuccess: () => {
      invalidate();
      toast.success("Rôle mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdateOwnProfile() {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ id, values, photo }: { id: string; values: { phone: string }; photo?: File }) =>
      updateOwnProfileAction(id, values, photo),
    onSuccess: () => {
      invalidate();
      toast.success("Profil mis à jour.");
    },
    onError: (error) => toast.error(error.message),
  });
}
