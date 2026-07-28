"use client";

import { Trash2 } from "lucide-react";

import { formatRelative } from "@/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

import type { TestimonyWithAuthor } from "../types/testimony.types";

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TestimonyCard({
  testimony,
  canDelete,
  onDelete,
}: {
  testimony: TestimonyWithAuthor;
  canDelete: boolean;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={testimony.author.avatar_url ?? undefined} alt={testimony.author.full_name} />
            <AvatarFallback className="text-xs">{getInitials(testimony.author.full_name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{testimony.author.full_name}</p>
            <p className="text-xs text-muted-foreground">{formatRelative(testimony.created_at)}</p>
          </div>
        </div>
        {canDelete && (
          <Button variant="ghost" size="icon" aria-label="Supprimer" onClick={onDelete}>
            <Trash2 className="size-4 text-destructive" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        <p className="font-semibold text-foreground">{testimony.title}</p>
        <p className="whitespace-pre-line text-sm text-muted-foreground">{testimony.content}</p>
      </CardContent>
    </Card>
  );
}
