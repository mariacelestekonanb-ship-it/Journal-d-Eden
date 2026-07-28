"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useToggleUserActive, useUpdateUserRole } from "../hooks/use-admin-users";
import type { AdminProfile } from "../types/user.types";

export function UsersTable({ users, currentUserId }: { users: AdminProfile[]; currentUserId: string }) {
  const updateRole = useUpdateUserRole();
  const toggleActive = useToggleUserActive();

  return (
    <div className="rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Actif</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-foreground">
                  {user.full_name}
                  {isSelf && (
                    <Badge variant="outline" className="ml-2">
                      Vous
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    disabled={isSelf}
                    onValueChange={(role) => updateRole.mutate({ id: user.id, role: role as "admin" | "conducteur" })}
                  >
                    <SelectTrigger className="h-8 w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conducteur">Conducteur de prière</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={user.is_active}
                    disabled={isSelf}
                    onCheckedChange={(checked) => toggleActive.mutate({ id: user.id, isActive: checked })}
                    aria-label={user.is_active ? "Désactiver le compte" : "Activer le compte"}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
