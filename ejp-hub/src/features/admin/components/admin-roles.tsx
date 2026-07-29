"use client";

import * as React from "react";

import { useUser } from "@/features/auth";
import { MemberStatusBadge } from "@/features/members";
import { AppAvatar } from "@/shared/components/app-avatar";
import { AppCard } from "@/shared/components/app-card";
import { ROLES, ROLE_LABELS, type Role } from "@/shared/constants/roles";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import { useAdminRoleMembers, useChangeAdminMemberRole } from "../hooks/use-admin-roles";
import { AdminEmptyState } from "./admin-empty-state";

/**
 * Gestion des rôles — consulte et modifie le rôle de chaque membre.
 * Ne réimplémente rien : `MemberService.changeRole` (déjà utilisé par la
 * fiche membre) est la seule voie d'écriture, ici comme là-bas. Évolutif :
 * un futur rôle n'a qu'à être ajouté à `ROLES`/`ROLE_LABELS`.
 */
export function AdminRoles() {
  const { profile } = useUser();
  const { data: members, isLoading } = useAdminRoleMembers();
  const changeRoleMutation = useChangeAdminMemberRole();
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    const list = members ?? [];
    if (!query) return list;
    return list.filter((member) => `${member.fullName} ${member.email}`.toLowerCase().includes(query));
  }, [members, search]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher un membre…"
        aria-label="Rechercher un membre par nom ou e-mail"
        className="max-w-sm"
      />

      {filtered.length === 0 ? (
        <AdminEmptyState title="Aucun membre" description="Aucun membre ne correspond à cette recherche." />
      ) : (
        <AppCard className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membre</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Rôle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((member) => {
                const isOwnAccount = profile?.id === member.id;
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AppAvatar name={member.fullName} src={member.photoUrl} className="size-8" />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-foreground">{member.fullName}</p>
                          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <MemberStatusBadge status={member.status} />
                    </TableCell>
                    <TableCell>
                      {isOwnAccount ? (
                        <span className="text-sm text-muted-foreground">
                          {ROLE_LABELS[member.role]} <span className="text-xs">(votre compte)</span>
                        </span>
                      ) : (
                        <Select
                          value={member.role}
                          onValueChange={(value) =>
                            profile && changeRoleMutation.mutate({ id: member.id, role: value as Role, adminId: profile.id })
                          }
                        >
                          <SelectTrigger className="w-48" aria-label={`Modifier le rôle de ${member.fullName}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {ROLE_LABELS[role]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </AppCard>
      )}
    </div>
  );
}
