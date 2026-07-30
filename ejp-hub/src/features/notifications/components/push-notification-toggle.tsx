"use client";

import { BellRing, Smartphone } from "lucide-react";

import { AppCard } from "@/shared/components/app-card";
import { Switch } from "@/shared/ui/switch";

import { usePushSubscription } from "../hooks/use-push-subscription";

/**
 * Active/désactive les notifications push sur **cet appareil**. Un
 * abonnement est propre à un navigateur/appareil : l'activer sur son
 * téléphone ne l'active pas automatiquement sur son ordinateur, et
 * inversement — c'est le comportement attendu (chacun choisit où il veut
 * être notifié).
 */
export function PushNotificationToggle() {
  const { status, isLoading, isSupported, subscribe, unsubscribe } = usePushSubscription();

  if (!isSupported) {
    return (
      <AppCard className="flex items-start gap-3 p-4">
        <Smartphone className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-foreground">Notifications sur cet appareil</p>
          <p className="text-muted-foreground">
            Non disponible dans ce navigateur. Sur iPhone : ouvrez ce site dans Safari, appuyez sur le bouton
            « Partager », puis « Sur l&apos;écran d&apos;accueil » — réessayez ensuite depuis l&apos;icône ajoutée.
          </p>
        </div>
      </AppCard>
    );
  }

  return (
    <AppCard className="flex items-start justify-between gap-3 p-4">
      <div className="flex items-start gap-3">
        <BellRing className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div className="space-y-1 text-sm">
          <p className="font-medium text-foreground">Notifications sur cet appareil</p>
          <p className="text-muted-foreground">
            {status === "denied"
              ? "Bloquées dans les réglages de votre navigateur — autorisez les notifications pour ce site pour les réactiver."
              : "Recevez directement sur ce téléphone/ordinateur les mêmes événements que la cloche de notifications."}
          </p>
        </div>
      </div>
      <Switch
        checked={status === "subscribed"}
        disabled={isLoading || status === "denied" || status === "checking"}
        onCheckedChange={(checked) => (checked ? subscribe() : unsubscribe())}
        aria-label="Activer les notifications push sur cet appareil"
      />
    </AppCard>
  );
}
