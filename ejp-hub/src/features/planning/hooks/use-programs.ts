"use client";

import { useQuery } from "@tanstack/react-query";

import { ProgramService } from "../services/program.service";

export const PROGRAMS_KEY = ["planning", "programs"] as const;

export function usePrograms() {
  return useQuery({
    queryKey: PROGRAMS_KEY,
    queryFn: () => ProgramService.list(),
  });
}
