"use client";

import * as React from "react";
import { toast } from "sonner";

import { useUser } from "@/features/auth";

import { deletePushSubscriptionQuery, savePushSubscriptionQuery } from "../queries/push-subscription.queries";
import { urlBase64ToUint8Array } from "../utils/push";

export type PushSubscriptionStatus = "checking" | "unsupported" | "denied" | "subscribed" | "unsubscribed";

/**
 * Abonnement de cet appareil aux notifications Web Push. `unsupported` couvre
 * aussi bien un navigateur trop ancien qu'un iPhone qui n'a pas encore
 * « ajouté l'application à l'écran d'accueil » — Safari n'expose l'API Push
 * que dans ce contexte (voir NOTIFICATIONS.md#push).
 */
export function usePushSubscription() {
  const { profile } = useUser();
  const [status, setStatus] = React.useState<PushSubscriptionStatus>("checking");
  const [isLoading, setIsLoading] = React.useState(false);

  const isSupported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  React.useEffect(() => {
    if (!isSupported) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    let cancelled = false;
    navigator.serviceWorker.ready.then(async (registration) => {
      const existing = await registration.pushManager.getSubscription();
      if (!cancelled) setStatus(existing ? "subscribed" : "unsubscribed");
    });
    return () => {
      cancelled = true;
    };
  }, [isSupported]);

  const subscribe = React.useCallback(async () => {
    if (!profile || !isSupported) return;
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) throw new Error("Notifications push non configurées côté serveur.");

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });
      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys.auth) {
        throw new Error("Abonnement incomplet renvoyé par le navigateur.");
      }

      await savePushSubscriptionQuery(profile.id, {
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      });
      setStatus("subscribed");
    } catch (error) {
      // Sans ce catch, un échec (ex. `pushManager.subscribe()` rejeté par le
      // navigateur — Google Play Services absent/désactivé, réseau bloquant
      // fcm.googleapis.com…) restait une simple exception non gérée : rien à
      // l'écran, l'interrupteur ne s'active pas mais l'utilisateur n'a aucune
      // indication que quelque chose a échoué.
      toast.error(
        error instanceof Error ? error.message : "Impossible d'activer les notifications sur cet appareil.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [profile, isSupported]);

  const unsubscribe = React.useCallback(async () => {
    if (!isSupported) return;
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      if (existing) {
        await deletePushSubscriptionQuery(existing.endpoint);
        await existing.unsubscribe();
      }
      setStatus("unsubscribed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Impossible de désactiver les notifications sur cet appareil.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return { status, isLoading, isSupported, subscribe, unsubscribe };
}
