"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

import { useUpdateProfile } from "../hooks/use-profile";
import { profileSchema, type ProfileFormValues } from "../validation/profile.schema";

export function ProfileForm({
  userId,
  defaultValues,
}: {
  userId: string;
  defaultValues: ProfileFormValues;
}) {
  const updateMutation = useUpdateProfile(userId);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(values: ProfileFormValues) {
    await updateMutation.mutateAsync(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="full_name">Nom complet</Label>
        <Input id="full_name" aria-invalid={!!errors.full_name} {...register("full_name")} />
        {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" {...register("phone")} />
      </div>

      <Button type="submit" disabled={updateMutation.isPending || !isDirty}>
        {updateMutation.isPending && <Loader2 className="size-4 animate-spin" />}
        Enregistrer
      </Button>
    </form>
  );
}
