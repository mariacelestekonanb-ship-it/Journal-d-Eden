"use client";

import { Camera, Loader2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";

import { useUploadAvatar } from "../hooks/use-profile";

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

export function AvatarUploader({
  userId,
  fullName,
  avatarUrl,
}: {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
}) {
  const uploadMutation = useUploadAvatar(userId);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Le fichier doit être une image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("L'image ne doit pas dépasser 4 Mo.");
      return;
    }

    uploadMutation.mutate(file);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <Avatar className="size-16">
          <AvatarImage src={avatarUrl ?? undefined} alt={fullName} />
          <AvatarFallback className="text-lg">{getInitials(fullName)}</AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          aria-label="Changer la photo de profil"
        >
          {uploadMutation.isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Camera className="size-3.5" />
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
      </div>
      <div>
        <p className="font-medium text-foreground">{fullName}</p>
        <p className="text-xs text-muted-foreground">JPG, PNG ou WEBP · 4 Mo max.</p>
      </div>
    </div>
  );
}
