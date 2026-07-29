"use client";

import { useQuery } from "@tanstack/react-query";

import { useUser } from "@/features/auth";

import type { MemberListContext } from "../repositories/member-repository";
import { MemberService } from "../services/member.service";

export const MEMBERS_KEY = ["members", "list"] as const;

/** Contexte du visiteur courant, utilisé pour l'isolation par rôle (voir `MemberRepository`). */
export function useMemberListContext(): MemberListContext | null {
  const { profile } = useUser();
  if (!profile) return null;
  return { userId: profile.id, role: profile.role };
}

export function useMembers() {
  const context = useMemberListContext();

  return useQuery({
    queryKey: [...MEMBERS_KEY, context?.userId, context?.role],
    queryFn: () => MemberService.list(context as MemberListContext),
    enabled: !!context,
  });
}

export function useMember(id: string | undefined) {
  const context = useMemberListContext();

  return useQuery({
    queryKey: ["members", "detail", id, context?.userId],
    queryFn: () => MemberService.getById(id as string, context as MemberListContext),
    enabled: !!id && !!context,
  });
}

export function useMemberAssignments(memberId: string | undefined) {
  return useQuery({
    queryKey: ["members", "assignments", memberId],
    queryFn: () => MemberService.listAssignments(memberId as string),
    enabled: !!memberId,
  });
}

export function useMemberReports(memberId: string | undefined) {
  return useQuery({
    queryKey: ["members", "reports", memberId],
    queryFn: () => MemberService.listReports(memberId as string),
    enabled: !!memberId,
  });
}
