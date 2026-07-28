"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updatePassword, updateProfile, uploadAvatar } from "../services/profile.service";
import type { ProfileFormValues } from "../validation/profile.schema";

export function useUpdateProfile(userId: string) {
  const router = useRouter();
  return useMutation({
    mutationFn: (values: ProfileFormValues) => updateProfile(userId, values),
    onSuccess: () => {
      toast.success("Profil mis à jour.");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUploadAvatar(userId: string) {
  const router = useRouter();
  return useMutation({
    mutationFn: (file: File) => uploadAvatar(userId, file),
    onSuccess: () => {
      toast.success("Photo de profil mise à jour.");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (password: string) => updatePassword(password),
    onSuccess: () => toast.success("Mot de passe mis à jour."),
    onError: (error) => toast.error(error.message),
  });
}
