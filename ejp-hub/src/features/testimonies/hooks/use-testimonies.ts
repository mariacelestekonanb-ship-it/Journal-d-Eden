"use client";

import { useQuery } from "@tanstack/react-query";

import { TestimonyService } from "../services/testimony.service";

export const TESTIMONIES_KEY = ["testimonies", "list"] as const;

export function useTestimonies() {
  return useQuery({
    queryKey: TESTIMONIES_KEY,
    queryFn: () => TestimonyService.list(),
  });
}
