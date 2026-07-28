"use client";

import { Plus, Users } from "lucide-react";
import * as React from "react";

import { PageHeader } from "@/shared/components/page-header";
import { EmptyState } from "@/shared/components/states/empty-state";
import { ErrorState } from "@/shared/components/states/error-state";
import { TableLoadingState } from "@/shared/components/states/loading-state";
import { Button } from "@/shared/components/ui/button";

import { useAdminUsers } from "../hooks/use-admin-users";
import { InviteUserDialog } from "./invite-user-dialog";
import { UsersTable } from "./users-table";

export function AdminView({ currentUserId }: { currentUserId: string }) {
  const { data: users, isLoading, isError, refetch } = useAdminUsers();
  const [inviteOpen, setInviteOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="Gérez les comptes des conducteurs de prière et leurs rôles."
        actions={
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="size-4" />
            Inviter un conducteur
          </Button>
        }
      />

      {isLoading && <TableLoadingState rows={5} />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {users && users.length === 0 && (
        <EmptyState
          icon={Users}
          title="Aucun utilisateur"
          description="Invitez le premier conducteur de prière pour commencer."
          action={<Button onClick={() => setInviteOpen(true)}>Inviter un conducteur</Button>}
        />
      )}

      {users && users.length > 0 && <UsersTable users={users} currentUserId={currentUserId} />}

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
