import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import type { CurrentProfile } from "@/lib/auth/get-current-profile";

import { AvatarUploader } from "./avatar-uploader";
import { ChangePasswordForm } from "./change-password-form";
import { ProfileForm } from "./profile-form";

export function ProfileView({ profile }: { profile: CurrentProfile }) {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Mon profil</h1>
        <p className="text-sm text-muted-foreground">Gérez vos informations personnelles et votre sécurité.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AvatarUploader userId={profile.id} fullName={profile.full_name} avatarUrl={profile.avatar_url} />
            <ProfileForm
              userId={profile.id}
              defaultValues={{ full_name: profile.full_name, phone: profile.phone ?? "" }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
