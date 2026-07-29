"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { AppButton } from "@/shared/components/app-button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

import { DEFAULT_MEMBER_JOIN_FORM_VALUES, memberJoinSchema, type MemberJoinFormValues } from "../validation/member-join.schema";

export interface MemberJoinFormProps {
  isSubmitting: boolean;
  onSubmit: (values: MemberJoinFormValues) => void;
}

/** Formulaire public « Rejoindre les Conducteurs de prière » — validation Zod complète, messages explicites. */
export function MemberJoinForm({ isSubmitting, onSubmit }: MemberJoinFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<MemberJoinFormValues>({
    resolver: zodResolver(memberJoinSchema),
    defaultValues: DEFAULT_MEMBER_JOIN_FORM_VALUES,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="firstName">Prénom</Label>
        <Input id="firstName" autoComplete="given-name" aria-invalid={!!errors.firstName} {...register("firstName")} />
        {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Nom</Label>
        <Input id="lastName" autoComplete="family-name" aria-invalid={!!errors.lastName} {...register("lastName")} />
        {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" type="tel" autoComplete="tel" aria-invalid={!!errors.phone} {...register("phone")} />
        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Photo (optionnelle)</Label>
        <Controller
          control={control}
          name="photo"
          render={({ field: { onChange, onBlur, ref, name } }) => (
            <Input
              id="photo"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              name={name}
              ref={ref}
              onBlur={onBlur}
              onChange={(event) => onChange(event.target.files?.[0])}
            />
          )}
        />
        {errors.photo && <p className="text-xs text-destructive">{errors.photo.message as string}</p>}
      </div>

      <AppButton type="submit" className="w-full" isLoading={isSubmitting}>
        Envoyer ma demande d&apos;adhésion
      </AppButton>
    </form>
  );
}
